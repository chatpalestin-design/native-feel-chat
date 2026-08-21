import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Bell,
  Camera,
  ChevronRight,
  Home,
  LayoutGrid,
  MessageSquare,
  Mic,
  MessageSquareText,
  MoreVertical,
  BarChart3,
  AlertCircle,
  AlertTriangle,
  Gift,
  Reply,
  UserCircle2,
  Play,
  Radio,
  Settings,
  HelpCircle,
  LogOut,
  Smile,
  Users,
  Video,
  ListFilter,
  Pause,
  Volume2,
} from "lucide-react";
import { getRoom } from "@/data/rooms";
import { fetchMessages, sendMessage, type ApiMessage } from "@/lib/chat-api";
import { supabase } from "@/integrations/supabase/client";
import { MenuPanel, NotificationsPanel, PrivatePanel } from "@/components/MobilePanels";

const EMOJIS = [
  "😀","😁","😂","🤣","😊","😍","😘","😎","🤩","🥳",
  "😉","🙂","🤗","🤔","😐","😴","😢","😭","😡","🤯",
  "👍","👎","👏","🙏","💪","✌️","🤝","👋","💯","🔥",
  "❤️","💔","💖","🌹","🌸","⭐","✨","🎉","🎁","🎵",
  "☕","🍰","🍕","⚽","🏆","🚗","✈️","🌙","☀️","🇵🇸",
];

export const Route = createFileRoute("/room/$roomId")({
  head: ({ params }) => {
    const room = getRoom(params.roomId);
    const title = room ? `غرفة ${room.name} | دردشتي` : "غرفة الدردشة | دردشتي";
    const description = room
      ? `${room.desc} — دردشة نصية وصوتية مباشرة مع ${room.users} مستخدم داخل غرفة ${room.name}.`
      : "غرفة دردشة عربية مباشرة نصية وصوتية.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: RoomPage,
});

type Msg = {
  id: string;
  user: string;
  time: string;
  text: string;
  color: "red" | "blue" | "pink" | "ink";
  image?: string | null;
  badge?: "star" | "crown" | "verified";
  quote?: { user: string; text: string };
};

const colors = ["red", "blue", "pink", "ink"] as const;

function pickColor(name: string): Msg["color"] {
  let sum = 0;
  for (let i = 0; i < name.length; i += 1) sum += name.charCodeAt(i);
  return colors[sum % colors.length] as Msg["color"];
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toMsg(m: ApiMessage): Msg {
  return {
    id: m.id,
    user: m.nickname,
    time: formatTime(m.created_at),
    text: m.body,
    image: m.image_url,
    color: pickColor(m.nickname),
  };
}

const colorClass: Record<Msg["color"], string> = {
  red: "text-msg-red",
  blue: "text-msg-blue",
  pink: "text-msg-pink",
  ink: "text-msg-ink",
};

function Badge({ kind }: { kind: NonNullable<Msg["badge"]> }) {
  if (kind === "crown") return <span className="text-[13px] leading-none">👑</span>;
  if (kind === "verified")
    return (
      <span className="flex size-4 items-center justify-center rounded-full bg-brand-blue text-[9px] font-black text-brand-blue-foreground">
        ✓
      </span>
    );
  return <span className="text-[13px] leading-none text-brand-blue">★</span>;
}

const USER_ACTIONS = [
  { label: "رد على الرسالة", icon: Reply, solid: true },
  { label: "دردشة خاصة", icon: MessageSquareText, solid: true },
  { label: "أرسل هدية", icon: Gift, solid: false },
  { label: "ترقية هذا المستخدم", icon: BarChart3, solid: false },
  { label: "حظر هذا المستخدم", icon: AlertCircle, solid: false },
  { label: "الإبلاغ عن المستخدم", icon: AlertTriangle, solid: false },
  { label: "عرض الملف الشخصي", icon: UserCircle2, solid: false },
] as const;

const MENU_ACTIONS = [
  { label: "ملفي الشخصي", icon: UserCircle2, solid: false },
  { label: "الأصدقاء", icon: Users, solid: true },
  { label: "الهدايا والمتجر", icon: Gift, solid: false },
  { label: "الإشعارات", icon: Bell, solid: true },
  { label: "الإعدادات", icon: Settings, solid: false },
  { label: "المساعدة والدعم", icon: HelpCircle, solid: false },
  { label: "تسجيل الخروج", icon: LogOut, solid: false },
] as const;


function RoomPage() {
  const { roomId } = useParams({ from: "/room/$roomId" });
  const room = getRoom(roomId);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [nickname, setNickname] = useState("زائر");
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [sheetUser, setSheetUser] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [tab, setTab] = useState<"rooms" | "private" | "notifications" | "menu">("rooms");


  useEffect(() => {
    const saved = window.localStorage.getItem("chat-nickname");
    if (saved) setNickname(saved);
  }, []);

  useEffect(() => {
    let active = true;
    const load = () =>
      fetchMessages(roomId)
        .then((rows) => {
          if (active) setMessages(rows.map(toMsg));
        })
        .catch(() => undefined);

    load();
    const timer = window.setInterval(load, 4000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [roomId]);

  const push = async (value: string, imageUrl?: string) => {
    window.localStorage.setItem("chat-nickname", nickname);
    const created = await sendMessage(roomId, nickname, value, imageUrl);
    setMessages((m) => [...m, toMsg(created)]);
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setText("");
    setShowEmoji(false);
    try {
      await push(value);
    } catch {
      setText(value);
    }
  };

  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${roomId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("chat-images").upload(path, file, {
        contentType: file.type || "image/jpeg",
      });
      if (error) throw error;
      const { data } = await supabase.storage
        .from("chat-images")
        .createSignedUrl(path, 60 * 60 * 24 * 365);
      if (!data?.signedUrl) throw new Error("no url");
      await push(text.trim(), data.signedUrl);
      setText("");
    } catch {
      /* ignore */
    } finally {
      setUploading(false);
    }
  };


  const onlineUsers = Array.from(new Set([nickname, ...messages.map((m) => m.user)]));

  return (
    <div className="flex min-h-screen flex-col bg-chat-canvas">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center gap-2 bg-card px-2 py-2 lg:flex-row-reverse lg:px-4">
        <div className="flex items-center gap-2 lg:flex-row-reverse">
          <Link to="/" aria-label="رجوع" className="p-1 text-brand-blue">
            <ChevronRight className="size-7 lg:rotate-180" strokeWidth={3} />
          </Link>

          <span className="max-w-[110px] truncate rounded-full bg-secondary px-4 py-2 text-[15px] font-bold text-foreground">
            {room?.name ?? "غرفة"}
          </span>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-[image:var(--gradient-radio)] py-1 pl-1 pr-3 text-primary-foreground lg:hidden"
        >
          <span className="text-[14px] font-extrabold">راديو دردشتي</span>
          <span className="relative flex size-8 items-center justify-center rounded-full bg-card">
            <Play className="size-4 fill-foreground text-foreground" />
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-destructive" />
          </span>
        </button>

        <div className="flex items-center gap-2 lg:mr-auto lg:flex-row-reverse lg:gap-4">
          <button
            type="button"
            aria-label="الرئيسية"
            className="flex h-9 w-12 items-center justify-center rounded-lg bg-brand-blue text-brand-blue-foreground lg:h-auto lg:w-auto lg:bg-transparent lg:text-brand-blue"
          >
            <Home className="size-5 fill-current lg:hidden" />
            <MessageSquare className="hidden size-7 fill-current lg:block" />
          </button>
          <button
            type="button"
            aria-label="المستخدمون"
            className="flex h-9 w-12 items-center justify-center rounded-lg bg-brand-blue text-brand-blue-foreground lg:h-auto lg:w-auto lg:bg-transparent lg:text-brand-blue"
          >
            <Users className="size-5 fill-current lg:hidden" />
            <Bell className="hidden size-7 fill-current lg:block" />
          </button>
          <button type="button" aria-label="خيارات" className="p-1 text-foreground lg:text-brand-blue">
            <MoreVertical className="size-5 lg:size-6" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row-reverse lg:items-stretch">
        <section className="flex min-w-0 flex-1 flex-col">
          {/* Live strip */}
          <div className="relative flex items-center justify-between bg-card px-3 pb-2 lg:bg-transparent lg:pt-2">
            <div className="flex flex-col items-center lg:hidden">
              <div className="size-12 rounded-full bg-[image:var(--gradient-brand)] p-[2px]">
                <div className="flex size-full items-center justify-center rounded-full bg-card text-xs font-bold text-muted-foreground">
                  LIVE
                </div>
              </div>
              <span className="mt-0.5 rounded bg-destructive px-1 text-[9px] font-bold text-primary-foreground">
                LIVE
              </span>
              <span className="max-w-[70px] truncate text-[11px] font-bold text-foreground">(FlawLess)…</span>
            </div>
            <div className="hidden items-center gap-2 lg:flex">
              <span className="flex size-8 items-center justify-center rounded-full bg-brand-blue text-brand-blue-foreground">
                <Video className="size-4 fill-current" />
              </span>
              <span className="text-[14px] font-bold text-foreground">لا أحد في البث المباشر الآن</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 text-muted-foreground lg:items-center">
              <Radio className="size-5" />
              <span className="text-[13px] font-bold">بث مباشر</span>
            </div>
          </div>

          {/* Messages */}
          <main className="flex-1 space-y-2 px-2 py-3 lg:px-4">
            {messages.map((m) => (
              <div key={m.id} className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => setSheetUser(m.user)}
                  aria-label={`خيارات ${m.user}`}
                  className="size-11 shrink-0 overflow-hidden rounded-full bg-[image:var(--gradient-brand)]"
                />
                <div className="max-w-[78%] rounded-2xl bg-bubble px-3 py-2 shadow-[var(--shadow-card)] lg:max-w-[60%]">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSheetUser(m.user)}
                      className="truncate text-[15px] font-extrabold text-bubble-foreground"
                    >
                      {m.user}
                    </button>
                    {m.badge && <Badge kind={m.badge} />}
                    <span className="text-[11px] text-muted-foreground">{m.time}</span>
                  </div>
                  {m.quote && (
                    <div className="mt-1 rounded-md border-r-[3px] border-brand-blue bg-quote px-2 py-1">
                      <p className="text-[13px] font-bold text-bubble-foreground">{m.quote.user}</p>
                      <p className="text-[13px] text-muted-foreground">{m.quote.text}</p>
                    </div>
                  )}
                  {m.image && (
                    <img
                      src={m.image}
                      alt={`صورة أرسلها ${m.user}`}
                      loading="lazy"
                      className="mt-1 max-h-60 w-full rounded-xl object-cover"
                    />
                  )}
                  {m.text && (
                    <p className={`mt-1 text-[19px] font-bold ${colorClass[m.color]}`}>{m.text}</p>
                  )}
                </div>
              </div>
            ))}
          </main>

          {/* Emoji picker */}
          {showEmoji && (
            <div className="sticky bottom-[112px] z-10 max-h-44 overflow-y-auto border-t border-border bg-card px-2 py-2 lg:bottom-[70px]">
              <div className="grid grid-cols-8 gap-1">
                {EMOJIS.map((emo) => (
                  <button
                    key={emo}
                    type="button"
                    onClick={() => setText((t) => t + emo)}
                    className="rounded-lg py-1 text-2xl hover:bg-secondary"
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Composer */}
          <form
            onSubmit={send}
            className="sticky bottom-[58px] z-10 flex items-center gap-2 bg-card px-2 py-2 lg:bottom-0 lg:flex-wrap lg:gap-3 lg:px-4 lg:py-3"
          >
            <button
              type="button"
              aria-label="الرموز"
              onClick={() => setShowEmoji((v) => !v)}
              className="text-brand-blue"
            >
              <Smile className="size-8 fill-brand-blue text-card" />
            </button>
            <button type="button" aria-label="المزيد" className="text-brand-blue">
              <LayoutGrid className="size-6" />
            </button>
            <button type="button" aria-label="تسجيل صوتي" className="hidden text-brand-blue lg:block">
              <Mic className="size-6" />
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="رسالة عامة"
              className="h-10 flex-1 rounded-full border border-border bg-card px-4 text-[15px] text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring lg:order-last lg:h-11 lg:w-full lg:flex-none lg:basis-full lg:rounded-lg"
            />
            <button type="button" aria-label="تسجيل صوتي" className="text-brand-blue lg:hidden">
              <Mic className="size-6" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onPickImage}
              className="hidden"
            />
            <button
              type="button"
              aria-label="إرسال صورة"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="text-brand-blue disabled:opacity-50"
            >
              <Camera className="size-6 fill-brand-blue text-card" />
            </button>
            <button
              type="submit"
              aria-label="إرسال"
              className="flex size-9 items-center justify-center rounded-full bg-brand-blue text-brand-blue-foreground lg:order-last lg:size-10"
            >
              <ArrowUp className="size-5" strokeWidth={3} />
            </button>
          </form>
        </section>

        {/* Desktop sidebar */}
        <aside className="hidden w-[280px] shrink-0 flex-col border-r border-border bg-card lg:flex">
          <div className="flex items-center gap-2 border-b border-border p-2">
            <span className="size-11 shrink-0 rounded-lg bg-[image:var(--gradient-brand)]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-extrabold text-foreground">{nickname}</p>
              <div className="mt-1 flex items-center gap-2 text-[12px] font-bold text-muted-foreground">
                <span className="rounded bg-secondary px-1.5">🪙 0</span>
                <Gift className="size-4 text-brand-blue" />
              </div>
            </div>
            <ListFilter className="size-6 shrink-0 text-brand-blue" />
          </div>

          <div className="grid grid-cols-2 gap-2 p-2">
            <button
              type="button"
              className="flex items-center justify-center gap-1.5 rounded-md bg-brand-blue py-1.5 text-[13px] font-bold text-brand-blue-foreground"
            >
              <Users className="size-4 fill-current" />
              مستخدمين
            </button>
            <Link
              to="/"
              className="flex items-center justify-center gap-1.5 rounded-md bg-secondary py-1.5 text-[13px] font-bold text-foreground"
            >
              <Home className="size-4 fill-current" />
              غرف دردشتي
            </Link>
          </div>

          <div className="flex items-center gap-2 px-2">
            <input
              placeholder="بحث عن مستخدمين"
              className="h-8 w-full rounded-md bg-secondary px-3 text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
            />
            <ListFilter className="size-5 shrink-0 text-brand-blue" />
          </div>

          <p className="px-3 py-2 text-[13px] font-bold text-foreground">
            متصل الآن {onlineUsers.length}
          </p>

          <div className="flex-1 overflow-y-auto">
            {onlineUsers.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setSheetUser(u)}
                className="flex w-full items-center gap-2 border-b border-border px-2 py-2 text-right hover:bg-secondary/60"
              >
                <span className="relative size-9 shrink-0 rounded-lg bg-[image:var(--gradient-brand)]">
                  <span className="absolute -bottom-0.5 right-0 size-2.5 rounded-full border-2 border-card bg-green-500" />
                </span>
                <span className="min-w-0 flex-1 truncate text-[14px] font-bold text-foreground">{u}</span>
                <UserCircle2 className="size-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>

          <div className="m-2 rounded-xl bg-[image:var(--gradient-radio)] p-2 text-primary-foreground">
            <p className="text-left text-[14px] font-extrabold">راديو دردشتي</p>
            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                aria-label="إيقاف"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-card/30"
              >
                <Pause className="size-4 fill-current" />
              </button>
              <Volume2 className="size-4 shrink-0" />
              <input
                type="range"
                aria-label="مستوى الصوت"
                defaultValue={100}
                className="h-1 w-full accent-primary-foreground"
              />
              <span className="shrink-0 text-[11px] font-bold">100%</span>
            </div>
          </div>
        </aside>
      </div>


      {/* User action sheet */}
      {sheetUser && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-foreground/40"
          onClick={() => setSheetUser(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-2 mb-2 w-[calc(100%-1rem)] overflow-hidden rounded-2xl bg-card"
          >
            <p className="py-4 text-center text-[19px] font-extrabold text-foreground">
              {sheetUser}
            </p>
            {USER_ACTIONS.map(({ label, icon: Icon, solid }) => (
              <button
                key={label}
                type="button"
                onClick={() => setSheetUser(null)}
                className="flex w-full items-center gap-4 border-t border-border px-5 py-3.5 text-right"
              >
                <Icon
                  className={`size-7 shrink-0 text-brand-blue ${solid ? "fill-brand-blue" : ""}`}
                  strokeWidth={2.4}
                />
                <span className="text-[19px] font-extrabold text-brand-blue">{label}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSheetUser(null)}
              className="w-full border-t border-border py-3.5 text-center text-[19px] font-extrabold text-destructive"
            >
              الغاء
            </button>
          </div>
        </div>
      )}

      {/* Main menu sheet */}
      {showMenu && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-foreground/40"
          onClick={() => setShowMenu(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-2 mb-2 w-[calc(100%-1rem)] overflow-hidden rounded-2xl bg-card"
          >
            <p className="py-4 text-center text-[19px] font-extrabold text-foreground">
              القائمة
            </p>
            {MENU_ACTIONS.map(({ label, icon: Icon, solid }) => (
              <button
                key={label}
                type="button"
                onClick={() => setShowMenu(false)}
                className="flex w-full items-center gap-4 border-t border-border px-5 py-3.5 text-right"
              >
                <Icon
                  className={`size-7 shrink-0 text-brand-blue ${solid ? "fill-brand-blue" : ""}`}
                  strokeWidth={2.4}
                />
                <span className="text-[19px] font-extrabold text-brand-blue">{label}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowMenu(false)}
              className="w-full border-t border-border py-3.5 text-center text-[19px] font-extrabold text-destructive"
            >
              الغاء
            </button>
          </div>
        </div>
      )}


      {tab === "private" && <PrivatePanel onBack={() => setTab("rooms")} />}
      {tab === "notifications" && <NotificationsPanel onBack={() => setTab("rooms")} />}
      {tab === "menu" && (
        <MenuPanel
          onBack={() => setTab("rooms")}
          nickname={nickname}
          onLogout={() => {
            window.localStorage.removeItem("chat-nickname");
            window.localStorage.removeItem("chat-gender");
            window.location.href = "/";
          }}
          onPick={() => undefined}
        />
      )}

      {/* Bottom tabs */}
      <nav className="sticky bottom-0 z-40 grid grid-cols-4 border-t border-border bg-card pb-1 pt-1.5 lg:hidden">
        <button
          type="button"
          onClick={() => setTab("rooms")}
          className={`flex flex-col items-center gap-0.5 ${
            tab === "rooms" ? "text-brand-blue" : "text-muted-foreground"
          }`}
        >
          <Home className="size-6 fill-current" />
          <span className="text-[12px] font-bold">الغرف</span>
        </Link>
        <button
          type="button"
          onClick={() => setTab("private")}
          className={`relative flex flex-col items-center gap-0.5 ${
            tab === "private" ? "text-brand-blue" : "text-muted-foreground"
          }`}
        >
          <MessageSquare className="size-6 fill-current" />
          <span className="absolute -top-1 right-[22%] flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-primary-foreground">
            1
          </span>
          <span className="text-[12px] font-bold">الخاص</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("notifications")}
          className={`flex flex-col items-center gap-0.5 ${
            tab === "notifications" ? "text-brand-blue" : "text-muted-foreground"
          }`}
        >
          <Bell className="size-6" />
          <span className="text-[12px] font-bold">الإشعارات</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("menu")}
          className={`flex flex-col items-center gap-0.5 ${
            tab === "menu" ? "text-brand-blue" : "text-muted-foreground"
          }`}
        >
          <span className="flex size-6 items-center justify-center rounded-md bg-[image:var(--gradient-brand)] text-[11px] font-black text-primary-foreground">
            د
          </span>
          <span className="text-[12px] font-bold">القائمة</span>
        </button>
      </nav>
    </div>
  );
}

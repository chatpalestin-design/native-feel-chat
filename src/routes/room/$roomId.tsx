import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUp,
  Bell,
  Camera,
  ChevronRight,
  Home,
  LayoutGrid,
  MessageSquare,
  Mic,
  MoreVertical,
  Play,
  Radio,
  Smile,
  Users,
} from "lucide-react";
import { getRoom } from "@/data/rooms";

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
  id: number;
  user: string;
  time: string;
  text: string;
  color: "red" | "blue" | "pink" | "ink";
  badge?: "star" | "crown" | "verified";
  quote?: { user: string; text: string };
};

const initialMessages: Msg[] = [
  { id: 1, user: "خالد رام الله", time: "09:04 AM", text: "عليكم السلام", color: "red", badge: "star" },
  { id: 2, user: "سامر نابلس", time: "09:04 AM", text: "يسعد صباحكم", color: "ink", badge: "star" },
  {
    id: 3,
    user: "رمـــح #",
    time: "09:04 AM",
    text: "وانا مش بعبرك لله 🤷‍♀️",
    color: "blue",
    badge: "crown",
    quote: { user: "#. MosTafaDoK", text: "انا يتسال عليا بس ي عرص 🤷‍♀️" },
  },
  { id: 4, user: "*صمود امرأه*", time: "09:04 AM", text: "عليكم السلام", color: "ink", badge: "crown" },
  { id: 5, user: "ﷺ هَشة أَلمَزَاج ﷺ", time: "09:04 AM", text: "عليكم السلام نورت سامر", color: "pink" },
  { id: 6, user: "خالد رام الله", time: "09:04 AM", text: "نورت سامرر 😊🌸", color: "red", badge: "star" },
  {
    id: 7,
    user: "#. MosTafaDoK",
    time: "09:04 AM",
    text: "ياريتك ف ادبي 🤷‍♀️",
    color: "ink",
    badge: "verified",
    quote: { user: "رمـــح #", text: "انت مش مؤدب اصلا بس تتصنع الادب" },
  },
];

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

function RoomPage() {
  const { roomId } = useParams({ from: "/room/$roomId" });
  const room = getRoom(roomId);
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [text, setText] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [
      ...m,
      { id: Date.now(), user: "أنت", time: "الآن", text: value, color: "ink" },
    ]);
    setText("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-chat-canvas">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center gap-2 bg-card px-2 py-2">
        <Link to="/" aria-label="رجوع" className="p-1 text-brand-blue">
          <ChevronRight className="size-7" strokeWidth={3} />
        </Link>

        <span className="max-w-[110px] truncate rounded-full bg-secondary px-4 py-2 text-[15px] font-bold text-foreground">
          {room?.name ?? "غرفة"}
        </span>

        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-[image:var(--gradient-radio)] py-1 pl-1 pr-3 text-primary-foreground"
        >
          <span className="text-[14px] font-extrabold">راديو دردشتي</span>
          <span className="relative flex size-8 items-center justify-center rounded-full bg-card">
            <Play className="size-4 fill-foreground text-foreground" />
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-destructive" />
          </span>
        </button>

        <button
          type="button"
          aria-label="الرئيسية"
          className="flex h-9 w-12 items-center justify-center rounded-lg bg-brand-blue text-brand-blue-foreground"
        >
          <Home className="size-5 fill-current" />
        </button>
        <button
          type="button"
          aria-label="المستخدمون"
          className="flex h-9 w-12 items-center justify-center rounded-lg bg-brand-blue text-brand-blue-foreground"
        >
          <Users className="size-5 fill-current" />
        </button>
        <button type="button" aria-label="خيارات" className="p-1 text-foreground">
          <MoreVertical className="size-5" />
        </button>
      </header>

      {/* Live strip */}
      <div className="relative flex items-center justify-between bg-card px-3 pb-2">
        <div className="flex flex-col items-center">
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
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="text-[13px] font-bold">بث مباشر</span>
          <Radio className="size-5" />
        </div>
      </div>

      {/* Messages */}
      <main className="flex-1 space-y-2 px-2 py-3">
        {messages.map((m) => (
          <div key={m.id} className="flex items-end gap-2">
            <div className="size-11 shrink-0 overflow-hidden rounded-full bg-[image:var(--gradient-brand)]" />
            <div className="max-w-[78%] rounded-2xl bg-bubble px-3 py-2 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2">
                <span className="truncate text-[15px] font-extrabold text-bubble-foreground">{m.user}</span>
                {m.badge && <Badge kind={m.badge} />}
                <span className="text-[11px] text-muted-foreground">{m.time}</span>
              </div>
              {m.quote && (
                <div className="mt-1 rounded-md border-r-[3px] border-brand-blue bg-quote px-2 py-1">
                  <p className="text-[13px] font-bold text-bubble-foreground">{m.quote.user}</p>
                  <p className="text-[13px] text-muted-foreground">{m.quote.text}</p>
                </div>
              )}
              <p className={`mt-1 text-[19px] font-bold ${colorClass[m.color]}`}>{m.text}</p>
            </div>
          </div>
        ))}
      </main>

      {/* Composer */}
      <form onSubmit={send} className="sticky bottom-[58px] z-10 flex items-center gap-2 bg-card px-2 py-2">
        <button type="button" aria-label="الرموز" className="text-brand-blue">
          <Smile className="size-8 fill-brand-blue text-card" />
        </button>
        <button type="button" aria-label="المزيد" className="text-brand-blue">
          <LayoutGrid className="size-6" />
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="رسالة عامة"
          className="h-10 flex-1 rounded-full border border-border bg-card px-4 text-[15px] text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
        <button type="button" aria-label="تسجيل صوتي" className="text-brand-blue">
          <Mic className="size-6" />
        </button>
        <button type="button" aria-label="كاميرا" className="text-brand-blue">
          <Camera className="size-6 fill-brand-blue text-card" />
        </button>
        <button
          type="submit"
          aria-label="إرسال"
          className="flex size-9 items-center justify-center rounded-full bg-brand-blue text-brand-blue-foreground"
        >
          <ArrowUp className="size-5" strokeWidth={3} />
        </button>
      </form>

      {/* Bottom tabs */}
      <nav className="sticky bottom-0 z-20 grid grid-cols-4 border-t border-border bg-card pb-1 pt-1.5">
        <Link to="/" className="flex flex-col items-center gap-0.5 text-brand-blue">
          <Home className="size-6 fill-current" />
          <span className="text-[12px] font-bold">الغرف</span>
        </Link>
        <button type="button" className="relative flex flex-col items-center gap-0.5 text-muted-foreground">
          <MessageSquare className="size-6 fill-current" />
          <span className="absolute -top-1 right-[22%] flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-primary-foreground">
            1
          </span>
          <span className="text-[12px] font-bold">الخاص</span>
        </button>
        <button type="button" className="flex flex-col items-center gap-0.5 text-muted-foreground">
          <Bell className="size-6" />
          <span className="text-[12px] font-bold">الإشعارات</span>
        </button>
        <button type="button" className="flex flex-col items-center gap-0.5 text-muted-foreground">
          <span className="flex size-6 items-center justify-center rounded-md bg-[image:var(--gradient-brand)] text-[11px] font-black text-primary-foreground">
            د
          </span>
          <span className="text-[12px] font-bold">القائمة</span>
        </button>
      </nav>
    </div>
  );
}

import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Send, Users } from "lucide-react";
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

type Msg = { id: number; user: string; text: string; me?: boolean };

function RoomPage() {
  const { roomId } = useParams({ from: "/room/$roomId" });
  const room = getRoom(roomId);
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, user: "أبو محمد", text: "أهلاً وسهلاً بالجميع 👋" },
    { id: 2, user: "ليان", text: "مساء الخير من فلسطين 🇵🇸" },
    { id: 3, user: "أنت", text: "الله يسعدكم", me: true },
  ]);
  const [text, setText] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { id: Date.now(), user: "أنت", text: value, me: true }]);
    setText("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-[image:var(--gradient-brand)] px-4 py-3 text-primary-foreground">
        <Link to="/" aria-label="رجوع" className="rounded-full p-1 transition-colors hover:bg-white/15">
          <ArrowRight className="size-6" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-extrabold">{room?.name ?? "غرفة"}</h1>
          <p className="truncate text-xs opacity-90">{room?.desc}</p>
        </div>
        <span className="flex items-center gap-1 text-sm font-semibold">
          <Users className="size-4" />
          {room?.users ?? 0}
        </span>
      </header>

      <main className="flex-1 space-y-3 px-4 py-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.me ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 shadow-[var(--shadow-card)] ${
                m.me ? "bg-[image:var(--gradient-brand)] text-primary-foreground" : "bg-card text-card-foreground"
              }`}
            >
              <span className="block text-xs font-bold opacity-80">{m.user}</span>
              <span className="text-[15px]">{m.text}</span>
            </div>
          </div>
        ))}
      </main>

      <form onSubmit={send} className="sticky bottom-0 flex gap-2 border-t border-border bg-card p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب رسالتك..."
          className="h-11 flex-1 rounded-full bg-secondary px-4 text-[15px] text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          aria-label="إرسال"
          className="flex size-11 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] text-primary-foreground"
        >
          <Send className="size-5 -scale-x-100" />
        </button>
      </form>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { rooms } from "@/data/rooms";
import { RoomCard } from "@/components/RoomCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "دردشتي | غرف دردشة عربية صوتية ونصية" },
      {
        name: "description",
        content: "دردشتي: غرف دردشة عربية مجانية صوتية ونصية لفلسطين والعراق والأردن ومصر والسعودية والخليج.",
      },
      { property: "og:title", content: "دردشتي | غرف دردشة عربية صوتية ونصية" },
      {
        property: "og:description",
        content: "انضم إلى غرف الدردشة العربية المباشرة، صوت وكتابة، من هاتفك مباشرة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [tab, setTab] = useState<"default" | "voice">("voice");
  const [query, setQuery] = useState("");

  const list = useMemo(
    () => rooms.filter((r) => r.kind === tab && r.name.includes(query.trim())),
    [tab, query],
  );

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[image:var(--gradient-brand)] text-lg font-black text-primary-foreground shadow-[var(--shadow-tile)]">
            د
          </div>
          <span className="text-xl font-extrabold text-foreground">دردشتي</span>
        </div>
        <span className="text-sm font-bold text-[oklch(0.55_0.16_250)]">مصمم</span>
      </header>

      <div className="px-4 pt-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث عن غرف"
            className="h-12 w-full rounded-full bg-secondary pr-10 pl-4 text-[15px] text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {(
            [
              { key: "default", label: "الافتراضية" },
              { key: "voice", label: "الصوتية" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`h-12 rounded-xl text-base font-bold transition-colors ${
                tab === t.key
                  ? "bg-[image:var(--gradient-tab)] text-primary-foreground shadow-[var(--shadow-card)]"
                  : "border border-border bg-card text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="mt-4 space-y-3 px-4">
        <h1 className="sr-only">غرف دردشة عربية صوتية ونصية</h1>
        {list.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">لا توجد غرف مطابقة للبحث</p>
        )}
        {list.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </main>
    </div>
  );
}

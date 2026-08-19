import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Search } from "lucide-react";
import { toast } from "sonner";
import { rooms } from "@/data/rooms";
import { RoomCard } from "@/components/RoomCard";
import { LoginSheet } from "@/components/LoginSheet";


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
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(window.localStorage.getItem("chat-nickname"));
  }, []);

  const logout = () => {
    window.localStorage.removeItem("chat-nickname");
    window.localStorage.removeItem("chat-gender");
    setUser(null);
    setMenuOpen(false);
    toast("تم تسجيل الخروج");
  };

  const list = useMemo(
    () => rooms.filter((r) => r.kind === tab && r.name.includes(query.trim())),
    [tab, query],
  );

  return (
    <div className={loginOpen ? "min-h-screen bg-black" : "min-h-screen bg-background"}>
      <div
        className={`min-h-screen origin-top bg-background pb-8 transition-transform duration-300 ease-out ${
          loginOpen ? "scale-[0.94] overflow-hidden rounded-xl" : "scale-100"
        }`}
      >
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-[image:var(--gradient-brand)] text-base font-black text-primary-foreground">
            د
          </div>
          <span className="text-lg font-bold text-foreground">دردشتي</span>
        </div>
        {user ? (
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1"
          >
            <span className="max-w-[110px] truncate text-[15px] font-bold text-login-blue">
              {user}
            </span>
            <span className="flex size-8 items-center justify-center rounded-lg bg-[image:var(--gradient-brand)] text-sm font-black text-primary-foreground">
              {user.slice(0, 1)}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setLoginOpen(true)}
            className="rounded-md bg-brand-blue px-4 py-1.5 text-sm font-bold text-brand-blue-foreground"
          >
            دخول
          </button>
        )}
      </header>


      <div className="px-3 pt-3">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث عن غرف"
            className="h-9 w-full rounded-md border border-border bg-card px-3 text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {(
            [
              { key: "default", label: "الافتراضية" },
              { key: "voice", label: "الصوتية" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`h-8 rounded-md text-[13px] font-bold transition-colors ${
                tab === t.key
                  ? "bg-[image:var(--gradient-tab)] text-primary-foreground"
                  : "border border-border bg-card text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="mt-3 grid grid-cols-1 gap-2 px-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <h1 className="sr-only">غرف دردشة عربية صوتية ونصية</h1>
        {list.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
            لا توجد غرف مطابقة للبحث
          </p>
        )}
        {list.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </main>
      </div>

      <LoginSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}



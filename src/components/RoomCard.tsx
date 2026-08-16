import { Link } from "@tanstack/react-router";
import { ChevronLeft, MessageSquare, Users, Video } from "lucide-react";
import type { Room } from "@/data/rooms";

export function RoomCard({ room }: { room: Room }) {
  const full = room.users >= room.capacity;

  return (
    <Link
      to="/room/$roomId"
      params={{ roomId: room.id }}
      className="flex items-stretch gap-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)] transition-transform active:scale-[0.98]"
    >
      <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl bg-[image:var(--gradient-brand)] shadow-[var(--shadow-tile)]">
        <span className="absolute inset-0 flex items-center justify-center px-1 text-center text-[15px] font-extrabold leading-tight text-primary-foreground">
          {room.name}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-extrabold text-foreground">{room.name}</h3>
        <p className="truncate text-sm text-muted-foreground">{room.desc}</p>
      </div>

      <div className="flex flex-col items-end justify-between">
        <span
          className={`flex items-center gap-1 text-sm font-semibold ${full ? "text-destructive" : "text-foreground"}`}
        >
          <Users className="size-4" />
          {room.users}/{room.capacity}
        </span>
        <div className="flex items-center gap-2 text-muted-foreground">
          {room.kind === "voice" && <Video className="size-5" />}
          <MessageSquare className="size-5" />
          <ChevronLeft className="size-5 text-foreground" />
        </div>
      </div>
    </Link>
  );
}

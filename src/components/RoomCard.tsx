import { Link } from "@tanstack/react-router";
import { ChevronLeft, MessageSquare, Users, Video } from "lucide-react";
import type { Room } from "@/data/rooms";

export function RoomCard({
  room,
  locked = false,
  onLocked,
}: {
  room: Room;
  locked?: boolean;
  onLocked?: (roomId: string) => void;
}) {
  const full = room.users >= room.capacity;

  const className =
    "relative flex w-full items-center gap-3 rounded-lg border border-border bg-card p-2.5 text-right shadow-[var(--shadow-card)] transition-colors hover:bg-secondary/60";

  const inner = (
    <>
      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-[image:var(--gradient-brand)]">
        <span className="absolute inset-0 flex items-center justify-center px-1 text-center text-[15px] font-extrabold leading-tight text-primary-foreground">
          {room.name}
        </span>
      </div>

      <div className="min-w-0 flex-1 pb-4">
        <h3 className="truncate text-[17px] font-bold text-foreground">{room.name}</h3>
        <p className="truncate text-[13px] text-muted-foreground">{room.desc}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={`flex items-center gap-1 text-[13px] ${full ? "text-destructive" : "text-foreground"}`}
        >
          {room.users}/{room.capacity}
          <Users className="size-4 text-muted-foreground" />
        </span>
        <ChevronLeft className="size-5 text-muted-foreground" />
      </div>

      <div className="absolute bottom-1.5 left-9 flex items-center gap-1.5 text-muted-foreground">
        <MessageSquare className="size-[18px] fill-current" />
        {room.kind === "voice" && <Video className="size-[18px] fill-current" />}
      </div>
    </>
  );

  if (locked) {
    return (
      <button type="button" onClick={() => onLocked?.(room.id)} className={className}>
        {inner}
      </button>
    );
  }

  return (
    <Link to="/room/$roomId" params={{ roomId: room.id }} className={className}>
      {inner}
    </Link>
  );
}

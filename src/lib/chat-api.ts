export type ApiRoom = {
  id: string;
  name: string;
  description: string;
  kind: "default" | "voice";
  capacity: number;
  featured: boolean;
  sort_order: number;
};

export type ApiMessage = {
  id: string;
  room_id: string;
  nickname: string;
  body: string;
  created_at: string;
};

export async function fetchRooms(): Promise<ApiRoom[]> {
  const res = await fetch("/api/v4/rooms");
  if (!res.ok) throw new Error("failed to load rooms");
  const data = (await res.json()) as { rooms: ApiRoom[] };
  return data.rooms;
}

export async function fetchMessages(roomId: string): Promise<ApiMessage[]> {
  const res = await fetch(`/api/v4/rooms/${encodeURIComponent(roomId)}/messages`);
  if (!res.ok) throw new Error("failed to load messages");
  const data = (await res.json()) as { messages: ApiMessage[] };
  return data.messages;
}

export async function sendMessage(
  roomId: string,
  nickname: string,
  body: string,
): Promise<ApiMessage> {
  const res = await fetch(`/api/v4/rooms/${encodeURIComponent(roomId)}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname, body }),
  });
  if (!res.ok) throw new Error("failed to send message");
  const data = (await res.json()) as { message: ApiMessage };
  return data.message;
}

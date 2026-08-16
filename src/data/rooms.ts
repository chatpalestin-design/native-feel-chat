export type Room = {
  id: string;
  name: string;
  desc: string;
  users: number;
  capacity: number;
  kind: "default" | "voice";
  featured?: boolean;
};

export const rooms: Room[] = [
  {
    id: "khaima",
    name: "خيمة دردشتي",
    desc: "غرفة دردشتي الرئيسية",
    users: 150,
    capacity: 1000,
    kind: "voice",
    featured: true,
  },
  { id: "palestine", name: "فلسطين", desc: "غرفة مستخدمين فلسطين", users: 201, capacity: 1000, kind: "voice" },
  { id: "iraq", name: "العراق", desc: "غرفة مستخدمين العراق", users: 144, capacity: 1000, kind: "voice" },
  { id: "jordan-1", name: "الاردن 1", desc: "غرفة مستخدمين الاردن", users: 373, capacity: 1000, kind: "voice" },
  { id: "jordan-2", name: "الاردن 2", desc: "غرفة مستخدمين الاردن", users: 8, capacity: 1000, kind: "voice" },
  { id: "ksa", name: "السعودية", desc: "غرفة مستخدمين السعودية", users: 139, capacity: 1000, kind: "voice" },
  { id: "egypt-1", name: "مصر 1", desc: "غرفة مستخدمين مصر", users: 522, capacity: 500, kind: "voice" },
  { id: "egypt-2", name: "مصر 2", desc: "غرفة مستخدمين مصر", users: 52, capacity: 1000, kind: "voice" },
  { id: "syria", name: "سوريا", desc: "غرفة مستخدمين سوريا", users: 96, capacity: 1000, kind: "default" },
  { id: "maghreb", name: "المغرب العربي", desc: "غرفة مستخدمين المغرب العربي", users: 74, capacity: 1000, kind: "default" },
  { id: "khaleej", name: "الخليج", desc: "غرفة مستخدمين الخليج", users: 63, capacity: 1000, kind: "default" },
  { id: "sports", name: "رياضة", desc: "غرفة النقاش الرياضي", users: 31, capacity: 500, kind: "default" },
];

export const getRoom = (id: string) => rooms.find((r) => r.id === id);

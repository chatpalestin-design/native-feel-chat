CREATE TABLE public.rooms (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  kind text NOT NULL DEFAULT 'default',
  capacity integer NOT NULL DEFAULT 1000,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  nickname text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX messages_room_created_idx ON public.messages (room_id, created_at DESC);

GRANT SELECT ON public.rooms TO anon;
GRANT SELECT ON public.rooms TO authenticated;
GRANT ALL ON public.rooms TO service_role;

GRANT SELECT, INSERT ON public.messages TO anon;
GRANT SELECT, INSERT ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rooms_public_read" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "messages_public_read" ON public.messages FOR SELECT USING (true);
CREATE POLICY "messages_public_insert" ON public.messages FOR INSERT WITH CHECK (
  length(btrim(nickname)) BETWEEN 1 AND 40
  AND length(btrim(body)) BETWEEN 1 AND 1000
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

INSERT INTO public.rooms (id, name, description, kind, capacity, featured, sort_order) VALUES
('khaima','خيمة دردشتي','غرفة دردشتي الرئيسية','voice',1000,true,0),
('palestine','فلسطين','غرفة مستخدمين فلسطين','voice',1000,false,1),
('iraq','العراق','غرفة مستخدمين العراق','voice',1000,false,2),
('jordan-1','الاردن 1','غرفة مستخدمين الاردن','voice',1000,false,3),
('jordan-2','الاردن 2','غرفة مستخدمين الاردن','voice',1000,false,4),
('ksa','السعودية','غرفة مستخدمين السعودية','voice',1000,false,5),
('egypt-1','مصر 1','غرفة مستخدمين مصر','voice',500,false,6),
('egypt-2','مصر 2','غرفة مستخدمين مصر','voice',1000,false,7),
('syria','سوريا','غرفة مستخدمين سوريا','default',1000,false,8),
('maghreb','المغرب العربي','غرفة مستخدمين المغرب العربي','default',1000,false,9),
('khaleej','الخليج','غرفة مستخدمين الخليج','default',1000,false,10),
('sports','رياضة','غرفة النقاش الرياضي','default',500,false,11);

INSERT INTO public.messages (room_id, nickname, body) VALUES
('palestine','أبو أحمد','السلام عليكم ورحمة الله'),
('palestine','ندى','أهلاً وسهلاً بالجميع في غرفة فلسطين'),
('palestine','خالد','منورين الغرفة');
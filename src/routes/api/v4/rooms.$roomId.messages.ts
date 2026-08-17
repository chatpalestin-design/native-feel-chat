import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getServerClient, json } from "@/lib/api-server";

const postSchema = z.object({
  nickname: z.string().trim().min(1).max(40),
  body: z.string().trim().min(1).max(1000),
});

export const Route = createFileRoute("/api/v4/rooms/$roomId/messages")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const supabase = getServerClient();
        const { data, error } = await supabase
          .from("messages")
          .select("id,room_id,nickname,body,created_at")
          .eq("room_id", params.roomId)
          .order("created_at", { ascending: true })
          .limit(200);

        if (error) return json({ error: error.message }, 500);
        return json({ messages: data ?? [] });
      },
      POST: async ({ request, params }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return json({ error: "Invalid JSON body" }, 400);
        }

        const parsed = postSchema.safeParse(payload);
        if (!parsed.success) return json({ error: "Invalid message" }, 400);

        const supabase = getServerClient();
        const { data, error } = await supabase
          .from("messages")
          .insert({
            room_id: params.roomId,
            nickname: parsed.data.nickname,
            body: parsed.data.body,
          })
          .select("id,room_id,nickname,body,created_at")
          .single();

        if (error) return json({ error: error.message }, 400);
        return json({ message: data }, 201);
      },
    },
  },
});

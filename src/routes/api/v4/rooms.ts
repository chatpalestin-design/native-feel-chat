import { createFileRoute } from "@tanstack/react-router";
import { getServerClient, json } from "@/lib/api-server";

export const Route = createFileRoute("/api/v4/rooms")({
  server: {
    handlers: {
      GET: async () => {
        const supabase = getServerClient();
        const { data, error } = await supabase
          .from("rooms")
          .select("id,name,description,kind,capacity,featured,sort_order")
          .order("sort_order", { ascending: true });

        if (error) return json({ error: error.message }, 500);
        return json({ rooms: data ?? [] });
      },
    },
  },
});

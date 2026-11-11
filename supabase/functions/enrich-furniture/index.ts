
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: items } = await supabase
    .from("furniture")
    .select("id,name,image_url")
    .is("ai_product_type", null)
    .limit(100);

  if (!items?.length) {
    return new Response("No products left.");
  }

  const apiKey = Deno.env.get("OPENAI_API_KEY");

  for (const item of items) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "Return only JSON with ai_style, room_type, ai_materials, ai_colors, ai_product_type."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this furniture: ${item.name}`
              },
              {
                type: "image_url",
                image_url: { url: item.image_url }
              }
            ]
          }
        ]
      })
    });

    if (!res.ok) continue;

    const json = await res.json();
    const ai = JSON.parse(json.choices[0].message.content);

    await supabase
      .from("furniture")
      .update({
        ai_style: ai.ai_style,
        room_type: ai.room_type,
        ai_materials: ai.ai_materials,
        ai_colors: ai.ai_colors,
        ai_product_type: ai.ai_product_type
      })
      .eq("id", item.id);
  }

  return new Response("Done.");
});
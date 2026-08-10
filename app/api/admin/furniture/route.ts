import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/adminAuth";
import { createClient } from "@supabase/supabase-js";

// Service role client — full write access, server-only. NEVER import
// this pattern into client components; the key must never reach the
// browser. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Supabase →
// Settings → API → service_role — keep it secret, no NEXT_PUBLIC_ prefix).
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("furniture")
    .insert({
      name: body.name,
      description: body.description,
      price: body.price,
      width_cm: body.width_cm,
      depth_cm: body.depth_cm,
      height_cm: body.height_cm,
      image_url: body.image_url,
      product_url: body.product_url || null,
      brand_id: body.brand_id || null,
      category_id: body.category_id || null,
      style: body.style,
      room_type: body.room_type,
      glb_url: body.glb_url || null,
    })
    .select()
    .single();

  if (error) {
    console.error("createFurniture error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

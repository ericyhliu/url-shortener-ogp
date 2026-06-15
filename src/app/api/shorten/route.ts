import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { supabase } from "@/lib/supabase";
import { encodeId } from "@/lib/sqids";

export async function POST(req: Request) {
  const { longUrl } = await req.json();

  if (!longUrl) {
    return NextResponse.json({ error: "Missing longUrl" }, { status: 400 });
  }

  const counter = await redis.incr("url_counter");
  const shortCode = encodeId(counter);

  const { error } = await supabase
    .from("urls")
    .insert({ short_code: shortCode, long_url: longUrl });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ shortCode });
}

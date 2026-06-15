import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";
import { supabase } from "@/lib/supabase";
import { encodeId } from "@/lib/sqids";
import { isValidUrl } from "@/utils";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 h"),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { longUrl } = await req.json();

  if (!longUrl || !isValidUrl(longUrl)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
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

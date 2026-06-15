import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { supabase } from "@/lib/supabase";

export async function middleware(req: NextRequest) {
  const shortCode = req.nextUrl.pathname.slice(1);

  const cached = await redis.get<string>(`short:${shortCode}`);
  if (cached) {
    return NextResponse.redirect(cached);
  }

  const { data, error } = await supabase
    .from("urls")
    .select("long_url")
    .eq("short_code", shortCode)
    .single();

  if (error || !data) {
    return NextResponse.next();
  }

  await redis.set(`short:${shortCode}`, data.long_url);

  return NextResponse.redirect(data.long_url);
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).+)"],
};

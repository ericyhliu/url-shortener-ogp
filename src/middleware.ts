import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { supabase } from "@/lib/supabase";

export async function middleware(req: NextRequest) {
  const shortCode = req.nextUrl.pathname.slice(1);

  const toAbsolute = (url: string) =>
    url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;

  const cached = await redis.get<string>(`short:${shortCode}`);
  if (cached) {
    return NextResponse.redirect(toAbsolute(cached), { status: 302 });
  }

  const { data, error } = await supabase
    .from("urls")
    .select("long_url")
    .eq("short_code", shortCode)
    .single();

  if (error || !data) {
    // Short code not found — fall through to Next.js not-found page
    return NextResponse.next();
  }

  await redis.set(`short:${shortCode}`, data.long_url);

  return NextResponse.redirect(toAbsolute(data.long_url), { status: 302 });
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).+)"],
};

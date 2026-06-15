import { describe, it, expect, vi, beforeEach } from "vitest";

const mockLimit = vi.hoisted(() => vi.fn().mockResolvedValue({ success: true }));
const mockIncr = vi.hoisted(() => vi.fn().mockResolvedValue(1));
const mockInsert = vi.hoisted(() => vi.fn().mockResolvedValue({ error: null }));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class {
    static slidingWindow() { return {}; }
    limit = mockLimit;
  },
}));

vi.mock("@/lib/redis", () => ({
  redis: { incr: mockIncr },
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({ insert: mockInsert }),
  },
}));

const { POST } = await import("./route");

const makeRequest = (body: unknown, ip = "127.0.0.1") =>
  new Request("http://localhost/api/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });

describe("POST /api/shorten", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLimit.mockResolvedValue({ success: true });
    mockIncr.mockResolvedValue(1);
    mockInsert.mockResolvedValue({ error: null });
  });

  it("returns 400 when longUrl is missing", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid URL");
  });

  it("returns 400 when longUrl is invalid", async () => {
    const res = await POST(makeRequest({ longUrl: "not-a-url" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid URL");
  });

  it("returns 429 when rate limit is exceeded", async () => {
    mockLimit.mockResolvedValue({ success: false });
    const res = await POST(makeRequest({ longUrl: "https://google.com" }));
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toBe("Rate limit exceeded");
  });

  it("returns 500 when Supabase insert fails", async () => {
    mockInsert.mockResolvedValue({ error: { message: "DB error" } });
    const res = await POST(makeRequest({ longUrl: "https://google.com" }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("DB error");
  });

  it("returns shortCode on success", async () => {
    const res = await POST(makeRequest({ longUrl: "https://google.com" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.shortCode).toBeDefined();
    expect(typeof body.shortCode).toBe("string");
  });
});

"use client";

import { useState } from "react";
import { Box, Container, Text, TextField, Button, Spinner } from "@radix-ui/themes";
import { Copy, Check } from "lucide-react";
import { isValidUrl } from "@/utils";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShorten = async () => {
    if (!isValidUrl(url)) {
      setError("Must be a valid URL.");
      setShortUrl(null);
      return;
    }
    setError(null);
    setLoading(true);
    setShortUrl(null);

    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ longUrl: url }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError("Something went wrong.");
      return;
    }

    setShortUrl(`${window.location.origin}/${data.shortCode}`);
    setUrl("");
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box height="100vh" style={{ display: "flex", alignItems: "center", paddingTop: "32px" }}>
      <Container size="2">
        <Text as="p" size="8" weight="bold" mb="2" style={{ color: "#293044", fontFamily: "var(--font-inter)" }}>
          URL Shortener
        </Text>
        <Text as="p" size="4" mb="4" style={{ color: "#445072", fontFamily: "var(--font-inter)" }}>
          Paste a long URL and get a short URL back.
        </Text>

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <TextField.Root
              size="3"
              placeholder="https://example.com/paste-your-long-url-here"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(null); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleShorten(); }}
              style={{ flex: 1 }}
            />
            <Button
              size="3"
              onClick={handleShorten}
              disabled={loading || !url}
              style={{ backgroundColor: "#4A61C0", color: "white", cursor: "pointer", width: "96px" }}
            >
              {loading ? <Spinner /> : "Shorten"}
            </Button>
          </div>

          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, paddingTop: "8px" }}>
            {error && (
              <Text as="p" size="1" weight="medium" style={{ color: "#E53E3E" }}>
                {error}
              </Text>
            )}
            {shortUrl && (
              <div style={{ display: "flex", gap: "8px" }}>
                <TextField.Root
                  size="3"
                  value={shortUrl}
                  readOnly
                  onClick={() => handleCopy(shortUrl)}
                  style={{ flex: 1, cursor: "pointer" }}
                />
                <Button
                  size="3"
                  variant="soft"
                  onClick={() => handleCopy(shortUrl)}
                  style={{
                    width: "96px",
                    cursor: "pointer",
                    backgroundColor: copied ? "#F0FDF4" : undefined,
                    color: copied ? "#16A34A" : "#6B7280",
                  }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  Copy
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Box>
  );
}

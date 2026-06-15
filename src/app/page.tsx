"use client";

import { Box, Container, Text, TextField, Button } from "@radix-ui/themes";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");

  return (
    <Box height="100vh" style={{ display: "flex", alignItems: "center", paddingTop: "32px" }}>
      <Container size="2">
        <Text as="p" size="8" weight="bold" mb="2" style={{ color: "#293044", fontFamily: "var(--font-inter)" }}>
          URL Shortener
        </Text>
        <Text as="p" size="4" mb="4" style={{ color: "#445072", fontFamily: "var(--font-inter)" }}>
          Paste a long URL and get a short one back.
        </Text>
        <div style={{ display: "flex", gap: "8px" }}>
          <TextField.Root
            size="3"
            placeholder="https://example.com/paste-your-long-url-here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button
            size="3"
            style={{ backgroundColor: "#4A61C0", color: "white", cursor: "pointer" }}
          >
            Shorten
          </Button>
        </div>
      </Container>
    </Box>
  );
}

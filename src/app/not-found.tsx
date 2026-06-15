import { Box, Container, Text, Button } from "@radix-ui/themes";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box height="100vh" style={{ display: "flex", alignItems: "center", paddingTop: "32px" }}>
      <Container size="2">
        <Text as="p" size="8" weight="bold" mb="2" style={{ color: "#293044", fontFamily: "var(--font-inter)" }}>
          404
        </Text>
        <Text as="p" size="4" mb="4" style={{ color: "#445072", fontFamily: "var(--font-inter)" }}>
          This short URL doesn't exist.
        </Text>
        <Button
          size="3"
          asChild
          style={{ backgroundColor: "#4A61C0", color: "white", cursor: "pointer" }}
        >
          <Link href="/">Go back</Link>
        </Button>
      </Container>
    </Box>
  );
}

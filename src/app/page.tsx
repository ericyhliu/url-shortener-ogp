import { Box, Container, Heading, Text } from "@radix-ui/themes";

export default function Home() {
  return (
    <Box height="100vh" style={{ display: "flex", alignItems: "center", paddingTop: "32px" }}>
      <Container size="2">
        <Heading size="8" mb="2">URL Shortener</Heading>
        <Text color="gray">Paste a long URL and get a short one back.</Text>
      </Container>
    </Box>
  );
}

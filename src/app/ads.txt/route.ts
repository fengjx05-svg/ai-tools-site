export function GET() {
  return new Response("google.com, pub-9120376243585799, DIRECT, f08c47fec0942fa0\n", {
    headers: { "Content-Type": "text/plain" },
  });
}

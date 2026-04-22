# Slow MCP Server

A minimal MCP (Model Context Protocol) server deployed on Vercel, built to test how MCP clients handle slow or long-running tool calls — particularly around proxy timeout boundaries.

**Live server:** `https://slowmcptest.vercel.app/api/mcp`

## Tools

| Tool | Description |
|------|-------------|
| `fast_echo` | Immediately returns the input message. Proves basic connectivity works. |
| `slow_echo` | Waits for a configurable delay (default 35s), then returns the message. Tests timeout behavior. |

### `fast_echo`

```json
{ "message": "hello" }
```

Returns `"hello"` immediately.

### `slow_echo`

```json
{ "message": "hello", "delay_seconds": 35 }
```

Returns `"[after 35s delay] hello"` after waiting 35 seconds. The `delay_seconds` parameter is optional and defaults to 35.

## How it works

This is a Next.js app with a single API route (`app/api/[transport]/route.ts`) that uses [`mcp-handler`](https://www.npmjs.com/package/mcp-handler) to serve MCP over Streamable HTTP. The `[transport]` dynamic segment lets `mcp-handler` route between `/api/mcp`, `/api/sse`, and `/api/message` endpoints automatically.

The Vercel function is configured with `maxDuration: 60` to allow tool calls up to 60 seconds.

## Connecting

### MCP Inspector

1. Open [MCP Inspector](https://github.com/modelcontextprotocol/inspector)
2. Set transport to **Streamable HTTP**
3. Enter URL: `https://slowmcptest.vercel.app/api/mcp` (or `http://localhost:3000/api/mcp` for local)

### Claude Desktop / Cursor / Windsurf

Add to your MCP config:

```json
{
  "mcpServers": {
    "slow-mcp-test": {
      "url": "https://slowmcptest.vercel.app/api/mcp"
    }
  }
}
```

For clients that only support stdio, use [mcp-remote](https://www.npmjs.com/package/mcp-remote):

```json
{
  "mcpServers": {
    "slow-mcp-test": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://slowmcptest.vercel.app/api/mcp"]
    }
  }
}
```

## Local development

```bash
npm install
npm run dev
```

The MCP endpoint will be at `http://localhost:3000/api/mcp`.

## Deploy

```bash
vercel
```

## Tech stack

- [Next.js](https://nextjs.org) (App Router)
- [mcp-handler](https://www.npmjs.com/package/mcp-handler) — Vercel adapter for MCP
- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) — MCP TypeScript SDK
- [Zod](https://zod.dev) — Schema validation for tool inputs

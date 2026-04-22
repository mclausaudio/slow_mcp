import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "fast_echo",
      {
        title: "Fast Echo",
        description:
          "Immediately returns the input message. Use this to verify basic connectivity.",
        inputSchema: {
          message: z.string().describe("The message to echo back"),
        },
      },
      async ({ message }) => ({
        content: [{ type: "text", text: message }],
      })
    );

    server.registerTool(
      "slow_echo",
      {
        title: "Slow Echo",
        description:
          "Waits for a configurable delay (default 35s), then returns the input message. Use this to test timeout behavior.",
        inputSchema: {
          message: z
            .string()
            .describe("The message to echo back after the delay"),
          delay_seconds: z
            .number()
            .default(35)
            .describe(
              "Number of seconds to wait before responding (default: 35)"
            ),
        },
      },
      async ({ message, delay_seconds }) => {
        await new Promise((resolve) =>
          setTimeout(resolve, delay_seconds * 1000)
        );
        return {
          content: [
            {
              type: "text",
              text: `[after ${delay_seconds}s delay] ${message}`,
            },
          ],
        };
      }
    );
  },
  {},
  {
    basePath: "/api",
    maxDuration: 60,
    verboseLogs: true,
  }
);

export { handler as GET, handler as POST, handler as DELETE };

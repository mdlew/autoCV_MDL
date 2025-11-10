/**
 * @file index.ts
 * @description Entry point for the Cloudflare Worker application. Handles incoming HTTP requests,
 *              routes them based on URL paths, and returns appropriate responses. Supports static asset
 *              delivery.
 *
 * @author Matthew Lew
 * @date November 9, 2025
 *
 * @exports
 * @default {ExportedHandler<Env>} - Main fetch handler for the Cloudflare Worker.
 *
 * @property {Fetcher} ASSETS - Fetcher binding for static assets.
 *
 * @functions
 * @function MethodNotAllowed - Returns a 405 response for unsupported HTTP methods.
 * @function fetch - Main handler for processing incoming requests.
 *
 * @features
 * - Sets security headers (Content-Security-Policy, X-Frame-Options, etc.).
 * - Serves static assets from the ASSETS binding.
 * - Enforces TLS 1.2+ for all requests.
 */

export interface Env {
  ASSETS: Fetcher; // Add ASSETS property to the Env interface
}

async function MethodNotAllowed(request: Request) {
  console.log({ error: `Method ${request.method} not allowed` });
  return new Response(`Method ${request.method} not allowed.`, {
    status: 405,
    statusText: "Method Not Allowed",
    headers: {
      Allow: "GET",
    },
  });
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // Response logic ******************************************************
    // Return a new Response based on a URL's pathname

    const url = new URL(request.url); // URL is available in the global scope of Cloudflare Workers

    // Check if the request is secure (HTTPS) and TLS version is 1.2 or higher, return 403 if not
    if (
      typeof request.cf?.tlsVersion !== "string" ||
      !(
        request.cf.tlsVersion.toUpperCase().includes("TLSV1.2") ||
        request.cf.tlsVersion.toUpperCase().includes("TLSV1.3")
      )
    ) {
      console.log({
        error: `TLS version error: "${request.cf?.tlsVersion}"`,
      });
      return new Response("Please use TLS version 1.2 or higher.", {
        status: 403,
        statusText: "Forbidden",
      });
    }

    // Only GET requests work with this proxy.
    if (request.method !== "GET") {
      return MethodNotAllowed(request);
    }

    try {
      return env.ASSETS.fetch(request);
    } catch (e) {
      const pathname = url.pathname;
      console.log({
        error: `"${pathname}" not found`,
        error_stack: (e as Error).stack,
      });
      return new Response(`"${pathname}" not found`, {
        status: 404,
        statusText: "Not Found",
      });
    }
  },
} satisfies ExportedHandler<Env>;

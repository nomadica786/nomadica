import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { limiter } from "./lib/rate-limit/tokenBucket";

export function proxy(request: NextRequest) {
  // Rate limit all routes starting with /api/
  if (request.nextUrl.pathname.startsWith("/api")) {
    // Determine the IP address or fallback to a global identifier
    const ip = (request as any).ip ?? request.headers.get("x-forwarded-for") ?? "global";
    
    // Evaluate request limit
    const result = limiter.limit(ip);

    // Periodically run cleanup (approx 5% chance per request)
    if (Math.random() < 0.05) {
      limiter.cleanup();
    }

    if (!result.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please wait a moment and try again.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": String(result.limit),
            "X-RateLimit-Remaining": String(result.remaining),
            "Retry-After": "1",
          },
        }
      );
    }

    // Set rate limiting headers on the successful response
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(result.limit));
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract token from /event/[token]/...
  const match = pathname.match(/^\/event\/([^/]+)/);

  if (!match) {
    return NextResponse.next();
  }

  const token = match[1];
  const validToken = process.env.EVENT_TOKEN;

  if (!validToken || token !== validToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/invalid-event";
    url.search = "";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/event/:path*"],
};

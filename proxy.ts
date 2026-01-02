import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "baiki.test";

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";
  const hostname = host.split(":")[0]; // defensive

  // 1. Platform domain (no tenant)
  if (hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}`) {
    return NextResponse.next();
  }

  // 2. Subdomain tenant
  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    const tenantSlug = hostname.replace(`.${ROOT_DOMAIN}`, "");

    // Guard invalid subdomains
    if (!tenantSlug || tenantSlug === "www") {
      return NextResponse.next();
    }

    // Rewrite to internal tenant path
    url.pathname = `/${tenantSlug}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // 3. Unknown / custom domain (future support)
  // For now, block or redirect
  return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};

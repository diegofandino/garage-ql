import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const isDevelopment = process.env.NODE_ENV === 'development';

    const allowScripts = [
        "'self'",
        `'nonce-${nonce}'`,
        "'strict-dynamic'",
        ...(isDevelopment ? ["'unsafe-eval'"] : []),
    ].join(" ");

    const contentSecurityPolicies = [
        "default-src 'self'",
        `script-src ${allowScripts}`,
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self' data:",
        "connect-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests"
    ].join("; ");

    const headers = new Headers(request.headers);

    headers.set("x-nonce", nonce);
    headers.set("Content-Security-Policy", contentSecurityPolicies);

    const response = NextResponse.next({
        request: {
            headers
        }
    });

    response.headers.set("Content-Security-Policy", contentSecurityPolicies);

    return response;

}

export const config = {
    matcher: [
        {
            source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
            missing: [
                { type: "header", key: "next-router-prefetch" },
                { type: "header", key: "purpose", value: "prefetch" },
            ],
        },
    ],
};
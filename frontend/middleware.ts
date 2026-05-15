import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Catch all /api/v1 calls
  if (request.nextUrl.pathname.startsWith('/api/v1')) {
    // Use the environment variable, fallback to Railway URL
    const backendUrl = process.env.BACKEND_URL || 'https://rohitgram-backend-production.up.railway.app';
    
    const path = request.nextUrl.pathname;
    const searchParams = request.nextUrl.searchParams.toString();
    
    // Add trailing slash to path since the live Railway backend strictly requires it
    const pathWithSlash = path.endsWith('/') ? path : `${path}/`;
    
    const targetUrl = `${backendUrl}${pathWithSlash}${searchParams ? '?' + searchParams : ''}`;
    
    console.log("🚜 [Tractor Proxy] Forwarding to:", targetUrl);
    
    return NextResponse.rewrite(new URL(targetUrl));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/v1/:path*',
};

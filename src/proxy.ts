import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define protected paths
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  const isAdminPath = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  const isAdminApi = pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login');

  if (isAdminRoute) {
    // --- IP WHITELIST CHECK ---
    const allowedIpsStr = process.env.ALLOWED_ADMIN_IPS;
    // In local development, you might not have this set yet, so we allow it if it's empty, 
    // OR we explicitly require it. Let's make it strict if the variable exists.
    if (allowedIpsStr) {
      const allowedIps = allowedIpsStr.split(',').map(ip => ip.trim());
      // Get client IP
      const forwardedFor = request.headers.get('x-forwarded-for');
      const realIp = request.headers.get('x-real-ip');
      // request.ip was removed in newer Next.js versions
      const clientIp = (forwardedFor ? forwardedFor.split(',')[0].trim() : null) || realIp || '127.0.0.1';

      // Always allow localhost for development
      const isLocalhost = clientIp === '127.0.0.1' || clientIp === '::1' || clientIp === 'localhost';

      if (!isLocalhost && !allowedIps.includes(clientIp)) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }
        // Return a simple 404 text response for pages to obscure the admin panel
        return new NextResponse('404 Not Found', { status: 404 });
      }
    }
    // --- END IP WHITELIST CHECK ---
  }

  if (isAdminPath || isAdminApi) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const secretKey = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secretKey);
      
      return NextResponse.next();
    } catch (error) {
      // Invalid token
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

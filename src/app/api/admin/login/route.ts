import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'GwenTopup9@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Gwen5421';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT token
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secretKey);

    // Set cookie
    const response = NextResponse.json({ success: true }, { status: 200 });
    
    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      // Removed maxAge so it acts as a Session Cookie (expires when browser closes)
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  
  // Clear the admin token cookie by setting an expired date
  response.cookies.set({
    name: 'admin_token',
    value: '',
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return response;
}

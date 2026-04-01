import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, phone, message } = await request.json();

  if (!name || !phone || !message) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  // TODO: integrate with Formspree, Resend, or another email service
  // e.g. await fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', body: ... })

  return NextResponse.json({ success: true });
}

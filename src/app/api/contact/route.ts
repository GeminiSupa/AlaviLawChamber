import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { full_name, email, phone, subject, message } = await req.json();

    if (!full_name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase
      .from('contact_submissions')
      .insert([{ full_name, email, phone, subject, message }]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to save submission.' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

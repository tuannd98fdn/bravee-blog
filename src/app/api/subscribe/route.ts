import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // TODO: Integrate with a real email provider (Resend, Mailchimp, ConvertKit, etc.)
    // Example for Resend:
    // await resend.contacts.create({
    //   email,
    //   audienceId: process.env.RESEND_AUDIENCE_ID,
    // });

    // Simulate network delay for the dummy API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(`[Newsletter API] New subscriber: ${email}`);

    return NextResponse.json(
      { message: 'You have been successfully subscribed!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Newsletter API] Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

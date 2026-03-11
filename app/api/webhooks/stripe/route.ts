import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js"; // Use service role for webhooks

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-02-25.clover',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string // Need to use service role key to bypass RLS in webhook, OR we can just use regular key since webhooks don't have user session
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const courseId = session.metadata?.courseId;
    const userId = session.metadata?.userId;

    if (courseId && userId) {
      try {
        // Upsert enrollment record
        const { error } = await supabaseAdmin
          .from("enrollments")
          .upsert({
            course_id: courseId,
            student_id: userId,
            payment_status: "completed",
          });

        if (error) {
          console.error("Supabase enrollment error:", error);
          return new NextResponse(`Database Error: ${error.message}`, { status: 500 });
        }
      } catch (error: any) {
        console.error("Webhook processing error:", error);
         return new NextResponse(`Error: ${error.message}`, { status: 500 });
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}

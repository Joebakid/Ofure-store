import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { order } = await req.json();

    if (!order || !order.email) {
      return new Response(
        JSON.stringify({ error: "Missing order data" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const emailHtml = `
      <h2>🛒 New Order Received</h2>

      <p><strong>Name:</strong> ${order.name}</p>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Address:</strong> ${order.address}</p>

      <h3>Items</h3>
      <ul>
        ${order.items
          .map(
            (item: any) =>
              `<li>${item.name} × ${item.qty}</li>`
          )
          .join("")}
      </ul>

      <p><strong>Subtotal:</strong> ₦${order.subtotal}</p>
      <p><strong>Delivery:</strong> ₦${order.delivery_fee}</p>
      <p><strong>Total:</strong> ₦${order.amount}</p>

      <p><strong>Reference:</strong> ${order.reference}</p>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // ✅ MUST BE YOUR VERIFIED DOMAIN
        from: "Live Out Loud <orders@liveoutloud.com.ng>",

        // ✅ SEND TO YOUR EMPLOYER EMAIL
        to: ["livenoutloud26@gmail.com"],

        subject: "🧾 New Order Received",
        html: emailHtml,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("❌ Resend error:", resendData);
      return new Response(
        JSON.stringify({ error: "Email failed", resendData }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully 🚀",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("❌ Function error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});

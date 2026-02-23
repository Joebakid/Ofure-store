import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
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

    // ✅ INIT SUPABASE
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // ✅ SAVE ORDER TO DB
    const { error: dbError } = await supabase
      .from("shop_orders")
      .insert([
        {
          name: order.name,
          email: order.email,
          phone: order.phone,
          address: order.address,
          items: order.items,
          subtotal: order.subtotal,
          delivery_fee: order.delivery_fee,
          total: order.amount,
          reference: order.reference,
        },
      ]);

    if (dbError) throw dbError;

    // ✅ SEND EMAIL
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    const emailHtml = `
      <h2>🛒 New Order Received</h2>
      <p><strong>Name:</strong> ${order.name}</p>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Address:</strong> ${order.address}</p>
      <h3>Items</h3>
      <ul>
        ${order.items
          .map((item: any) => `<li>${item.name} × ${item.qty}</li>`)
          .join("")}
      </ul>
      <p><strong>Total:</strong> ₦${order.amount}</p>
      <p><strong>Reference:</strong> ${order.reference}</p>
    `;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Live Out Loud <orders@liveoutloud.com.ng>",
        to: ["livenoutloud26@gmail.com"],
        subject: "🧾 New Order Received",
        html: emailHtml,
      }),
    });

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
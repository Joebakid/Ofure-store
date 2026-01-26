import { supabase } from "../lib/supabase";

/* ================= GET LOGGED IN USER ================= */
async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/* ================= LOG EVENT ================= */
export async function logEvent(event, metadata = {}, forcedAdminId) {
  try {
    if (!event) {
      console.warn("⚠️ Invalid analytics event name:", event);
      return;
    }

    let user = null;

    if (forcedAdminId) {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      user = currentUser;
    } else {
      user = await getCurrentUser();
    }

    const adminId = forcedAdminId || user?.id || null;
    const email = user?.email || metadata?.email || null;

    const payload = {
      event,
      admin_id: adminId,
      country: metadata?.country || null,
      metadata: {
        ...metadata,
        email,
      },
    };

    console.log("📊 Analytics payload:", payload);

    const { error } = await supabase
      .from("analytics_events")
      .insert(payload);

    if (error) {
      console.error("❌ Analytics insert error:", error);
    } else {
      console.log("✅ Analytics saved:", event);
    }
  } catch (err) {
    console.error("❌ Analytics failure:", err);
  }
}

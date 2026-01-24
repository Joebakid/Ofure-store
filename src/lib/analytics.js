import { supabase } from "./supabase";

export const logEvent = async (event, meta = {}) => {
  console.log("📊 Analytics:", event, meta);

  await supabase.from("analytics").insert({
    event,
    meta,
  });
};

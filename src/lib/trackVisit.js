import { supabase } from "./supabase";

export async function trackVisit(page) {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();

    await supabase.from("visitors").insert({
      page,
      country: data.country_name,
    });
  } catch (err) {
    console.log("Tracking failed");
  }
}

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

import AnalyticsGrid from "../components/AnalyticsGrid";
import AnalyticsTable from "../components/AnalyticsTable";
import BackButton from "../../components/BackButton";
import Loader from "../../components/Loader";

export default function AdminAnalytics() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📅 Selected month (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
  });

  /* ================= LOAD EVENTS ================= */
  useEffect(() => {
    async function loadEvents() {
      setLoading(true);

      const { data, error } = await supabase
        .from("analytics_events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Analytics load error:", error);
        setLoading(false);
        return;
      }

      setEvents(data || []);
      setLoading(false);
    }

    loadEvents();
  }, []);

  /* ================= MONTH FILTER ================= */
  const filteredEvents = useMemo(() => {
    if (!selectedMonth) return events;

    const [year, month] = selectedMonth.split("-").map(Number);

    return events.filter((e) => {
      const d = new Date(e.created_at);
      return (
        d.getFullYear() === year &&
        d.getMonth() + 1 === month
      );
    });
  }, [events, selectedMonth]);

  /* ================= DERIVED STATS ================= */
  const stats = useMemo(() => {
    const admins = new Set(
      filteredEvents
        .map((e) => e.metadata?.email)
        .filter(Boolean)
    ).size;

    const visits = filteredEvents.filter(
      (e) => e.event === "user_visit"
    ).length;

    const countries = new Set(
      filteredEvents
        .map((e) => e.country)
        .filter(Boolean)
    ).size;

    const products = filteredEvents.filter(
      (e) => e.event === "product_create"
    ).length;

    return { admins, visits, countries, products };
  }, [filteredEvents]);

  /* ================= COUNTRY BREAKDOWN ================= */
  const countryStats = useMemo(() => {
    const map = {};

    filteredEvents.forEach((e) => {
      if (!e.country) return;
      map[e.country] = (map[e.country] || 0) + 1;
    });

    return Object.entries(map)
      .map(([country, count]) => ({
        country,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredEvents]);

  /* ================= ADMIN ACTIVITY ================= */
  const adminLogins = useMemo(
    () =>
      filteredEvents.filter(
        (e) => e.event === "admin_login"
      ),
    [filteredEvents]
  );

  const productPosts = useMemo(
    () =>
      filteredEvents.filter(
        (e) => e.event === "product_create"
      ),
    [filteredEvents]
  );

  /* ================= MOST VIEWED PRODUCTS ================= */
  const mostViewedProducts = useMemo(() => {
    const map = {};

    filteredEvents
      .filter((e) => e.event === "product_view")
      .forEach((e) => {
        const name = e.metadata?.name || "Unknown";
        map[name] = (map[name] || 0) + 1;
      });

    return Object.entries(map)
      .map(([name, views]) => ({ name, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }, [filteredEvents]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="app-container py-20 flex justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="app-container py-10 space-y-12">
      {/* BACK */}
      <BackButton to="/admin/products" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold">
          Analytics
        </h1>

        {/* 📅 Month Picker */}
        <div className="flex items-center gap-3">
          <label className="text-sm opacity-70">
            Month
          </label>

          <input
            type="month"
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(e.target.value)
            }
            className="border rounded-lg px-3 py-1 text-sm"
          />
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <AnalyticsGrid stats={stats} />

      {/* 🌍 COUNTRY TABLE */}
      <section>
        <h2 className="font-semibold mb-3">
          🌍 Visitors by Country
        </h2>

        <AnalyticsTable
          columns={["Country", "Visits"]}
          rows={countryStats.map((c) => [
            c.country,
            c.count,
          ])}
        />
      </section>

      {/* 👤 ADMIN LOGIN ACTIVITY */}
      <section>
        <h2 className="font-semibold mb-3">
          👤 Admin Logins
        </h2>

        <AnalyticsTable
          columns={["Admin Email", "Date"]}
          rows={adminLogins.map((e) => [
            e.metadata?.email || "Unknown",
            new Date(e.created_at).toLocaleString(),
          ])}
        />
      </section>

      {/* 📦 PRODUCT POSTS */}
      <section>
        <h2 className="font-semibold mb-3">
          📦 Products Posted by Admins
        </h2>

        <AnalyticsTable
          columns={["Admin Email", "Product", "Date"]}
          rows={productPosts.map((e) => [
            e.metadata?.email || "Unknown",
            e.metadata?.name || "—",
            new Date(e.created_at).toLocaleString(),
          ])}
        />
      </section>

      {/* 🔥 MOST VIEWED PRODUCTS */}
      <section>
        <h2 className="font-semibold mb-3">
          🔥 Most Viewed Products
        </h2>

        <AnalyticsTable
          columns={["Product", "Views"]}
          rows={mostViewedProducts.map((p) => [
            p.name,
            p.views,
          ])}
        />
      </section>
    </div>
  );
}

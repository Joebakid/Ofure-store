import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAdmin } from "../../context/AdminContext";

import AnalyticsGrid from "../components/AnalyticsGrid";
import AnalyticsTable from "../components/AnalyticsTable";
import BackButton from "../../components/BackButton";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";

const PAGE_SIZE = 6;

export default function AdminAnalytics() {
  const { admin, loading: adminLoading } = useAdmin();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ REAL PRODUCTS COUNT
  const [totalProducts, setTotalProducts] = useState(0);

  // 📅 Selected month (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
  });

  // 📄 Pagination state
  const [countryPage, setCountryPage] = useState(1);
  const [loginPage, setLoginPage] = useState(1);
  const [postPage, setPostPage] = useState(1);
  const [viewPage, setViewPage] = useState(1);

  /* ================= LOAD ANALYTICS EVENTS ================= */
  useEffect(() => {
    if (!admin) return;

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
  }, [admin]);

  /* ================= LOAD REAL PRODUCT COUNT ================= */
  useEffect(() => {
    if (!admin) return;

    async function loadProductCount() {
      const { count, error } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("❌ Product count error:", error);
        return;
      }

      setTotalProducts(count || 0);
    }

    loadProductCount();
  }, [admin]);

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

  // 🔁 Reset pagination when month changes
  useEffect(() => {
    setCountryPage(1);
    setLoginPage(1);
    setPostPage(1);
    setViewPage(1);
  }, [selectedMonth]);

  /* ================= SUMMARY STATS ================= */
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

    return {
      admins,
      visits,
      countries,
      products: totalProducts,
    };
  }, [filteredEvents, totalProducts]);

  /* ================= COUNTRY BREAKDOWN ================= */
  const countryStats = useMemo(() => {
    const map = {};

    filteredEvents.forEach((e) => {
      if (!e.country) return;
      map[e.country] = (map[e.country] || 0) + 1;
    });

    return Object.entries(map)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredEvents]);

  /* ================= ADMIN ACTIVITY ================= */
  const adminLogins = useMemo(
    () => filteredEvents.filter((e) => e.event === "admin_login"),
    [filteredEvents]
  );

  const productPosts = useMemo(
    () => filteredEvents.filter((e) => e.event === "product_create"),
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
      .slice(0, 50);
  }, [filteredEvents]);

  /* ================= PAGINATION ================= */
  function paginate(list, page) {
    const start = (page - 1) * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
  }

  const pagedCountries = useMemo(
    () => paginate(countryStats, countryPage),
    [countryStats, countryPage]
  );

  const pagedLogins = useMemo(
    () => paginate(adminLogins, loginPage),
    [adminLogins, loginPage]
  );

  const pagedPosts = useMemo(
    () => paginate(productPosts, postPage),
    [productPosts, postPage]
  );

  const pagedViews = useMemo(
    () => paginate(mostViewedProducts, viewPage),
    [mostViewedProducts, viewPage]
  );

  /* ================= LOADING ================= */
  if (adminLoading || loading) {
    return (
      <div className="app-container py-20 flex justify-center">
        <Loader />
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="app-container py-10 space-y-12">
      <BackButton to="/admin/products" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold">Analytics</h1>

        <div className="flex items-center gap-3">
          <label className="text-sm opacity-70">Month</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          />
        </div>
      </div>

      {/* SUMMARY */}
      <AnalyticsGrid stats={stats} />

      {/* 🌍 COUNTRY */}
      <section>
        <h2 className="font-semibold mb-3">🌍 Visitors by Country</h2>
        <AnalyticsTable
          columns={["Country", "Visits"]}
          rows={pagedCountries.map((c) => [c.country, c.count])}
        />
        <div className="mt-6">
          <Pagination
            currentPage={countryPage}
            totalPages={Math.max(1, Math.ceil(countryStats.length / PAGE_SIZE))}
            onPageChange={setCountryPage}
          />
        </div>
      </section>

      {/* 👤 ADMIN LOGINS */}
      <section>
        <h2 className="font-semibold mb-3">👤 Admin Logins</h2>
        <AnalyticsTable
          columns={["Admin Email", "Date"]}
          rows={pagedLogins.map((e) => [
            e.metadata?.email || "Unknown",
            new Date(e.created_at).toLocaleString(),
          ])}
        />
        <div className="mt-6">
          <Pagination
            currentPage={loginPage}
            totalPages={Math.max(1, Math.ceil(adminLogins.length / PAGE_SIZE))}
            onPageChange={setLoginPage}
          />
        </div>
      </section>

      {/* 📦 PRODUCT POSTS */}
      <section>
        <h2 className="font-semibold mb-3">📦 Products Posted by Admins</h2>
        <AnalyticsTable
          columns={["Admin Email", "Product", "Date"]}
          rows={pagedPosts.map((e) => [
            e.metadata?.email || "Unknown",
            e.metadata?.name || "—",
            new Date(e.created_at).toLocaleString(),
          ])}
        />
        <div className="mt-6">
          <Pagination
            currentPage={postPage}
            totalPages={Math.max(1, Math.ceil(productPosts.length / PAGE_SIZE))}
            onPageChange={setPostPage}
          />
        </div>
      </section>

      {/* 🔥 MOST VIEWED */}
      <section>
        <h2 className="font-semibold mb-3">🔥 Most Viewed Products</h2>
        <AnalyticsTable
          columns={["Product", "Views"]}
          rows={pagedViews.map((p) => [p.name, p.views])}
        />
        <div className="mt-6">
          <Pagination
            currentPage={viewPage}
            totalPages={Math.max(
              1,
              Math.ceil(mostViewedProducts.length / PAGE_SIZE)
            )}
            onPageChange={setViewPage}
          />
        </div>
      </section>
    </div>
  );
}

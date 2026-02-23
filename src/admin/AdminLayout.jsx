import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function checkAdminAccess() {
      console.log("🔐 AdminLayout: checking session");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        console.warn("❌ No session — redirecting to login");
        navigate("/login", {
          replace: true,
          state: { from: location.pathname },
        });
        return;
      }

      console.log("✅ Session found:", session.user.id);

      const { data: adminRow, error } = await supabase
        .from("admins")
        .select("id, role")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("❌ Admin lookup error:", error);
        navigate("/", { replace: true });
        return;
      }

      if (!adminRow) {
        console.warn("❌ Not an admin — redirect home");
        navigate("/", { replace: true });
        return;
      }

      console.log("✅ Admin confirmed:", adminRow);

      setAdmin(adminRow);
      setSessionChecked(true);
      setLoading(false);
    }

    checkAdminAccess();

    return () => {
      cancelled = true;
    };
  }, [navigate, location.pathname]);

  // ⏳ HARD BLOCK — no redirects while checking
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-milk">
        <p className="text-sm opacity-70">Checking admin access..…</p>
      </div>
    );
  }

  // ❌ Safety net (should never hit)
  if (!sessionChecked || !admin) {
    return null;
  }

  return (
    <>
      {/* 🔒 Make admin role available everywhere */}
      <Outlet context={{ admin }} />
    </>
  );
}

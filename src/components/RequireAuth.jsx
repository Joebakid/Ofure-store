import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function RequireAuth({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking auth…
      </div>
    );
  }

  if (!session) {
    console.warn("🔒 No session → login");
    return <Navigate to="/login" replace />;
  }

  return children;
}

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // ❗ Not logged in → NOT an error
      if (!user) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("admins")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setAdmin(data || null);
      setLoading(false);
    }

    loadAdmin();
  }, []);

  return (
    <AdminContext.Provider value={{ admin, loading }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAdmin } from "../../context/AdminContext";
import Loader from "../../components/Loader";

export default function Admins() {
  const { admin } = useAdmin();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdmins() {
      const { data } = await supabase
        .from("admins")
        .select("id, role, user_id, created_at")
        .order("created_at", { ascending: false });

      setAdmins(data || []);
      setLoading(false);
    }

    loadAdmins();
  }, []);

  async function removeAdmin(id) {
    if (!window.confirm("Remove this admin?")) return;

    await supabase.from("admins").delete().eq("id", id);

    setAdmins((a) => a.filter((x) => x.id !== id));
  }

  if (loading) {
    return (
      <div className="app-container py-20 flex justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="app-container py-10">
      <h1 className="text-xl font-semibold mb-6">
        Admins
      </h1>

      <div className="space-y-3">
        {admins.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between bg-white rounded-xl p-4"
          >
            <div>
              <p className="font-medium">{a.user_id}</p>
              <p className="text-sm opacity-60">
                {a.role}
              </p>
            </div>

            {admin?.isOwner && a.role !== "owner" && (
              <button
                onClick={() => removeAdmin(a.id)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

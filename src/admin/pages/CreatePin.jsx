import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAdmin } from "../../context/AdminContext";

export default function CreatePin() {
  const { admin } = useAdmin();
  const [pin, setPin] = useState("");

  if (admin?.role !== "owner") {
    return <p className="mt-10 text-center">Access denied</p>;
  }

  async function savePin() {
    if (pin.length < 4) {
      alert("PIN must be at least 4 digits");
      return;
    }

    const hash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(pin)
    );

    const hashHex = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    await supabase
      .from("admins")
      .update({ pin_hash: hashHex })
      .eq("id", admin.id);

    alert("PIN saved");
  }

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-semibold text-center">
        Set Owner PIN
      </h1>

      <input
        type="password"
        className="input"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="Enter PIN"
      />

      <button
        onClick={savePin}
        className="w-full bg-black text-white py-2 rounded"
      >
        Save PIN
      </button>
    </div>
  );
}

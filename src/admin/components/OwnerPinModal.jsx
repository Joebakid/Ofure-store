import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function OwnerPinModal({
  open,
  onClose,
  onApproved,
}) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleApprove() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.rpc(
      "verify_owner_pin",
      { input_pin: pin }
    );

    setLoading(false);

    if (error || !data) {
      setError("Invalid owner PIN");
      return;
    }

    setPin("");
    onApproved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold text-center">
          Owner Approval Required
        </h2>

        <input
          type="password"
          inputMode="numeric"
          placeholder="Enter owner PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />

        {error && (
          <p className="text-sm text-red-500 text-center">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex-1 bg-black text-white rounded-lg py-2 disabled:opacity-60"
          >
            {loading ? "Checking…" : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}

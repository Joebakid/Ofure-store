import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/admin/products"); // ✅ FIX
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-milk">
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
      </div>

      <div className="flex items-center justify-center mt-24">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-2xl shadow w-full max-w-sm
                     border border-gray-200"
        >
          <h1 className="text-xl font-semibold mb-4 text-center">
            Admin Login
          </h1>

          {error && (
            <p className="mb-3 text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="input mt-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className="mt-4 w-full bg-mauve text-white py-2 rounded disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

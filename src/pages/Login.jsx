import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.username, form.password);
      navigate("/admin/about", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md border border-slate-200 bg-white p-5 sm:p-8"
      >
        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          Admin sign in
        </h1>

        <p className="mb-6 text-sm text-slate-500">
          Manage your portfolio content.
        </p>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <label className="mb-4 block text-sm font-medium text-slate-700">
          Username
          <input
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </label>
        
        <label className="mb-6 block text-sm font-medium text-slate-700">
          Password
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </label>
        
        <button
          disabled={loading}
          className="h-11 w-full cursor-pointer rounded-md bg-blue-600 px-4 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}

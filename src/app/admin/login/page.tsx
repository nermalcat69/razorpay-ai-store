"use client";

import { useState } from "react";
import { loginAction } from "../actions";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await loginAction(password);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.12)] ring-1 ring-black/6">
        <h1 className="text-lg font-semibold text-foreground">Admin Login</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Jeevan PG — Admin Panel</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="rounded-xl border border-black/10 bg-neutral-50 px-3.5 py-2.5 text-[13px] text-foreground outline-none ring-0 transition focus:border-black/20 focus:bg-white focus:ring-2 focus:ring-black/8"
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-[12px] text-red-600 ring-1 ring-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-xl bg-foreground py-2.5 text-[13px] font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

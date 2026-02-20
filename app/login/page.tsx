"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setMsg(null);

    const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
    else router.replace(redirectTo);

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f5f5f7]">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">RIVUS</div>
          <div className="text-sm text-[#6e6e73] mt-1">Prijava u sustav</div>
        </div>

        <div className="rounded-2xl bg-white border border-[#d2d2d7] shadow-sm p-6">
          <div className="space-y-3">
            <input
              className="w-full rounded-xl border border-[#d2d2d7] px-4 py-3 bg-white text-[#1d1d1f] placeholder:text-[#6e6e73] outline-none focus:ring-2 focus:ring-[#0071e3]/25 focus:border-[#0071e3]"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="w-full rounded-xl border border-[#d2d2d7] px-4 py-3 bg-white text-[#1d1d1f] placeholder:text-[#6e6e73] outline-none focus:ring-2 focus:ring-[#0071e3]/25 focus:border-[#0071e3]"
              placeholder="Lozinka"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {msg && (
              <div className="text-sm text-[#b42318] bg-[#fffbfa] border border-[#fecdca] rounded-xl px-4 py-3">
                {msg}
              </div>
            )}

            <button
              onClick={submit}
              disabled={loading}
              className="w-full rounded-xl bg-[#0071e3] text-white py-3 font-medium hover:bg-[#0066cc] transition disabled:opacity-60"
            >
              {loading ? "..." : "Prijavi se"}
            </button>

            <div className="flex items-center justify-between pt-2 text-sm">
              <a href="/reset" className="text-[#0071e3] hover:underline">
                Zaboravljena lozinka
              </a>
              <a href="/register" className="text-[#0071e3] hover:underline">
                Registracija
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[#6e6e73]">
          <span>© {new Date().getFullYear()} RIVUS</span>
          <span className="mx-2">·</span>
          <a className="hover:underline" href="/uvjeti">Uvjeti</a>
          <span className="mx-2">·</span>
          <a className="hover:underline" href="/privatnost">Privatnost</a>
        </div>
      </div>
    </div>
  );
}
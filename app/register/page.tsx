"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setMsg(null);

    const { error } = await supabaseBrowser.auth.signUp({ email, password });
    if (error) setMsg(error.message);
    else setMsg("Registracija kreirana. Ako treba, potvrdi email pa se prijavi.");

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f5f5f7]">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">RIVUS</div>
          <div className="text-sm text-[#6e6e73] mt-1">Registracija</div>
        </div>

        <div className="rounded-2xl bg-white border border-[#d2d2d7] shadow-sm p-6 space-y-3">
          <input
            className="w-full rounded-xl border border-[#d2d2d7] px-4 py-3 bg-white text-[#1d1d1f] placeholder:text-[#6e6e73] outline-none focus:ring-2 focus:ring-[#0071e3]/25 focus:border-[#0071e3]"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full rounded-xl border border-[#d2d2d7] px-4 py-3 bg-white text-[#1d1d1f] placeholder:text-[#6e6e73] outline-none focus:ring-2 focus:ring-[#0071e3]/25 focus:border-[#0071e3]"
            placeholder="Lozinka"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {msg && (
            <div className="text-sm text-[#1d1d1f] bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-4 py-3">
              {msg}
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full rounded-xl bg-[#0071e3] text-white py-3 font-medium hover:bg-[#0066cc] transition disabled:opacity-60"
          >
            {loading ? "..." : "Registriraj se"}
          </button>

          <button
            onClick={() => router.push("/login")}
            className="w-full rounded-xl border border-[#d2d2d7] bg-white text-[#1d1d1f] py-3 font-medium hover:bg-[#f5f5f7] transition"
          >
            Nazad na prijavu
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";

export default function LockdownPage() {
  const { mode } = usePlatformMode();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F7F7F8",
        fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Red lockdown banner */}
      <div
        style={{
          backgroundColor: "#DC2626",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span
          style={{
            color: "white",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          SUSTAV JE U LOCKDOWN MODU — SVE OPERACIJE BLOKIRANE
        </span>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Image
              src="/logo-icon.png"
              alt="RIVUS"
              width={36}
              height={36}
              priority
            />
            <Image
              src="/logo-text.png"
              alt="RIVUS"
              width={90}
              height={22}
              priority
            />
          </div>

          {/* Lock icon */}
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              backgroundColor: "#FEF2F2",
              border: "1px solid #FECACA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#DC2626"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          {/* Title & message */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" }}>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#0B0B0C",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Sustav privremeno nedostupan
            </h1>
            <p
              style={{
                fontSize: "15px",
                color: "#6E6E73",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              RIVUS OS je trenutno u zaštitnom lockdown modu.
              Sve operacije pisanja blokirane su na razini baze podataka.
              Čitanje i forenzički pregled dostupni su samo CORE administratoru.
            </p>
          </div>

          {/* Info card */}
          <div
            style={{
              width: "100%",
              backgroundColor: "white",
              border: "1px solid #E8E8EC",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#8E8E93",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                STATUS PLATFORME
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#DC2626",
                  }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#DC2626",
                  }}
                >
                  LOCKDOWN
                </span>
              </div>
            </div>

            <div
              style={{
                height: "1px",
                backgroundColor: "#E8E8EC",
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#8E8E93",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                KONTAKT
              </span>
              <span style={{ fontSize: "14px", color: "#3C3C43" }}>
                RIVUS CORE d.o.o.
              </span>
              <span style={{ fontSize: "14px", color: "#3C3C43" }}>
                Kozjačka 1a, Osijek
              </span>
              <a
                href="mailto:admin@rivus.hr"
                style={{
                  fontSize: "14px",
                  color: "#2563EB",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                admin@rivus.hr
              </a>
            </div>
          </div>

          {/* Admin login link */}
          <Link
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#2563EB",
              color: "white",
              padding: "12px 24px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "0.01em",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            CORE Admin — Prijava
          </Link>
        </div>
      </div>

      {/* Footer disclaimer */}
      <footer
        style={{
          borderTop: "1px solid #E8E8EC",
          padding: "20px 24px",
          backgroundColor: "white",
        }}
      >
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#8E8E93",
            margin: 0,
            lineHeight: "1.5",
          }}
        >
          RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
          Odgovornost za izvršenje obveza ostaje na odgovornoj strani.
          RIVUS ne pruža pravne, porezne niti financijske savjete.
        </p>
      </footer>
    </div>
  );
}

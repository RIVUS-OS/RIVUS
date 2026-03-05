"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";

export default function UnauthorizedPage() {
  const { mode } = usePlatformMode();
  const router = useRouter();

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

          {/* Shield icon */}
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              backgroundColor: "#FFF7ED",
              border: "1px solid #FED7AA",
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
              stroke="#EA580C"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          {/* Title & message */}
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#0B0B0C",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Pristup nije dozvoljen
            </h1>
            <p
              style={{
                fontSize: "15px",
                color: "#6E6E73",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              Nemate ovlasti za pristup ovoj stranici.
              Vaša uloga ne uključuje potrebna dopuštenja.
              Ako smatrate da je ovo pogreška, kontaktirajte CORE administratora.
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
              gap: "12px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#8E8E93",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              MOGUĆI RAZLOZI
            </span>

            {[
              "Nedovoljne ovlasti za ovu funkciju",
              "SPV nije dodijeljen vašem korisničkom računu",
              "Sesija je istekla — prijavite se ponovo",
              "Stranica je dostupna samo višim rolama",
            ].map((reason, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    marginTop: "4px",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#C7C7CC",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "14px", color: "#3C3C43", lineHeight: "1.5" }}>
                  {reason}
                </span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              width: "100%",
            }}
          >
            <button
              onClick={() => router.back()}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                backgroundColor: "white",
                color: "#3C3C43",
                border: "1px solid #E8E8EC",
                padding: "12px 20px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
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
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Natrag
            </button>

            <Link
              href="/login"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                backgroundColor: "#2563EB",
                color: "white",
                padding: "12px 20px",
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
              Prijava
            </Link>
          </div>
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

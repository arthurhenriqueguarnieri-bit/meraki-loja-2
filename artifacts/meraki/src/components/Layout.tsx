import React from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag } from "lucide-react";
import { useStore } from "@/lib/store";
import merakiLogoBege from "@assets/meraki_logo_bege_1779840593669.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const cart = useStore(state => state.cart);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans text-foreground bg-background">

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ backgroundColor: "#111111", borderColor: "#C9B99A" }}
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">

          <div className="w-16 flex items-center">
            {location !== "/" && (
              <Link
                href="/"
                className="text-xs font-light transition-opacity hover:opacity-70"
                style={{ color: "#C9B99A", letterSpacing: "0.15em" }}
              >
                VOLTAR
              </Link>
            )}
          </div>

          <Link href="/" className="flex items-center justify-center group select-none">
            <img
              src={merakiLogoBege}
              alt="Meraki Moda Íntima"
              className="transition-opacity group-hover:opacity-75"
              style={{ height: "60px", width: "auto", objectFit: "contain" }}
            />
          </Link>

          <div className="w-16 flex items-center justify-end">
            <Link href="/cart" className="relative group p-2 -mr-2">
              <ShoppingBag
                className="w-5 h-5 transition-opacity group-hover:opacity-70"
                style={{ color: "#F5F0EB" }}
                strokeWidth={1.5}
              />
              {cartItemCount > 0 && (
                <span
                  className="absolute top-0 right-0 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#C9B99A", color: "#1A1A1A" }}
                >
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* ── FOOTER ── */}
      <footer className="mt-20 py-16" style={{ backgroundColor: "#111111" }}>
        <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-8">

          <div className="flex flex-col items-center">
            <span
              className="font-serif italic font-light leading-none"
              style={{ fontSize: "2rem", color: "#F5F0EB" }}
            >
              Meraki
            </span>
            <span
              className="font-sans font-light mt-1 uppercase"
              style={{ fontSize: "0.5rem", letterSpacing: "0.35em", color: "#C9B99A" }}
            >
              Moda Íntima
            </span>
          </div>

          <p
            className="font-sans font-light italic text-sm"
            style={{ color: "#C9B99A", letterSpacing: "0.05em" }}
          >
            Meraki — a arte de fazer com alma.
          </p>

          <div
            className="w-16 border-t"
            style={{ borderColor: "#C9B99A", opacity: 0.4 }}
          />

          <div className="flex items-center justify-center gap-10">
            <a
              href="https://instagram.com/merakemodaintima"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 group"
            >
              <span
                className="font-sans font-light text-[10px] uppercase transition-opacity group-hover:opacity-100"
                style={{ letterSpacing: "0.25em", color: "#C9B99A", opacity: 0.7 }}
              >
                Instagram
              </span>
              <span
                className="font-sans font-light text-xs transition-opacity group-hover:opacity-100"
                style={{ color: "#F5F0EB", opacity: 0.85 }}
              >
                @merakemodaintima
              </span>
            </a>

            <div style={{ width: 1, height: 32, backgroundColor: "#C9B99A", opacity: 0.25 }} />

            <a
              href="https://wa.me/5566999621253"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 group"
            >
              <span
                className="font-sans font-light text-[10px] uppercase transition-opacity group-hover:opacity-100"
                style={{ letterSpacing: "0.25em", color: "#C9B99A", opacity: 0.7 }}
              >
                WhatsApp
              </span>
              <span
                className="font-sans font-light text-xs transition-opacity group-hover:opacity-100"
                style={{ color: "#F5F0EB", opacity: 0.85 }}
              >
                (66) 99962-12532
              </span>
            </a>
          </div>

          <div className="w-full flex justify-end pt-4">
            <Link
              href="/admin"
              className="transition-opacity"
              style={{ opacity: 0.12 }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.12")}
            >
              <span
                className="font-sans font-light text-[9px] uppercase"
                style={{ letterSpacing: "0.2em", color: "#C9B99A" }}
              >
                admin
              </span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

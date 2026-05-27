import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, X, Instagram } from "lucide-react";
import { useStore, CATEGORIES, Category } from "@/lib/store";
import merakiLogoBege from "@assets/meraki_logo_bege_1779840593669.png";

const GOLD = "#C9B99A";
const BEGE = "#F5F0EB";
const HEADER_BG = "#111111";
const DRAWER_BG = "#111111";

export function Layout({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();
  const cart = useStore(state => state.cart);
  const setActiveCategory = useStore(state => state.setActiveCategory);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const handleCategoryClick = (cat: Category) => {
    setActiveCategory(cat);
    setDrawerOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans text-foreground bg-background">

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ backgroundColor: HEADER_BG, borderColor: GOLD, overflow: "visible", minHeight: "60px", display: "flex", alignItems: "center" }}
      >
        <div className="container mx-auto px-4 flex items-center justify-between w-full" style={{ overflow: "visible", minHeight: "60px" }}>

          {/* Hamburger */}
          <div className="w-16 flex items-center">
            <button
              aria-label="Abrir menu"
              onClick={() => setDrawerOpen(true)}
              className="p-2 -ml-2 transition-opacity hover:opacity-70"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round">
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center justify-center group select-none" style={{ overflow: "visible" }}>
            <img
              src={merakiLogoBege}
              alt="Meraki Moda Íntima"
              className="transition-opacity group-hover:opacity-75"
              style={{ height: "28px", width: "auto", display: "block", objectFit: "contain" }}
            />
          </Link>

          {/* Cart */}
          <div className="w-16 flex items-center justify-end">
            <Link href="/cart" className="relative group p-2 -mr-2">
              <ShoppingBag
                className="w-5 h-5 transition-opacity group-hover:opacity-70"
                style={{ color: BEGE }}
                strokeWidth={1.5}
              />
              {cartItemCount > 0 && (
                <span
                  className="absolute top-0 right-0 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center"
                  style={{ backgroundColor: GOLD, color: "#1A1A1A" }}
                >
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ── DRAWER OVERLAY ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[100]"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── DRAWER PANEL ── */}
      <div
        className="fixed top-0 left-0 z-[101] h-full flex flex-col"
        style={{
          width: "min(320px, 85vw)",
          backgroundColor: DRAWER_BG,
          borderRight: `1px solid ${GOLD}`,
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: drawerOpen ? "4px 0 32px rgba(0,0,0,0.6)" : "none",
        }}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: `1px solid rgba(201,185,154,0.2)` }}
        >
          <img
            src={merakiLogoBege}
            alt="Meraki"
            style={{ height: "52px", width: "auto", objectFit: "contain" }}
          />
          <button
            aria-label="Fechar menu"
            onClick={() => setDrawerOpen(false)}
            className="p-1 transition-opacity hover:opacity-70"
            style={{ background: "none", border: "none", cursor: "pointer", color: GOLD }}
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Category links */}
        <nav className="flex flex-col px-6 pt-6 pb-2 gap-1">
          <span
            className="font-sans font-light mb-3"
            style={{ fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, opacity: 0.6 }}
          >
            Coleção
          </span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="text-left font-sans font-light py-2.5 transition-opacity hover:opacity-100 w-full"
              style={{
                fontSize: "0.8rem",
                letterSpacing: "0.12em",
                color: BEGE,
                opacity: 0.8,
                background: "none",
                border: "none",
                cursor: "pointer",
                borderBottom: `1px solid rgba(201,185,154,0.08)`,
              }}
            >
              {cat === "Todos" ? "Todos os Produtos" : cat}
            </button>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Social links */}
        <div
          className="px-6 py-6 flex flex-col gap-4"
          style={{ borderTop: `1px solid rgba(201,185,154,0.2)` }}
        >
          <a
            href="https://instagram.com/merakemodaintima"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 transition-opacity hover:opacity-100"
            style={{ opacity: 0.75 }}
          >
            <Instagram className="w-4 h-4 shrink-0" style={{ color: GOLD }} strokeWidth={1.5} />
            <span
              className="font-sans font-light"
              style={{ fontSize: "0.75rem", color: BEGE, letterSpacing: "0.05em" }}
            >
              @merakemodaintima
            </span>
          </a>

          <a
            href="https://wa.me/5566999621253"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 transition-opacity hover:opacity-100"
            style={{ opacity: 0.75 }}
          >
            {/* WhatsApp icon SVG */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <span
              className="font-sans font-light"
              style={{ fontSize: "0.75rem", color: BEGE, letterSpacing: "0.05em" }}
            >
              (66) 99962-12532
            </span>
          </a>

          <Link
            href="/admin"
            onClick={() => setDrawerOpen(false)}
            className="transition-opacity"
            style={{ opacity: 0.15 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.5")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "0.15")}
          >
            <span
              className="font-sans font-light text-[9px] uppercase"
              style={{ letterSpacing: "0.2em", color: GOLD }}
            >
              admin
            </span>
          </Link>
        </div>
      </div>

      <main className="flex-1">{children}</main>

      {/* ── FOOTER ── */}
      <footer className="mt-20 py-16" style={{ backgroundColor: HEADER_BG }}>
        <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-8">

          <div className="flex flex-col items-center">
            <span
              className="font-serif italic font-light leading-none"
              style={{ fontSize: "2rem", color: BEGE }}
            >
              Meraki
            </span>
            <span
              className="font-sans font-light mt-1 uppercase"
              style={{ fontSize: "0.5rem", letterSpacing: "0.35em", color: GOLD }}
            >
              Moda Íntima
            </span>
          </div>

          <p
            className="font-sans font-light italic text-sm"
            style={{ color: GOLD, letterSpacing: "0.05em" }}
          >
            Meraki — a arte de fazer com alma.
          </p>

          <div className="w-16 border-t" style={{ borderColor: GOLD, opacity: 0.4 }} />

          <div className="flex items-center justify-center gap-10">
            <a
              href="https://instagram.com/merakemodaintima"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 group"
            >
              <span
                className="font-sans font-light text-[10px] uppercase transition-opacity group-hover:opacity-100"
                style={{ letterSpacing: "0.25em", color: GOLD, opacity: 0.7 }}
              >
                Instagram
              </span>
              <span
                className="font-sans font-light text-xs"
                style={{ color: BEGE, opacity: 0.85 }}
              >
                @merakemodaintima
              </span>
            </a>

            <div style={{ width: 1, height: 32, backgroundColor: GOLD, opacity: 0.25 }} />

            <a
              href="https://wa.me/5566999621253"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 group"
            >
              <span
                className="font-sans font-light text-[10px] uppercase transition-opacity group-hover:opacity-100"
                style={{ letterSpacing: "0.25em", color: GOLD, opacity: 0.7 }}
              >
                WhatsApp
              </span>
              <span
                className="font-sans font-light text-xs"
                style={{ color: BEGE, opacity: 0.85 }}
              >
                (66) 99962-12532
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

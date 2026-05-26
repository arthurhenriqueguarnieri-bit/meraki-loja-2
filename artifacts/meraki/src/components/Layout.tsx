import React from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Lock } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const cart = useStore(state => state.cart);
  
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans text-foreground bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          
          <div className="w-12 flex items-center">
            {location !== "/" && (
              <Link href="/" className="text-sm font-medium hover:opacity-70 transition-opacity">
                Voltar
              </Link>
            )}
          </div>

          <Link href="/" className="flex flex-col items-center group">
            <span className="font-serif italic text-4xl tracking-tight leading-none group-hover:opacity-80 transition-opacity">Meraki</span>
            <span className="text-[10px] tracking-[0.3em] font-medium mt-1 uppercase text-muted-foreground group-hover:opacity-80 transition-opacity">Moda Íntima</span>
          </Link>

          <div className="w-12 flex items-center justify-end gap-4">
            <Link href="/cart" className="relative group p-2 -mr-2">
              <ShoppingBag className="w-5 h-5 text-foreground group-hover:opacity-70 transition-opacity" strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-primary text-primary-foreground py-16 mt-20">
        <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-8">
          <div className="flex flex-col items-center">
             <span className="font-serif italic text-3xl tracking-tight leading-none">Meraki</span>
             <span className="text-[9px] tracking-[0.3em] font-medium mt-1 uppercase opacity-70">Moda Íntima</span>
          </div>
          
          <div className="max-w-md text-sm leading-relaxed opacity-80 font-light">
            <p>Cultivando a beleza de ser quem você é.</p>
            <p className="mt-2">Atendimento de segunda a sexta, das 9h às 18h.</p>
          </div>

          <div className="flex items-center justify-center gap-8 pt-4">
            <a 
              href="https://instagram.com/merakemodaintima" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm hover:opacity-70 transition-opacity uppercase tracking-wider"
            >
              Instagram
            </a>
            <a 
              href="https://wa.me/5566999621253" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm hover:opacity-70 transition-opacity uppercase tracking-wider"
            >
              WhatsApp
            </a>
          </div>

          <div className="w-full flex justify-end pt-8">
            <Link href="/admin" className="opacity-20 hover:opacity-100 transition-opacity p-2">
              <Lock className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

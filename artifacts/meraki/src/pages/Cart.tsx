import React from "react";
import { Link } from "wouter";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const GOLD = "#C9B99A";
const BEGE = "#F5F0EB";
const DARK = "#1A1A1A";
const CARD_BG = "#222222";

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity } = useStore();
  const [showPixDialog, setShowPixDialog] = React.useState(false);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleWhatsAppCheckout = () => {
    const phone = "5566996212532";
    let message = "Olá! Gostaria de finalizar meu pedido:\n\n";
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.productName} (Tam: ${item.size}) — ${formatCurrency(item.price * item.quantity)}\n`;
    });
    message += `\nTotal: ${formatCurrency(total)}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (cart.length === 0) {
    return (
      <div
        className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center min-h-[60vh]"
        data-testid="cart-empty"
      >
        <h1
          className="font-serif italic font-light mb-6"
          style={{ fontSize: "2.4rem", color: BEGE }}
        >
          Sua sacola está vazia
        </h1>
        <p
          className="font-sans font-light text-sm mb-10"
          style={{ color: GOLD, letterSpacing: "0.06em" }}
        >
          Descubra peças feitas para celebrar a sua feminilidade.
        </p>
        <Link
          href="/"
          className="font-sans font-light transition-all"
          style={{
            fontSize: "0.62rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: DARK,
            backgroundColor: GOLD,
            border: `1px solid ${GOLD}`,
            padding: "0.8rem 2.5rem",
          }}
        >
          Continuar Comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <h1
        className="font-serif italic font-light mb-12"
        style={{ fontSize: "2.4rem", color: BEGE }}
      >
        Sua Sacola
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── ITEMS ── */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <div
              key={`${item.productId}-${item.size}`}
              data-testid={`cart-item-${item.productId}`}
              className="flex gap-4 pb-6"
              style={{ borderBottom: `1px solid rgba(201,185,154,0.15)` }}
            >
              <div
                className="shrink-0"
                style={{ width: "6rem", aspectRatio: "1/1", backgroundColor: CARD_BG }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3
                      className="font-sans font-light text-sm leading-snug"
                      style={{ color: BEGE }}
                    >
                      {item.productName}
                    </h3>
                    <p
                      className="font-sans font-light text-xs mt-1"
                      style={{ color: GOLD, letterSpacing: "0.1em" }}
                    >
                      Tamanho: {item.size}
                    </p>
                  </div>
                  <button
                    data-testid={`btn-remove-${item.productId}`}
                    onClick={() => removeFromCart(item.productId, item.size)}
                    className="p-1 transition-opacity hover:opacity-100"
                    style={{ color: GOLD, opacity: 0.5 }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-auto flex justify-between items-end pt-3">
                  <div
                    className="flex items-center"
                    style={{ border: `1px solid rgba(201,185,154,0.3)` }}
                  >
                    <button
                      data-testid={`btn-dec-${item.productId}`}
                      onClick={() => updateCartQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                      className="p-2 transition-opacity disabled:opacity-30 hover:opacity-70"
                      style={{ color: GOLD }}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span
                      className="w-8 text-center font-sans font-light text-sm"
                      style={{ color: BEGE }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      data-testid={`btn-inc-${item.productId}`}
                      onClick={() => updateCartQuantity(item.productId, item.size, item.quantity + 1)}
                      className="p-2 transition-opacity hover:opacity-70"
                      style={{ color: GOLD }}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p
                      className="font-sans font-light text-sm"
                      style={{ color: GOLD }}
                    >
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    {item.originalPrice && (
                      <>
                        <p
                          className="font-sans font-light text-xs line-through"
                          style={{ color: "rgba(245,240,235,0.35)" }}
                        >
                          {formatCurrency(item.originalPrice * item.quantity)}
                        </p>
                        <p
                          className="font-sans font-light text-[10px] mt-0.5"
                          style={{ color: GOLD, letterSpacing: "0.05em" }}
                        >
                          economia: {formatCurrency((item.originalPrice - item.price) * item.quantity)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── SUMMARY ── */}
        <div className="lg:col-span-1">
          <div
            className="p-6 sticky top-28"
            style={{ backgroundColor: CARD_BG, border: `1px solid rgba(201,185,154,0.2)` }}
          >
            <h2
              className="font-serif italic font-light mb-6"
              style={{ fontSize: "1.5rem", color: BEGE }}
            >
              Resumo
            </h2>

            <div
              className="space-y-3 text-sm mb-6 pb-6"
              style={{ borderBottom: `1px solid rgba(201,185,154,0.15)` }}
            >
              <div className="flex justify-between">
                <span className="font-sans font-light" style={{ color: GOLD, fontSize: "0.8rem" }}>Subtotal</span>
                <span className="font-sans font-light text-sm" style={{ color: BEGE }}>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans font-light" style={{ color: GOLD, fontSize: "0.8rem" }}>Frete</span>
                <span
                  className="font-sans font-light"
                  style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: GOLD, textTransform: "uppercase" }}
                >
                  A calcular
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="font-sans font-light text-sm" style={{ color: BEGE }}>Total</span>
              <span className="font-sans font-light text-xl" style={{ color: GOLD }}>
                {formatCurrency(total)}
              </span>
            </div>

            <div className="space-y-3">
              <button
                data-testid="btn-whatsapp-checkout"
                onClick={handleWhatsAppCheckout}
                className="w-full font-sans font-light transition-all"
                style={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  backgroundColor: GOLD,
                  color: DARK,
                  border: `1px solid ${GOLD}`,
                  padding: "0.9rem",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = BEGE)}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = GOLD)}
              >
                Finalizar pelo WhatsApp
              </button>
              <button
                data-testid="btn-pix-checkout"
                onClick={() => setShowPixDialog(true)}
                className="w-full font-sans font-light transition-all"
                style={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  backgroundColor: "transparent",
                  color: GOLD,
                  border: `1px solid rgba(201,185,154,0.45)`,
                  padding: "0.9rem",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = GOLD)}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,185,154,0.45)")}
              >
                Pagar via PIX ou Cartão
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── PIX DIALOG ── */}
      <Dialog open={showPixDialog} onOpenChange={setShowPixDialog}>
        <DialogContent
          className="sm:max-w-[380px]"
          style={{ backgroundColor: "#222222", border: `1px solid ${GOLD}`, borderRadius: "2px" }}
        >
          <DialogHeader>
            <DialogTitle
              className="font-serif italic font-light"
              style={{ fontSize: "1.6rem", color: BEGE }}
            >
              Pagamento
            </DialogTitle>
          </DialogHeader>
          <div className="py-5">
            <p
              className="font-sans font-light text-sm leading-relaxed"
              style={{ color: GOLD }}
            >
              Nosso time entrará em contato para processar seu pagamento de forma segura.
              Continue pelo WhatsApp para finalizar seu pedido.
            </p>
          </div>
          <DialogFooter>
            <button
              onClick={handleWhatsAppCheckout}
              className="w-full font-sans font-light transition-all"
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                backgroundColor: GOLD,
                color: DARK,
                border: `1px solid ${GOLD}`,
                padding: "0.85rem",
              }}
            >
              Continuar para WhatsApp
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

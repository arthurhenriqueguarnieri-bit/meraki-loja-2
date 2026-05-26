import React from "react";
import { Link } from "wouter";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity } = useStore();
  const [showPixDialog, setShowPixDialog] = React.useState(false);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleWhatsAppCheckout = () => {
    const phone = "5566999621253";
    let message = "Olá! Gostaria de finalizar meu pedido:\n\n";
    
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.productName} (Tam: ${item.size}) - ${formatCurrency(item.price * item.quantity)}\n`;
    });
    
    message += `\nTotal: ${formatCurrency(total)}`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <h1 className="font-serif italic text-4xl mb-6">Sua sacola está vazia</h1>
        <p className="text-muted-foreground mb-8">Descubra peças feitas para celebrar sua intimidade.</p>
        <Button asChild className="rounded-none uppercase text-xs tracking-wider px-8">
          <Link href="/">Continuar Comprando</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <h1 className="font-serif italic text-4xl mb-12">Sua Sacola</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item) => (
            <div key={`${item.productId}-${item.size}`} className="flex gap-4 md:gap-6 pb-8 border-b border-border/40">
              <div className="w-24 md:w-32 aspect-[4/5] bg-muted shrink-0">
                <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-base font-medium leading-tight mb-1">{item.productName}</h3>
                    <p className="text-sm text-muted-foreground mb-4">Tamanho: {item.size}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.productId, item.size)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-auto flex justify-between items-end">
                  <div className="flex items-center border border-border">
                    <button 
                      onClick={() => updateCartQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))}
                      className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.productId, item.size, item.quantity + 1)}
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-muted/30 p-6 border border-border/40 sticky top-28">
            <h2 className="font-serif text-2xl italic mb-6">Resumo</h2>
            
            <div className="space-y-4 text-sm mb-6 pb-6 border-b border-border/40">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-xs uppercase tracking-wider">A calcular</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end mb-8">
              <span className="font-medium">Total</span>
              <span className="text-xl font-medium">{formatCurrency(total)}</span>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={handleWhatsAppCheckout}
                className="w-full rounded-none uppercase text-xs tracking-wider h-12"
              >
                Finalizar pelo WhatsApp
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowPixDialog(true)}
                className="w-full rounded-none uppercase text-xs tracking-wider h-12 border-primary/20 hover:bg-muted"
              >
                Pagar via PIX ou Cartão
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showPixDialog} onOpenChange={setShowPixDialog}>
        <DialogContent className="sm:max-w-[400px] rounded-none">
          <DialogHeader>
            <DialogTitle className="font-serif italic text-2xl font-light">Pagamento</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Nosso time entrará em contato para processar seu pagamento de forma segura. 
              Continue pelo WhatsApp para finalizar seu pedido.
            </p>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleWhatsAppCheckout}
              className="w-full rounded-none uppercase text-xs tracking-wider h-12"
            >
              Continuar para WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

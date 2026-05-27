import React, { useState } from "react";
import { useStore, Product, CATEGORIES } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import merakiLogoBege from "@assets/meraki_logo_final_1779843613636.png";

const GOLD = "#C9B99A";
const BEGE = "#F5F0EB";
const DARK = "#1A1A1A";
const CARD_BG = "#222222";

export default function Home() {
  const products = useStore(state => state.products);
  const addToCart = useStore(state => state.addToCart);
  const activeCategory = useStore(state => state.activeCategory);
  const setActiveCategory = useStore(state => state.setActiveCategory);
  const { toast } = useToast();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const filteredProducts = activeCategory === "Todos"
    ? products
    : products.filter(p => p.category === activeCategory);

  const handleAddToCartClick = (product: Product) => {
    const availableSizes = product.sizes.filter(s => s.stock > 0);
    if (availableSizes.length === 0) {
      toast({ title: "Produto esgotado", description: "Este produto está sem estoque no momento." });
      return;
    }
    if (availableSizes.length === 1) {
      const effectivePrice = product.salePrice ?? product.price;
      addToCart({
        productId: product.id,
        productName: product.name,
        size: availableSizes[0].label,
        quantity: 1,
        price: effectivePrice,
        originalPrice: product.salePrice ? product.price : undefined,
        imageUrl: product.imageUrl,
      });
      toast({ title: "Adicionado ao carrinho", description: `${product.name} — Tam. ${availableSizes[0].label}` });
    } else {
      setSelectedProduct(product);
      setSelectedSize("");
    }
  };

  const confirmAddToCart = () => {
    if (!selectedProduct || !selectedSize) return;
    const effectivePrice = selectedProduct.salePrice ?? selectedProduct.price;
    addToCart({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      size: selectedSize,
      quantity: 1,
      price: effectivePrice,
      originalPrice: selectedProduct.salePrice ? selectedProduct.price : undefined,
      imageUrl: selectedProduct.imageUrl,
    });
    toast({ title: "Adicionado ao carrinho", description: `${selectedProduct.name} — Tam. ${selectedSize}` });
    setSelectedProduct(null);
  };

  return (
    <div className="flex flex-col">

      {/* ── HERO BANNER ── */}
      <section
        className="w-full relative"
        style={{
          height: "600px",
          backgroundImage: `url(${merakiLogoBege})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#111111",
        }}
      >
        {/* Overlay escuro para legibilidade do texto */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(17,17,17,0.75)" }}
        />
        {/* Texto posicionado absolutamente no banner */}
        <div
          style={{
            position: "absolute",
            top: "55%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: "80%",
          }}
        >
            <h1
              className="font-serif italic font-light leading-tight"
              style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", color: BEGE }}
            >
              O caimento perfeito existe.
            </h1>
            <p
              className="font-sans font-light mt-6"
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.22em",
                color: GOLD,
                lineHeight: 1.8,
                textTransform: "uppercase",
              }}
            >
              Ouse e sinta-se incrível! Lingeries para todas as ocasiões, vista-se com conforto.
            </p>
        </div>
      </section>


      {/* ── CATEGORY FILTERS ── */}
      <section id="colecao" className="py-12 md:py-14" style={{ backgroundColor: DARK }}>
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto pb-2 gap-6 md:gap-10 md:justify-center items-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                data-testid={`filter-${cat}`}
                onClick={() => setActiveCategory(cat)}
                className="whitespace-nowrap font-sans font-light transition-all pb-1 relative shrink-0"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: activeCategory === cat ? BEGE : GOLD,
                  opacity: activeCategory === cat ? 1 : 0.6,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                {cat}
                {activeCategory === cat && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ backgroundColor: GOLD }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section className="container mx-auto px-4 pb-24 pt-4">
        {filteredProducts.length === 0 ? (
          <div
            className="text-center py-20 font-sans font-light text-sm"
            style={{ color: GOLD, letterSpacing: "0.1em" }}
          >
            Nenhum produto encontrado nesta categoria.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => {
              const outOfStock = product.sizes.every(s => s.stock === 0);
              const onSale = !!product.salePrice && product.salePrice < product.price;
              return (
                <div
                  key={product.id}
                  data-testid={`card-product-${product.id}`}
                  className="flex flex-col group"
                  style={{ backgroundColor: CARD_BG, borderRadius: "2px" }}
                >
                  {/* Square image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Badges — PROMO takes priority over Esgotado */}
                    {onSale && (
                      <div
                        className="absolute top-2 left-2 font-sans font-light text-[9px] uppercase px-2 py-1"
                        style={{
                          letterSpacing: "0.2em",
                          backgroundColor: GOLD,
                          color: "#1A1A1A",
                        }}
                      >
                        PROMO
                      </div>
                    )}
                    {outOfStock && (
                      <div
                        className="absolute top-2 right-2 font-sans font-light text-[9px] uppercase px-2 py-1"
                        style={{
                          letterSpacing: "0.18em",
                          backgroundColor: "rgba(17,17,17,0.85)",
                          color: GOLD,
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        Esgotado
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col p-3 gap-1 flex-1">
                    <h3
                      className="font-sans font-light text-sm leading-snug"
                      style={{ color: BEGE }}
                    >
                      {product.name}
                    </h3>

                    {onSale ? (
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span
                          className="font-sans font-light text-sm"
                          style={{ color: GOLD }}
                        >
                          {formatCurrency(product.salePrice!)}
                        </span>
                        <span
                          className="font-sans font-light text-xs line-through"
                          style={{ color: "rgba(245,240,235,0.35)" }}
                        >
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    ) : (
                      <p
                        className="font-sans font-light text-sm mt-0.5"
                        style={{ color: GOLD }}
                      >
                        {formatCurrency(product.price)}
                      </p>
                    )}

                    <div className="mt-3">
                      <button
                        data-testid={`btn-add-cart-${product.id}`}
                        onClick={() => handleAddToCartClick(product)}
                        disabled={outOfStock}
                        className="w-full font-sans font-light transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          fontSize: "0.6rem",
                          letterSpacing: "0.25em",
                          textTransform: "uppercase",
                          color: outOfStock ? GOLD : DARK,
                          backgroundColor: outOfStock ? "transparent" : GOLD,
                          border: `1px solid ${GOLD}`,
                          padding: "0.55rem 0",
                          cursor: outOfStock ? "not-allowed" : "pointer",
                        }}
                        onMouseEnter={e => {
                          if (!outOfStock) {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = BEGE;
                            (e.currentTarget as HTMLButtonElement).style.borderColor = BEGE;
                          }
                        }}
                        onMouseLeave={e => {
                          if (!outOfStock) {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = GOLD;
                            (e.currentTarget as HTMLButtonElement).style.borderColor = GOLD;
                          }
                        }}
                      >
                        {outOfStock ? "Esgotado" : "Adicionar ao carrinho"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── SIZE SELECTOR DIALOG ── */}
      <Dialog open={!!selectedProduct} onOpenChange={open => !open && setSelectedProduct(null)}>
        <DialogContent
          className="sm:max-w-[380px]"
          style={{ backgroundColor: "#222222", border: `1px solid ${GOLD}`, borderRadius: "2px", color: BEGE }}
        >
          <DialogHeader>
            <DialogTitle
              className="font-serif italic font-light"
              style={{ fontSize: "1.6rem", color: BEGE }}
            >
              Escolha o tamanho
            </DialogTitle>
            <DialogDescription
              className="font-sans font-light"
              style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}
            >
              {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="flex flex-wrap gap-3 justify-center">
              {selectedProduct?.sizes.map(size => {
                const isOutOfStock = size.stock === 0;
                const isSelected = selectedSize === size.label;
                return (
                  <button
                    key={size.label}
                    disabled={isOutOfStock}
                    onClick={() => setSelectedSize(size.label)}
                    className="w-12 h-12 flex items-center justify-center font-sans font-light text-sm transition-all"
                    style={{
                      border: isSelected ? `1px solid ${GOLD}` : `1px solid rgba(201,185,154,0.3)`,
                      backgroundColor: isSelected ? GOLD : "transparent",
                      color: isSelected ? DARK : isOutOfStock ? "rgba(245,240,235,0.2)" : BEGE,
                      cursor: isOutOfStock ? "not-allowed" : "pointer",
                      opacity: isOutOfStock ? 0.35 : 1,
                    }}
                  >
                    {size.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={confirmAddToCart}
            disabled={!selectedSize}
            className="w-full font-sans font-light transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              backgroundColor: selectedSize ? GOLD : "transparent",
              color: selectedSize ? DARK : GOLD,
              border: `1px solid ${GOLD}`,
              padding: "0.85rem",
            }}
          >
            Confirmar e adicionar
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

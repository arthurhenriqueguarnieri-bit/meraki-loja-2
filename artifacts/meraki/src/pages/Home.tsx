import React, { useState } from "react";
import { useStore, Product } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const GOLD = "#C9B99A";
const BEGE = "#F5F0EB";
const DARK = "#1A1A1A";
const CARD_BG = "#222222";

const categories = ["Todos", "Calcinha", "Sutiã", "Conjunto", "Camisola", "Outros"] as const;
type Category = typeof categories[number];

export default function Home() {
  const products = useStore(state => state.products);
  const addToCart = useStore(state => state.addToCart);
  const { toast } = useToast();

  const [activeCategory, setActiveCategory] = useState<Category>("Todos");
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
      addToCart({
        productId: product.id,
        productName: product.name,
        size: availableSizes[0].label,
        quantity: 1,
        price: product.price,
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
    addToCart({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      size: selectedSize,
      quantity: 1,
      price: selectedProduct.price,
      imageUrl: selectedProduct.imageUrl,
    });
    toast({ title: "Adicionado ao carrinho", description: `${selectedProduct.name} — Tam. ${selectedSize}` });
    setSelectedProduct(null);
  };

  return (
    <div className="flex flex-col">

      {/* ── HERO BANNER — fundo preto sólido, sem foto ── */}
      <section
        className="w-full flex items-center justify-center py-28 md:py-40 px-6"
        style={{ backgroundColor: "#111111" }}
      >
        <div className="text-center max-w-3xl">
          <h1
            className="font-serif italic font-light leading-tight"
            style={{ fontSize: "clamp(2.6rem, 7vw, 5.5rem)", color: BEGE }}
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
            Descubra o poder da sua feminilidade com nossa moda íntima.
          </p>
          <div className="mt-10 flex justify-center">
            <a
              href="#colecao"
              className="font-sans font-light transition-all"
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: GOLD,
                border: `1px solid ${GOLD}`,
                padding: "0.75rem 2.5rem",
                display: "inline-block",
                opacity: 0.9,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = GOLD;
                (e.currentTarget as HTMLAnchorElement).style.color = DARK;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.color = GOLD;
              }}
            >
              Ver coleção
            </a>
          </div>
        </div>
      </section>

      {/* ── CATEGORY FILTERS ── */}
      <section id="colecao" className="py-12 md:py-14" style={{ backgroundColor: DARK }}>
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto pb-2 gap-6 md:gap-10 md:justify-center items-center">
            {categories.map(cat => (
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
                    <p
                      className="font-sans font-light text-sm mt-0.5"
                      style={{ color: GOLD }}
                    >
                      {formatCurrency(product.price)}
                    </p>

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

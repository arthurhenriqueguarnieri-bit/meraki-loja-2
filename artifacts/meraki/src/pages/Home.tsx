import React, { useState, useEffect } from "react";
import { useStore, Product } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronDown } from "lucide-react";
import merakiLogoBege from "@assets/meraki_logo_final_1779843613636.png";

const GOLD = "#C9B99A";
const BEGE = "#F5F0EB";
const DARK = "#1A1A1A";
const CARD_BG = "#222222";

const FAQ_ITEMS = [
  {
    question: "Como escolher meu tamanho?",
    answer: "Consulte nossa tabela de medidas disponível em cada produto. Em caso de dúvida, entre em contato pelo WhatsApp — nossa equipe te ajuda a encontrar o tamanho ideal.",
  },
  {
    question: "Como funciona a entrega?",
    answer: "Enviamos para todo o Brasil pelos Correios e transportadoras parceiras. O prazo e valor do frete são informados ao finalizar o pedido pelo WhatsApp.",
  },
  {
    question: "Posso trocar uma peça?",
    answer: "Sim! Aceitamos trocas em até 7 dias após o recebimento, desde que a peça esteja em perfeitas condições, com etiqueta e embalagem originais.",
  },
  {
    question: "Como cuidar das peças?",
    answer: "Recomendamos lavar à mão com sabão neutro em água fria. Não torcer, não usar alvejante. Secar à sombra para preservar o tecido e a elasticidade.",
  },
  {
    question: "Posso tirar dúvidas pelo WhatsApp?",
    answer: "Com certeza! Nossa equipe está disponível para ajudar com dúvidas sobre produtos, tamanhos, pedidos e entregas. Clique no botão do WhatsApp para falar conosco.",
  },
];

export default function Home() {
  const products = useStore(state => state.products);
  const addToCart = useStore(state => state.addToCart);
  const activeCategory = useStore(state => state.activeCategory);
  const { toast } = useToast();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

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

  const scrollToCollection = () => {
    document.getElementById("colecao")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col">

      {/* ── HERO BANNER ── */}
      <section
        className="w-full relative flex flex-col items-center"
        style={{ minHeight: "100svh", backgroundColor: "#111111", overflow: "hidden" }}
      >
        {/* Giant "Meraki" watermark — element artístico */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-2%",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(9rem, 35vw, 26rem)",
            color: BEGE,
            opacity: 0.05,
            whiteSpace: "nowrap",
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 1,
          }}
        >
          Meraki
        </div>

        {/* Logo/Sutiã — topo, totalmente visível, sem corte */}
        <div
          className="w-full flex justify-center"
          style={{
            paddingTop: "clamp(2.5rem, 6vw, 5rem)",
            position: "relative",
            zIndex: 2,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-12px)",
            transition: "opacity 1.2s ease, transform 1.2s ease",
          }}
        >
          <img
            src={merakiLogoBege}
            alt=""
            aria-hidden="true"
            style={{
              width: "min(440px, 78vw)",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        {/* Linha divisória */}
        <div
          style={{
            width: "40px",
            height: "1px",
            backgroundColor: GOLD,
            opacity: 0.4,
            marginTop: "clamp(1.2rem, 3vw, 2rem)",
            position: "relative",
            zIndex: 2,
          }}
        />

        {/* Conteúdo textual */}
        <div
          className="flex flex-col items-center text-center px-6 pb-20"
          style={{
            position: "relative",
            zIndex: 2,
            marginTop: "clamp(1.2rem, 3vw, 2rem)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 1.4s ease 0.25s, transform 1.4s ease 0.25s",
          }}
        >
          <h1
            className="font-serif italic font-light"
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              color: BEGE,
              lineHeight: 1.18,
              letterSpacing: "-0.01em",
              maxWidth: "860px",
            }}
          >
            O caimento perfeito existe.
          </h1>

          <p
            className="font-sans font-light mt-5"
            style={{
              fontSize: "0.67rem",
              letterSpacing: "0.28em",
              color: GOLD,
              lineHeight: 2,
              textTransform: "uppercase",
              maxWidth: "420px",
            }}
          >
            Ouse e sinta-se incrível! Lingeries para todas as ocasiões, vista-se com conforto.
          </p>

          {/* Botão VER COLEÇÃO */}
          <button
            onClick={scrollToCollection}
            className="font-sans font-light"
            style={{
              marginTop: "2.5rem",
              fontSize: "0.6rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: GOLD,
              backgroundColor: "transparent",
              border: `1px solid rgba(201,185,154,0.5)`,
              padding: "0.88rem 2.8rem",
              cursor: "pointer",
              transition: "all 0.35s ease",
            }}
            onMouseEnter={e => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.borderColor = GOLD;
              b.style.backgroundColor = "rgba(201,185,154,0.07)";
              b.style.letterSpacing = "0.42em";
            }}
            onMouseLeave={e => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.borderColor = "rgba(201,185,154,0.5)";
              b.style.backgroundColor = "transparent";
              b.style.letterSpacing = "0.38em";
            }}
          >
            Ver Coleção
          </button>

          {/* Seta de scroll */}
          <div className="meraki-bounce" style={{ marginTop: "1.8rem", opacity: 0.45 }}>
            <ChevronDown style={{ color: GOLD, width: 18, height: 18 }} strokeWidth={1} />
          </div>
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section id="colecao" className="container mx-auto px-4 pb-24 pt-12">
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
                  <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {onSale && (
                      <div
                        className="absolute top-2 left-2 font-sans font-light text-[9px] uppercase px-2 py-1"
                        style={{ letterSpacing: "0.2em", backgroundColor: GOLD, color: "#1A1A1A" }}
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

                  <div className="flex flex-col p-3 gap-1 flex-1">
                    <h3 className="font-sans font-light text-sm leading-snug" style={{ color: BEGE }}>
                      {product.name}
                    </h3>

                    {onSale ? (
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-sans font-light text-sm" style={{ color: GOLD }}>
                          {formatCurrency(product.salePrice!)}
                        </span>
                        <span className="font-sans font-light text-xs line-through" style={{ color: "rgba(245,240,235,0.35)" }}>
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    ) : (
                      <p className="font-sans font-light text-sm mt-0.5" style={{ color: GOLD }}>
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

      {/* ── SOBRE A MARCA ── */}
      <section
        className="w-full py-20 px-6"
        style={{ backgroundColor: "#0e0e0e" }}
      >
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
          <div style={{ width: 32, height: 1, backgroundColor: GOLD, opacity: 0.45, marginBottom: "2rem" }} />
          <span
            className="font-sans font-light uppercase"
            style={{ fontSize: "0.55rem", letterSpacing: "0.38em", color: GOLD, opacity: 0.7, marginBottom: "1.4rem" }}
          >
            Nossa história
          </span>
          <h2
            className="font-serif italic font-light"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: BEGE, lineHeight: 1.25, marginBottom: "1.6rem" }}
          >
            Feito com alma.
          </h2>
          <p
            className="font-sans font-light leading-relaxed"
            style={{ fontSize: "0.88rem", color: GOLD, opacity: 0.85, lineHeight: 1.9 }}
          >
            A Meraki Moda Íntima nasceu para unir conforto, delicadeza e elegância em peças que valorizam cada detalhe.
            Nossa proposta é oferecer lingeries escolhidas com carinho, pensadas para acompanhar diferentes momentos
            com leveza, beleza e confiança.
          </p>
          <div style={{ width: 32, height: 1, backgroundColor: GOLD, opacity: 0.45, marginTop: "2rem" }} />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="w-full py-20 px-6" style={{ backgroundColor: DARK }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <span
              className="font-sans font-light uppercase"
              style={{ fontSize: "0.55rem", letterSpacing: "0.38em", color: GOLD, opacity: 0.7, marginBottom: "1rem" }}
            >
              Dúvidas frequentes
            </span>
            <h2
              className="font-serif italic font-light"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: BEGE, lineHeight: 1.25 }}
            >
              Podemos ajudar?
            </h2>
          </div>

          <div className="flex flex-col" style={{ borderTop: `1px solid rgba(201,185,154,0.15)` }}>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} style={{ borderBottom: `1px solid rgba(201,185,154,0.15)` }}>
                <button
                  className="w-full flex items-center justify-between py-5 text-left font-sans font-light transition-opacity hover:opacity-100"
                  style={{ background: "none", border: "none", cursor: "pointer", opacity: openFaq === i ? 1 : 0.8 }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span style={{ fontSize: "0.8rem", color: BEGE, letterSpacing: "0.04em" }}>
                    {item.question}
                  </span>
                  <ChevronDown
                    style={{
                      color: GOLD,
                      width: 16,
                      height: 16,
                      flexShrink: 0,
                      marginLeft: "1rem",
                      transition: "transform 0.3s ease",
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                    strokeWidth={1.5}
                  />
                </button>
                <div
                  style={{
                    maxHeight: openFaq === i ? "200px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.35s ease",
                  }}
                >
                  <p
                    className="font-sans font-light pb-5"
                    style={{ fontSize: "0.82rem", color: GOLD, lineHeight: 1.85, opacity: 0.85 }}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIZE SELECTOR DIALOG ── */}
      <Dialog open={!!selectedProduct} onOpenChange={open => !open && setSelectedProduct(null)}>
        <DialogContent
          className="sm:max-w-[380px]"
          style={{ backgroundColor: "#222222", border: `1px solid ${GOLD}`, borderRadius: "2px", color: BEGE }}
        >
          <DialogHeader>
            <DialogTitle className="font-serif italic font-light" style={{ fontSize: "1.6rem", color: BEGE }}>
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

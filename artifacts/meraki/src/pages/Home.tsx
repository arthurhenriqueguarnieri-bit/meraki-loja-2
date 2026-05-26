import React, { useState } from "react";
import { useStore, Product } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
      toast({ title: "Produto esgotado", description: "Infelizmente este produto está sem estoque." });
      return;
    }
    
    if (availableSizes.length === 1) {
      // Direct add
      addToCart({
        productId: product.id,
        productName: product.name,
        size: availableSizes[0].label,
        quantity: 1,
        price: product.price,
        imageUrl: product.imageUrl
      });
      toast({
        title: "Adicionado",
        description: `${product.name} (Tamanho ${availableSizes[0].label}) adicionado ao carrinho.`,
      });
    } else {
      // Open dialog
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
      imageUrl: selectedProduct.imageUrl
    });
    
    toast({
      title: "Adicionado",
      description: `${selectedProduct.name} (Tamanho ${selectedSize}) adicionado ao carrinho.`,
    });
    
    setSelectedProduct(null);
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#E8E1DA]">
           <img 
             src="https://picsum.photos/1200/800?random=10" 
             alt="Hero" 
             className="w-full h-full object-cover opacity-60 mix-blend-multiply"
           />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif italic text-5xl md:text-7xl lg:text-8xl text-primary font-light">
            Vista o que<br/>você sente.
          </h1>
          <p className="mt-6 text-sm md:text-base uppercase tracking-[0.2em] font-medium text-primary/80">
            A intimidade de ser você
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex overflow-x-auto pb-4 -mb-4 hide-scrollbar gap-8 md:justify-center items-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap text-sm uppercase tracking-widest transition-all pb-1 border-b-2 ${
                activeCategory === cat 
                  ? "border-primary font-medium opacity-100" 
                  : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 pb-24">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            Nenhum produto encontrado nesta categoria.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
            {filteredProducts.map(product => {
              const outOfStock = product.sizes.every(s => s.stock === 0);
              
              return (
                <div key={product.id} className="flex flex-col group cursor-pointer">
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted mb-4">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {outOfStock && (
                      <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm text-foreground text-[10px] uppercase tracking-wider px-2 py-1">
                        Esgotado
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-sm font-medium leading-snug mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{formatCurrency(product.price)}</p>
                    
                    <div className="mt-auto">
                      <Button 
                        onClick={() => handleAddToCartClick(product)}
                        disabled={outOfStock}
                        variant="default"
                        className="w-full rounded-none uppercase text-xs tracking-wider h-10 font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {outOfStock ? "Esgotado" : "Adicionar ao Carrinho"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Size Selector Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-none border-border/40">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-light italic">Escolha o tamanho</DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-widest pt-2">
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
                    className={`
                      w-12 h-12 flex flex-col items-center justify-center border transition-all
                      ${isOutOfStock ? "opacity-30 cursor-not-allowed bg-muted border-transparent" : "cursor-pointer"}
                      ${isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"}
                    `}
                  >
                    <span className="text-sm font-medium">{size.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <Button 
            onClick={confirmAddToCart}
            disabled={!selectedSize}
            className="w-full rounded-none uppercase text-xs tracking-wider h-12"
          >
            Confirmar e Adicionar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

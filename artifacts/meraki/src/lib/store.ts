import { create } from 'zustand';

export type Size = { label: string; stock: number };

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: "Sutiã" | "Calcinha" | "Top" | "Conjunto" | "Body" | "Camisola" | "Baby Doll" | "Biquíni";
  imageUrl: string;
  sizes: Size[];
  createdAt: number;
};

export type CartItem = {
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  originalPrice?: number;
  price: number;
  imageUrl: string;
};

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Conjunto Rendado Aurora",
    description: "Um conjunto delicado e romântico, feito em renda chantilly com detalhes em strappy. Sutiã sem bojo com aro para sustentação natural.",
    price: 149.90,
    category: "Conjunto",
    imageUrl: "https://picsum.photos/400/500?random=1",
    sizes: [{ label: "P", stock: 2 }, { label: "M", stock: 5 }, { label: "G", stock: 0 }],
    createdAt: Date.now()
  },
  {
    id: "2",
    name: "Sutiã Meia Taça Essencial",
    description: "Conforto para o dia a dia. Sutiã liso em microfibra leve, aro e bojo suave para desenhar o colo com perfeição.",
    price: 89.90,
    category: "Sutiã",
    imageUrl: "https://picsum.photos/400/500?random=2",
    sizes: [{ label: "M", stock: 10 }, { label: "G", stock: 8 }, { label: "GG", stock: 4 }],
    createdAt: Date.now() - 1000
  },
  {
    id: "3",
    name: "Calcinha Fio Duplo Seda",
    description: "Peça invisível sob a roupa. Modelagem anatômica que valoriza as curvas sem marcar.",
    price: 39.90,
    category: "Calcinha",
    imageUrl: "https://picsum.photos/400/500?random=3",
    sizes: [{ label: "P", stock: 15 }, { label: "M", stock: 20 }, { label: "G", stock: 12 }],
    createdAt: Date.now() - 2000
  },
  {
    id: "4",
    name: "Camisola Longa Cetim",
    description: "Elegância fluida. Camisola em cetim toque de seda com fenda lateral e decote em V.",
    price: 229.90,
    category: "Camisola",
    imageUrl: "https://picsum.photos/400/500?random=4",
    sizes: [{ label: "P", stock: 3 }, { label: "M", stock: 2 }],
    createdAt: Date.now() - 3000
  },
  {
    id: "5",
    name: "Body Renda Floral",
    description: "Versatilidade e sensualidade. Body todo em renda floral exclusiva, sem bojo, ideal para compor looks outwear.",
    price: 179.90,
    category: "Body",
    imageUrl: "https://picsum.photos/400/500?random=5",
    sizes: [{ label: "P", stock: 0 }, { label: "M", stock: 5 }, { label: "G", stock: 3 }],
    createdAt: Date.now() - 4000
  },
  {
    id: "6",
    name: "Conjunto Tule Mystique",
    description: "Mistério e transparência. Sutiã triângulo e calcinha asa delta em tule macio com bordados sutis.",
    price: 139.90,
    category: "Conjunto",
    imageUrl: "https://picsum.photos/400/500?random=6",
    sizes: [{ label: "P", stock: 4 }, { label: "M", stock: 6 }, { label: "G", stock: 6 }],
    createdAt: Date.now() - 5000
  }
];

export const CATEGORIES = ["Todos", "Sutiã", "Calcinha", "Top", "Conjunto", "Body", "Camisola", "Baby Doll", "Biquíni"] as const;
export type Category = typeof CATEGORIES[number];

type StoreState = {
  products: Product[];
  cart: CartItem[];
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
};

const getInitialProducts = () => {
  const stored = localStorage.getItem('meraki_products');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('meraki_products', JSON.stringify(initialProducts));
  return initialProducts;
};

const getInitialCart = () => {
  const stored = localStorage.getItem('meraki_cart');
  if (stored) return JSON.parse(stored);
  return [];
};

export const useStore = create<StoreState>((set) => ({
  products: getInitialProducts(),
  cart: getInitialCart(),
  activeCategory: "Todos",
  setActiveCategory: (category) => set({ activeCategory: category }),
  
  addToCart: (item) => set((state) => {
    const existing = state.cart.find(c => c.productId === item.productId && c.size === item.size);
    let newCart;
    if (existing) {
      newCart = state.cart.map(c => 
        (c.productId === item.productId && c.size === item.size) 
          ? { ...c, quantity: c.quantity + item.quantity } 
          : c
      );
    } else {
      newCart = [...state.cart, item];
    }
    localStorage.setItem('meraki_cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),

  removeFromCart: (productId, size) => set((state) => {
    const newCart = state.cart.filter(c => !(c.productId === productId && c.size === size));
    localStorage.setItem('meraki_cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),

  updateCartQuantity: (productId, size, quantity) => set((state) => {
    const newCart = state.cart.map(c => 
      (c.productId === productId && c.size === size) 
        ? { ...c, quantity } 
        : c
    );
    localStorage.setItem('meraki_cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),

  clearCart: () => set(() => {
    localStorage.setItem('meraki_cart', JSON.stringify([]));
    return { cart: [] };
  }),

  addProduct: (product) => set((state) => {
    const newProducts = [product, ...state.products];
    localStorage.setItem('meraki_products', JSON.stringify(newProducts));
    return { products: newProducts };
  }),

  updateProduct: (product) => set((state) => {
    const newProducts = state.products.map(p => p.id === product.id ? product : p);
    localStorage.setItem('meraki_products', JSON.stringify(newProducts));
    return { products: newProducts };
  }),

  deleteProduct: (id) => set((state) => {
    const newProducts = state.products.filter(p => p.id !== id);
    localStorage.setItem('meraki_products', JSON.stringify(newProducts));
    return { products: newProducts };
  }),
}));

import React, { useState } from "react";
import { useStore, Product, Size } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("meraki_admin_auth") === "true";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: "Conjunto",
    imageUrl: "",
    sizes: [{ label: "P", stock: 0 }, { label: "M", stock: 0 }, { label: "G", stock: 0 }]
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "meraki2024") {
      sessionStorage.setItem("meraki_admin_auth", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Senha incorreta");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "Conjunto",
      imageUrl: "",
      sizes: [{ label: "P", stock: 0 }, { label: "M", stock: 0 }, { label: "G", stock: 0 }]
    });
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddSize = () => {
    if (!formData.sizes) return;
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { label: "", stock: 0 }]
    });
  };

  const handleRemoveSize = (index: number) => {
    if (!formData.sizes) return;
    const newSizes = [...formData.sizes];
    newSizes.splice(index, 1);
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleSizeChange = (index: number, field: keyof Size, value: string | number) => {
    if (!formData.sizes) return;
    const newSizes = [...formData.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.imageUrl || !formData.category) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios.", variant: "destructive" });
      return;
    }

    const productToSave = {
      ...formData,
      id: editingId || Date.now().toString(),
      createdAt: editingId ? (formData as Product).createdAt : Date.now(),
      sizes: formData.sizes?.filter(s => s.label.trim() !== "") || []
    } as Product;

    if (editingId) {
      updateProduct(productToSave);
      toast({ title: "Sucesso", description: "Produto atualizado." });
    } else {
      addProduct(productToSave);
      toast({ title: "Sucesso", description: "Produto cadastrado." });
    }

    resetForm();
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[70vh]">
        <div className="max-w-sm w-full bg-muted/30 p-8 border border-border/40 text-center">
          <h1 className="font-serif italic text-3xl mb-8">Administração</h1>
          <form onSubmit={handleLogin} className="space-y-6 text-left">
            <div className="space-y-2">
              <Label htmlFor="password">Senha de acesso</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-none focus-visible:ring-1 focus-visible:ring-primary"
              />
              {error && <p className="text-sm text-destructive mt-1">{error}</p>}
            </div>
            <Button type="submit" className="w-full rounded-none uppercase tracking-wider text-xs h-12">
              Entrar
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex justify-between items-center mb-12 border-b border-border/40 pb-6">
        <h1 className="font-serif italic text-4xl">Painel de Controle</h1>
        <Button 
          variant="outline" 
          onClick={() => {
            sessionStorage.removeItem("meraki_admin_auth");
            setIsAuthenticated(false);
          }}
          className="rounded-none uppercase tracking-wider text-xs h-10 border-primary/20"
        >
          Sair
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form */}
        <div className="lg:col-span-5 bg-muted/20 p-6 md:p-8 border border-border/40 self-start">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl italic">{editingId ? "Editar Produto" : "Novo Produto"}</h2>
            {editingId && (
              <Button variant="ghost" size="sm" onClick={resetForm} className="text-xs uppercase tracking-wider rounded-none">
                Cancelar Edição
              </Button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Nome do Produto</Label>
              <Input 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="rounded-none bg-background"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preço (R$)</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={formData.price || ""} 
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  className="rounded-none bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(v: any) => setFormData({...formData, category: v})}
                >
                  <SelectTrigger className="rounded-none bg-background">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="Calcinha">Calcinha</SelectItem>
                    <SelectItem value="Sutiã">Sutiã</SelectItem>
                    <SelectItem value="Conjunto">Conjunto</SelectItem>
                    <SelectItem value="Camisola">Camisola</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>URL da Imagem</Label>
              <Input 
                value={formData.imageUrl} 
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                className="rounded-none bg-background"
                placeholder="https://..."
                required
              />
              {formData.imageUrl && (
                <div className="mt-2 w-20 h-24 bg-muted border border-border/40">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="rounded-none bg-background min-h-[100px] resize-y"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-border/40">
              <div className="flex justify-between items-center">
                <Label>Tamanhos e Estoque</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddSize} className="rounded-none h-8 px-2 text-xs">
                  <Plus className="w-3 h-3 mr-1" /> Adicionar
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.sizes?.map((size, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Input 
                      placeholder="Tam (Ex: P, M, 42)" 
                      value={size.label} 
                      onChange={e => handleSizeChange(index, 'label', e.target.value)}
                      className="rounded-none bg-background w-1/2"
                    />
                    <Input 
                      type="number" 
                      min="0"
                      placeholder="Qtd" 
                      value={size.stock === 0 && size.label === "" ? "" : size.stock} 
                      onChange={e => handleSizeChange(index, 'stock', parseInt(e.target.value) || 0)}
                      className="rounded-none bg-background w-1/3"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveSize(index)}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {formData.sizes?.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">Nenhum tamanho adicionado.</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full rounded-none uppercase tracking-wider text-xs h-12 mt-8">
              {editingId ? "Salvar Alterações" : "Cadastrar Produto"}
            </Button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-7">
          <h2 className="font-serif text-2xl italic mb-6">Produtos Cadastrados ({products.length})</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map(product => (
              <div key={product.id} className="border border-border/40 bg-card p-4 flex gap-4">
                <div className="w-20 aspect-[4/5] shrink-0 bg-muted">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col min-w-0">
                  <h3 className="font-medium text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                  <p className="text-sm font-medium mt-2">{formatCurrency(product.price)}</p>
                  
                  <div className="flex gap-2 mt-auto pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(product)}
                      className="rounded-none text-xs flex-1 h-8"
                    >
                      <Edit className="w-3 h-3 mr-1" /> Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        if(confirm("Tem certeza que deseja excluir?")) {
                          deleteProduct(product.id);
                        }
                      }}
                      className="rounded-none text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground h-8 border-destructive/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useStore, Product, Size } from "@/lib/store";
import { Trash2, Edit, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

const GOLD = "#C9B99A";
const BEGE = "#F5F0EB";
const DARK = "#1A1A1A";
const CARD_BG = "#222222";
const SURFACE = "#1E1E1E";

const inputStyle: React.CSSProperties = {
  backgroundColor: "#1A1A1A",
  border: "1px solid rgba(201,185,154,0.25)",
  color: BEGE,
  padding: "0.55rem 0.75rem",
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 300,
  fontSize: "0.82rem",
  width: "100%",
  outline: "none",
  borderRadius: "1px",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 300,
  fontSize: "0.6rem",
  letterSpacing: "0.22em",
  textTransform: "uppercase" as const,
  color: GOLD,
  display: "block",
  marginBottom: "0.35rem",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    sessionStorage.getItem("meraki_admin_auth") === "true"
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    salePrice: undefined,
    category: "Sutiã",
    imageUrl: "",
    sizes: [{ label: "P", stock: 0 }, { label: "M", stock: 0 }, { label: "G", stock: 0 }],
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "meraki2024") {
      sessionStorage.setItem("meraki_admin_auth", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Senha incorreta.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      salePrice: undefined,
      category: "Conjunto",
      imageUrl: "",
      sizes: [{ label: "P", stock: 0 }, { label: "M", stock: 0 }, { label: "G", stock: 0 }],
    });
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddSize = () => {
    if (!formData.sizes) return;
    setFormData({ ...formData, sizes: [...formData.sizes, { label: "", stock: 0 }] });
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
      toast({ title: "Campos obrigatórios", description: "Preencha todos os campos obrigatórios.", variant: "destructive" });
      return;
    }
    const productToSave = {
      ...formData,
      id: editingId || Date.now().toString(),
      createdAt: editingId ? (formData as Product).createdAt : Date.now(),
      sizes: formData.sizes?.filter(s => s.label.trim() !== "") || [],
    } as Product;

    if (editingId) {
      updateProduct(productToSave);
      toast({ title: "Produto atualizado." });
    } else {
      addProduct(productToSave);
      toast({ title: "Produto cadastrado." });
    }
    resetForm();
  };

  /* ── LOGIN ── */
  if (!isAuthenticated) {
    return (
      <div
        className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[70vh]"
        data-testid="admin-login"
      >
        <div
          className="w-full max-w-sm p-10 text-center"
          style={{ backgroundColor: CARD_BG, border: `1px solid rgba(201,185,154,0.2)` }}
        >
          <h1
            className="font-serif italic font-light mb-10"
            style={{ fontSize: "2rem", color: BEGE }}
          >
            Administração
          </h1>
          <form onSubmit={handleLogin} className="text-left space-y-5">
            <Field label="Senha de acesso">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle}
                data-testid="input-admin-password"
              />
              {error && (
                <p
                  className="mt-2 font-sans font-light text-xs"
                  style={{ color: "#e05252", letterSpacing: "0.05em" }}
                >
                  {error}
                </p>
              )}
            </Field>
            <button
              type="submit"
              className="w-full font-sans font-light transition-all mt-4"
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                backgroundColor: GOLD,
                color: DARK,
                border: `1px solid ${GOLD}`,
                padding: "0.85rem",
              }}
              data-testid="btn-admin-login"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ── PANEL ── */
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl" data-testid="admin-panel">
      <div
        className="flex justify-between items-center mb-12 pb-5"
        style={{ borderBottom: `1px solid rgba(201,185,154,0.2)` }}
      >
        <h1
          className="font-serif italic font-light"
          style={{ fontSize: "2rem", color: BEGE }}
        >
          Painel de Controle
        </h1>
        <button
          onClick={() => { sessionStorage.removeItem("meraki_admin_auth"); setIsAuthenticated(false); }}
          className="font-sans font-light transition-all"
          style={{
            fontSize: "0.58rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: GOLD,
            backgroundColor: "transparent",
            border: `1px solid rgba(201,185,154,0.35)`,
            padding: "0.5rem 1.2rem",
          }}
          data-testid="btn-admin-logout"
        >
          Sair
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* ── FORM ── */}
        <div
          className="lg:col-span-5 self-start p-6 md:p-8"
          style={{ backgroundColor: SURFACE, border: `1px solid rgba(201,185,154,0.15)` }}
        >
          <div className="flex justify-between items-center mb-7">
            <h2
              className="font-serif italic font-light"
              style={{ fontSize: "1.4rem", color: BEGE }}
            >
              {editingId ? "Editar Produto" : "Novo Produto"}
            </h2>
            {editingId && (
              <button
                onClick={resetForm}
                className="font-sans font-light transition-opacity hover:opacity-100"
                style={{
                  fontSize: "0.58rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: GOLD,
                  opacity: 0.6,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Nome do produto *">
              <input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={inputStyle}
                required
                data-testid="input-product-name"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Preço (R$) *">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price || ""}
                  onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  style={inputStyle}
                  required
                  data-testid="input-product-price"
                />
              </Field>
              <Field label="Preço promo (R$)">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Opcional"
                  value={formData.salePrice || ""}
                  onChange={e => {
                    const v = parseFloat(e.target.value);
                    setFormData({ ...formData, salePrice: isNaN(v) || e.target.value === "" ? undefined : v });
                  }}
                  style={{ ...inputStyle, borderColor: formData.salePrice ? GOLD : "rgba(201,185,154,0.25)" }}
                  data-testid="input-product-sale-price"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Categoria *">
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as Product["category"] })}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  data-testid="select-product-category"
                >
                  <option value="Sutiã">Sutiã</option>
                  <option value="Calcinha">Calcinha</option>
                  <option value="Top">Top</option>
                  <option value="Conjunto">Conjunto</option>
                  <option value="Body">Body</option>
                  <option value="Camisola">Camisola</option>
                  <option value="Baby Doll">Baby Doll</option>
                  <option value="Biquíni">Biquíni</option>
                </select>
              </Field>
            </div>

            <Field label="URL da imagem *">
              <input
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                style={inputStyle}
                placeholder="https://..."
                required
                data-testid="input-product-image"
              />
              {formData.imageUrl && (
                <div
                  className="mt-2"
                  style={{ width: "4rem", aspectRatio: "1/1", backgroundColor: DARK }}
                >
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={e => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                  />
                </div>
              )}
            </Field>

            <Field label="Descrição">
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                data-testid="input-product-description"
              />
            </Field>

            <div
              className="space-y-4 pt-4"
              style={{ borderTop: `1px solid rgba(201,185,154,0.15)` }}
            >
              <div className="flex justify-between items-center">
                <label style={labelStyle}>Tamanhos e estoque</label>
                <button
                  type="button"
                  onClick={handleAddSize}
                  className="flex items-center gap-1 font-sans font-light transition-opacity hover:opacity-100"
                  style={{
                    fontSize: "0.58rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: GOLD,
                    opacity: 0.7,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  data-testid="btn-add-size"
                >
                  <Plus className="w-3 h-3" /> Adicionar
                </button>
              </div>

              <div className="space-y-2">
                {formData.sizes?.map((size, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      placeholder="Tam. (P, M, 42...)"
                      value={size.label}
                      onChange={e => handleSizeChange(index, "label", e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Qtd"
                      value={size.stock === 0 && size.label === "" ? "" : size.stock}
                      onChange={e => handleSizeChange(index, "stock", parseInt(e.target.value) || 0)}
                      style={{ ...inputStyle, width: "5rem", flex: "none" }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(index)}
                      className="p-1 transition-opacity hover:opacity-100"
                      style={{ color: GOLD, opacity: 0.4, background: "none", border: "none", cursor: "pointer" }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {formData.sizes?.length === 0 && (
                  <p
                    className="font-sans font-light text-xs italic"
                    style={{ color: GOLD, opacity: 0.5 }}
                  >
                    Nenhum tamanho adicionado.
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full font-sans font-light transition-all mt-6"
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                backgroundColor: GOLD,
                color: DARK,
                border: `1px solid ${GOLD}`,
                padding: "0.9rem",
              }}
              data-testid="btn-submit-product"
            >
              {editingId ? "Salvar Alterações" : "Cadastrar Produto"}
            </button>
          </form>
        </div>

        {/* ── PRODUCT LIST ── */}
        <div className="lg:col-span-7">
          <h2
            className="font-serif italic font-light mb-6"
            style={{ fontSize: "1.4rem", color: BEGE }}
          >
            Produtos Cadastrados{" "}
            <span style={{ color: GOLD, fontSize: "1rem" }}>({products.length})</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map(product => (
              <div
                key={product.id}
                data-testid={`admin-product-${product.id}`}
                className="flex gap-3 p-3"
                style={{ backgroundColor: CARD_BG, border: `1px solid rgba(201,185,154,0.15)` }}
              >
                <div
                  className="shrink-0"
                  style={{ width: "4.5rem", aspectRatio: "1/1", backgroundColor: DARK }}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col min-w-0">
                  <h3
                    className="font-sans font-light text-sm leading-tight truncate"
                    style={{ color: BEGE }}
                  >
                    {product.name}
                  </h3>
                  <p
                    className="font-sans font-light"
                    style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, opacity: 0.7, marginTop: "0.15rem" }}
                  >
                    {product.category}
                  </p>
                  <p
                    className="font-sans font-light text-sm mt-1"
                    style={{ color: GOLD }}
                  >
                    {formatCurrency(product.price)}
                  </p>

                  <div className="flex gap-2 mt-auto pt-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex items-center gap-1 font-sans font-light transition-all flex-1 justify-center"
                      style={{
                        fontSize: "0.58rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: BEGE,
                        backgroundColor: "transparent",
                        border: `1px solid rgba(201,185,154,0.3)`,
                        padding: "0.4rem",
                      }}
                      data-testid={`btn-edit-${product.id}`}
                    >
                      <Edit className="w-2.5 h-2.5" /> Editar
                    </button>
                    <button
                      onClick={() => { if (confirm("Excluir este produto?")) deleteProduct(product.id); }}
                      className="flex items-center justify-center transition-opacity hover:opacity-100"
                      style={{
                        color: "#e05252",
                        opacity: 0.6,
                        backgroundColor: "transparent",
                        border: `1px solid rgba(224,82,82,0.3)`,
                        padding: "0.4rem 0.6rem",
                      }}
                      data-testid={`btn-delete-${product.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
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

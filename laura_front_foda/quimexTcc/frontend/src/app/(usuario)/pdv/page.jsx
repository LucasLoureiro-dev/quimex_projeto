"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  Plus,
  Minus,
} from "lucide-react";

// Lista de produtos químicos
const chemicalProducts = [
  {
    id: "1",
    code: "QMX-001",
    name: "Ácido Sulfúrico 98%",
    price: 45.9,
    category: "Ácidos",
    image: "/sulfuric-acid-bottle.jpg",
  },
  {
    id: "2",
    code: "QMX-002",
    name: "Hidróxido de Sódio",
    price: 32.5,
    category: "Bases",
    image: "/sodium-hydroxide-bottle.jpg",
  },
  {
    id: "3",
    code: "QMX-003",
    name: "Álcool Etílico 99.5%",
    price: 28.9,
    category: "Solventes",
    image: "/ethanol-bottle.jpg",
  },
  {
    id: "4",
    code: "QMX-004",
    name: "Acetona PA",
    price: 35.0,
    category: "Solventes",
    image: "/acetone-bottle.jpg",
  },
  {
    id: "5",
    code: "QMX-005",
    name: "Cloreto de Sódio",
    price: 15.9,
    category: "Sais",
    image: "/sodium-chloride-bottle.jpg",
  },
  {
    id: "6",
    code: "QMX-006",
    name: "Peróxido de Hidrogênio",
    price: 22.5,
    category: "Oxidantes",
    image: "/hydrogen-peroxide-bottle.jpg",
  },
  {
    id: "7",
    code: "QMX-007",
    name: "Ácido Clorídrico 37%",
    price: 38.9,
    category: "Ácidos",
    image: "/hydrochloric-acid-bottle.jpg",
  },
  {
    id: "8",
    code: "QMX-008",
    name: "Carbonato de Cálcio",
    price: 18.5,
    category: "Sais",
    image: "/calcium-carbonate-bottle.jpg",
  },
];

const categories = ["Todos", "Ácidos", "Bases", "Solventes", "Sais", "Oxidantes"];

export default function QuimexPOS() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showPayment, setShowPayment] = useState(false);

  const filteredProducts = chemicalProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const turnoId = sessionStorage.getItem("turnoId");

  if (!turnoId) {
    router.push("/loginVendedor");
  }


  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, change) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = async (method) => {
    const turnoId = sessionStorage.getItem("turnoId");
    const operador = localStorage.getItem("usuarioLogado");
  
    await fetch("/api/vendas/criar", {
      method: "POST",
      body: JSON.stringify({
        turnoId,
        operador,
        metodoPagamento: method,
        itens: cart.map(item => ({
          nome: item.name,
          quantidade: item.quantity,
          preco: item.price
        })),
      }),
    });
  
    alert("Venda registrada no banco!");
    setCart([]);
    setShowPayment(false);
  };
  


  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">QUIMEX</h1>
              <p className="text-sm text-muted-foreground">
                Sistema de Caixa - Produtos Químicos
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Operador</p>
                <p className="text-sm font-medium">
                  {localStorage.getItem("usuarioLogado") || "Operador"}
                </p>

                <p className="text-xs text-muted-foreground">
                  Valor inicial: R$ {localStorage.getItem("caixaAbertura") || "0,00"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nome ou código do produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </header>

        {/* Filtro */}
        <div className="px-6 py-3 border-b border-border bg-card/50">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground mr-2">
              Filtrar:
            </span>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Produtos */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-card border border-border rounded-lg p-4 hover:border-primary hover:shadow-lg transition-all text-left"
              >
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-32 object-contain mb-3 rounded"
                />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-mono">
                    {product.code}
                  </p>
                  <h3 className="font-semibold text-sm text-foreground leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {product.category}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    R$ {product.price.toFixed(2)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Carrinho */}
      <div className="w-[450px] border-l border-border bg-card flex flex-col">
        <div className="flex-1 overflow-auto p-4">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Carrinho de Compras
          </h2>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <p className="text-sm">Nenhum item no carrinho</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="bg-background border border-border rounded-lg p-3">
                  <div className="flex gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-mono">{item.code}</p>
                      <h3 className="font-semibold text-sm text-foreground leading-tight">{item.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="h-7 w-7 flex items-center justify-center rounded-md bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="font-bold text-sm text-foreground min-w-[3ch] text-center">
                            {item.quantity}x
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-7 w-7 flex items-center justify-center rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-primary">R$ {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="h-8 w-8 flex items-center justify-center rounded-md bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total e pagamento */}
        <div className="border-t border-border p-4 bg-muted/30">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-foreground">Total:</span>
            <span className="text-2xl font-bold text-primary">R$ {total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => setShowPayment(true)}
            disabled={cart.length === 0}
            className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Finalizar Venda
          </button>
        </div>
      </div>

      {/* Modal de pagamento */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Forma de Pagamento</h2>
              <button
                onClick={() => setShowPayment(false)}
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total a pagar:</p>
              <p className="text-3xl font-bold text-primary">R$ {total.toFixed(2)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handlePayment("Débito")}
                className="flex flex-col items-center gap-3 p-6 bg-background border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
              >
                <CreditCard className="h-10 w-10 text-primary" />
                <span className="font-semibold text-foreground">Débito</span>
              </button>

              <button
                onClick={() => handlePayment("Crédito")}
                className="flex flex-col items-center gap-3 p-6 bg-background border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
              >
                <CreditCard className="h-10 w-10 text-primary" />
                <span className="font-semibold text-foreground">Crédito</span>
              </button>

              <button
                onClick={() => handlePayment("Dinheiro")}
                className="flex flex-col items-center gap-3 p-6 bg-background border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Banknote className="h-10 w-10 text-primary" />
                <span className="font-semibold text-foreground">Dinheiro</span>
              </button>

              <button
                onClick={() => handlePayment("PIX")}
                className="flex flex-col items-center gap-3 p-6 bg-background border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Smartphone className="h-10 w-10 text-primary" />
                <span className="font-semibold text-foreground">PIX</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

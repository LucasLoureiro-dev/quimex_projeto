"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/auth-context";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// "../../../components/ui/button";
import {
  Search,
  Filter,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  Plus,
  Minus,
  Hexagon,
  LogOut,
  FlaskConical,
  Palette,
  Check,
} from "lucide-react";
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : { r: 255, g: 255, b: 255 };
};

const rgbToHex = (r, g, b) => {
  const toHex = (c) => {
    const hex = Math.max(0, Math.min(255, Number(c))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
};

const PaintMixerModal = ({ onClose, onConfirm }) => {
  const [color, setColor] = useState("#117540"); // Começa com o verde Quimex
  const [rgb, setRgb] = useState({ r: 17, g: 117, b: 64 });

  const handleHexChange = (e) => {
    const newHex = e.target.value;
    setColor(newHex);
    setRgb(hexToRgb(newHex));
  };

  const handleRgbChange = (key, value) => {
    const newRgb = { ...rgb, [key]: parseInt(value) || 0 };
    setRgb(newRgb);
    setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row">
        {/* Lado Esquerdo: Visualização do Balde */}
        <div className="w-full md:w-1/2 bg-gray-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Palette className="w-5 h-5" /> Visualização do Produto
          </h3>

          <div className="relative group">
            {/* SVG do Balde com cor dinâmica */}
            <svg
              width="240"
              height="240"
              viewBox="0 0 200 220"
              className="drop-shadow-xl transition-transform duration-300 hover:scale-105"
            >
              <defs>
                <linearGradient id="canMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d1d5db" />
                  <stop offset="20%" stopColor="#f3f4f6" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="80%" stopColor="#d1d5db" />
                  <stop offset="100%" stopColor="#9ca3af" />
                </linearGradient>
              </defs>
              <path
                d="M 20 60 C 20 20, 180 20, 180 60"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="4"
              />
              <path
                d="M 20 60 L 20 180 C 20 200, 180 200, 180 180 L 180 60 Z"
                fill="url(#canMetal)"
              />
              <ellipse
                cx="100"
                cy="60"
                rx="80"
                ry="20"
                fill="#e5e7eb"
                stroke="#9ca3af"
                strokeWidth="2"
              />

              {/* A TINTA QUE MUDA DE COR */}
              <ellipse
                cx="100"
                cy="60"
                rx="70"
                ry="16"
                fill={color}
                className="transition-colors duration-300"
              />

              <path
                d="M 21 90 C 21 90, 100 110, 179 90 L 179 150 C 179 150, 100 170, 21 150 Z"
                fill="#117540"
              />
              <g transform="translate(45, 100)">
                <Hexagon
                  size={40}
                  color="white"
                  strokeWidth={2.5}
                  className="ml-1"
                />
                <FlaskConical
                  size={20}
                  color="white"
                  x={11}
                  y={10}
                  strokeWidth={2.5}
                />
                <text
                  x="50"
                  y="28"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  fontSize="24"
                  fill="white"
                >
                  Quimex
                </text>
              </g>
              <circle cx="20" cy="65" r="3" fill="#6b7280" />
              <circle cx="180" cy="65" r="3" fill="#6b7280" />
            </svg>
          </div>
          <p className="mt-6 text-sm text-gray-500 text-center px-4">
            A cor selecionada será preparada automaticamente pelo sistema
            tintométrico Quimex.
          </p>
        </div>

        {/* Lado Direito: Controles */}
        <div className="w-full md:w-1/2 p-8 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Configurar Cor
              </h2>
              <p className="text-sm text-gray-500">
                Escolha a cor para o lote de tinta.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 space-y-6">
            {/* Input Hex */}
            <div className="flex gap-4 items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="color"
                value={color}
                onChange={handleHexChange}
                className="w-12 h-12 rounded cursor-pointer border-0 p-0"
              />
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Código Hex
                </label>
                <input
                  type="text"
                  value={color.toUpperCase()}
                  readOnly
                  className="w-full bg-transparent font-mono text-lg text-gray-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Sliders RGB */}
            <div className="space-y-4">
              {["r", "g", "b"].map((channel) => (
                <div key={channel} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold uppercase text-gray-500">
                    <span>
                      {channel === "r"
                        ? "Vermelho"
                        : channel === "g"
                          ? "Verde"
                          : "Azul"}
                    </span>
                    <span>{rgb[channel]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgb[channel]}
                    onChange={(e) => handleRgbChange(channel, e.target.value)}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer 
                      ${channel === "r"
                        ? "bg-red-100 accent-red-500"
                        : channel === "g"
                          ? "bg-green-100 accent-green-500"
                          : "bg-blue-100 accent-blue-500"
                      }`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => onConfirm(color)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Check size={24} />
              Registrar Cor e Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const categories = [
  "Todos",
  "Tintas",
  "Ácidos",
  "Bases",
  "Solventes",
  "Sais",
  "Oxidantes",
];

// --- COMPONENTE PRINCIPAL (PDV) ---
export default function QuimexPOS() {
  useEffect(() => {
    if (sessionStorage.getItem("reloaded") !== "true") {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    }
  }, []);
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      if (!isLoading && !user) {
        router.push("/login");
      }
      else if (user.cargo != "Funcionario") {
        router.push("/login");
      }
    }
  }, [user, isLoading, router]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showPayment, setShowPayment] = useState(false);
  const [chemicalProducts, setChemicalProducts] = useState([]);
  const [method, setMethod] = useState("")

  useEffect(() => {
    if (user) {
      fetch("http://localhost:8080/produtos", {
        credentials: "include",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const customItem = {
            id: 1,
            sku: "QMX-TINTA",
            nome: "Tinta Acrílica Premium (Personalizada)",
            preco: 89.9,
            classificacao: "Tintas",
            imagem: null,
            isCustom: true,
          };
          const items = data.produtos.filter(
            (item) => item.filial == user.Loja_vinculada && item.id != 1
          );
          setChemicalProducts([customItem, ...(items || [])]);
        });
    }
  }, [user]);

  // Estados para o Misturador
  const [showMixer, setShowMixer] = useState(false);
  const [tempProduct, setTempProduct] = useState(null); // Produto sendo customizado

  const filteredProducts = chemicalProducts
    ? chemicalProducts.filter((product) => {
      const matchesSearch =
        product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Todos" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    : null;

  const initiateAddToCart = (product) => {
    if (product.isCustom) {
      setTempProduct(product);
      setShowMixer(true);
    } else {
      addToCartDirectly(product);
    }
  };

  const handleConfirmColor = (selectedColor) => {
    if (tempProduct) {
      // Cria um ID único baseado na cor para diferenciar no carrinho
      // Ex: Tintas vermelhas separadas de tintas azuis
      const customProduct = {
        ...tempProduct,
        id: `${tempProduct.id}`,
        name: `${tempProduct.name} - ${selectedColor.toUpperCase()}`,
        selectedColor: selectedColor, // Propriedade especial para renderizar no carrinho
      };
      addToCartDirectly(customProduct);
      setShowMixer(false);
      setTempProduct(null);
    }
  };

  const addToCartDirectly = (product) => {
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

  const total = cart.reduce((sum, item) => sum + item.preco * item.quantity, 0);

  const handlePayment = async (method) => {

    const ts = Date.now();
    // const turnoId = sessionStorage.getItem("turnoId");
    // const operador = localStorage.getItem("usuarioLogado");


    cart.forEach((produto) => {
      fetch("http://localhost:8080/produtos", {
        credentials: "include",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const customItem = {
            id: 1,
            sku: "QMX-TINTA",
            nome: "Tinta Acrílica Premium (Personalizada)",
            preco: 89.9,
            classificacao: "Tintas",
            imagem: null,
            isCustom: true,
          };
          const items = data.produtos.filter(
            (item) => item.filial == user.Loja_vinculada && item.id != 1
          );
          return [customItem, ...(items || [])];
        })
        .then((produtos) => {
          if (!produto.isCustom) {
            const index = produtos.findIndex((item) => item.id === produto.id);
            produto.quantidade = produtos[index].quantidade - produto.quantity;
            const menos = produto.quantity;
            fetch(`http://localhost:8080/produtos/${produto.id}`, {
              credentials: "include",
              headers: {
                "content-type": "application/json",
              },
              method: "put",
              body: JSON.stringify(produto),
            }).then(() => {
              setChemicalProducts((prevList) =>
                prevList.map((item) =>
                  item.id === produto.id
                    ? { ...item, quantidade: item.quantidade - menos }
                    : item
                )
              );
            });
          }
        });
      const doc = new jsPDF(); doc.text(`Comprovante`, 14, 20)
      autoTable(doc, { startY: 30, head: [["Nome", "Quantidade", "Valor"]], body: cart.map(p => [p.nome, p.quantity, `R$ ${p.preco * p.quantity}`]), headStyles: { fillColor: [32, 83, 42] } })
      doc.save(`comprovante.pdf`)

      const date = new Date()

      const pad = (n) => n.toString().padStart(2, '0');

      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());

      fetch(`http://localhost:8080/transferencias`, {
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        method: "post",
        body: JSON.stringify({
          loja: user.Loja_vinculada,
          produto: produto.id,
          quantidade_produto: produto.quantity,
          operador_id: user.id,
          cart_id: `${user.id}${ts}`,
          pagamento: method,
          horario: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
          preco: produto.preco,
          troco: 0,
        }),
      });
    });

    setMethod(method)

    setCart([]);
    setShowPayment(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-slate-900 font-sans">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-700 p-2 rounded-lg">
                <Hexagon className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  QUIMEX <span className="text-green-600">POS</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Sistema de Controle Químico
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-xs text-slate-400 font-semibold uppercase">
                  Operador
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-sm font-bold text-slate-700">
                    {typeof window !== "undefined" ? (
                      user ? (
                        <>{user.usuario}</>
                      ) : null
                    ) : (
                      "Usuario"
                    )}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  onClick={router.push("/vendedor/fecharCaixa")}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Fechar o caixa
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produto (Nome, Código ou SKU)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all outline-none text-sm"
              />
            </div>
          </div>
        </header>

        {/* Filtro */}
        <div className="px-6 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedCategory === category
                  ? "bg-slate-800 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grade de Produtos */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts
              ? filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => initiateAddToCart(product)}
                  className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/10 transition-all text-left relative overflow-hidden flex flex-col h-full"
                >
                  {/* Badge para produto customizável */}
                  {product.isCustom && (
                    <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">
                      PERSONALIZAR
                    </div>
                  )}

                  <div className="w-full h-32 mb-4 rounded-lg bg-gray-50 flex items-center justify-center relative">
                    {product.isCustom ? (
                      // Ícone especial para o produto de tinta
                      <Palette className="h-12 w-12 text-green-600 opacity-80 group-hover:scale-110 transition-transform" />
                    ) : // Placeholder para produtos normais
                      product.imagem ? (
                        <img
                          src={`http://localhost:8080${product.imagem}`}
                          alt={product.nome}
                          className="h-full object-contain"
                        />
                      ) : (
                        <FlaskConical className="h-10 w-10 text-gray-300" />
                      )}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <p className="text-[10px] text-gray-400 font-mono mb-1">
                      {product.sku}
                    </p>
                    <h3 className="font-semibold text-sm text-gray-800 leading-tight mb-1 line-clamp-2">
                      {product.nome}
                    </h3>
                    <div className="mt-auto flex items-end justify-between pt-2">
                      <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {product.classificacao}
                      </p>
                      <p className="text-lg font-bold text-slate-800">
                        R$ {product.preco.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
              : null}
          </div>
        </div>
      </div>

      {/* Carrinho Lateral */}
      <div className="w-[400px] border-l border-gray-200 bg-white flex flex-col shadow-xl z-20">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <div className="bg-slate-800 text-white p-1 rounded">
              <CreditCard size={16} />
            </div>
            Carrinho Atual
          </h2>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4 opacity-60">
              <div className="bg-gray-100 p-6 rounded-full">
                <Search size={40} />
              </div>
              <p className="text-sm font-medium">
                Caixa livre. Aguardando produtos.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow group relative"
              >
                <div className="flex gap-3">
                  {/* Renderização da Imagem no Carrinho */}
                  <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.selectedColor ? (
                      // Se for tinta personalizada, mostra a cor
                      <div className="w-full h-full relative group-hover:scale-110 transition-transform">
                        <div
                          className="absolute inset-0"
                          style={{ backgroundColor: item.selectedColor }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] text-white/90 font-mono bg-black/20 px-1 rounded backdrop-blur-sm">
                            {item.selectedColor}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={`http://localhost:8080${item.imagem}`}
                        alt={item.nome}
                        className="h-full object-contain"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h3
                        className="font-semibold text-sm text-slate-800 leading-tight truncate"
                        title={item.nome}
                      >
                        {item.nome}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        {item.sku}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="h-6 w-6 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-sm hover:text-red-500 disabled:opacity-50 disabled:hover:text-gray-600 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-bold text-xs text-slate-700 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          disabled={item.quantity >= item.quantidade}
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-6 w-6 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-sm hover:text-green-600 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-slate-800">
                        R$ {(item.preco * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute -top-2 -right-2 h-6 w-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer do Carrinho */}
        <div className="border-t border-gray-200 p-5 bg-white space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>
                Subtotal ({cart.reduce((acc, i) => acc + i.quantity, 0)} itens)
              </span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-slate-800">
                Total Final
              </span>
              <span className="text-2xl font-bold text-green-700">
                R$ {total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowPayment(true)}
            disabled={cart.length === 0}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
          >
            <span>Finalizar Venda</span>
            <CreditCard size={20} className="opacity-80" />
          </button>
        </div>
      </div>

      {/* --- MODAIS --- */}

      {/* Modal de Misturador de Tinta */}
      {showMixer && (
        <PaintMixerModal
          onClose={() => {
            setShowMixer(false);
            setTempProduct(null);
          }}
          onConfirm={handleConfirmColor}
        />
      )}

      {/* Modal de Pagamento */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Pagamento</h2>
              <button
                onClick={() => setShowPayment(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-white text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-8 flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wide">
                Valor a Receber
              </p>
              <p className="text-5xl font-bold text-slate-800 mb-8">
                R$ {total.toFixed(2)}
              </p>

              <div className="grid grid-cols-2 gap-4 w-full">
                {[
                  {
                    id: "Débito",
                    icon: CreditCard,
                    color: "text-blue-600",
                    bg: "bg-blue-50 hover:bg-blue-100 hover:border-blue-200",
                  },
                  {
                    id: "Crédito",
                    icon: CreditCard,
                    color: "text-purple-600",
                    bg: "bg-purple-50 hover:bg-purple-100 hover:border-purple-200",
                  },
                  {
                    id: "Dinheiro",
                    icon: Banknote,
                    color: "text-green-600",
                    bg: "bg-green-50 hover:bg-green-100 hover:border-green-200",
                  },
                  {
                    id: "PIX",
                    icon: Smartphone,
                    color: "text-teal-600",
                    bg: "bg-teal-50 hover:bg-teal-100 hover:border-teal-200",
                  },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handlePayment(method.id)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border border-transparent transition-all duration-200 ${method.bg}`}
                  >
                    <method.icon className={`h-8 w-8 ${method.color}`} />
                    <span className="font-semibold text-gray-700 text-sm">
                      {method.id}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Transação segura e criptografada
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

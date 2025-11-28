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

const chemicalProducts = [
  {
    id: "1",
    code: "QMX-001",
    name: "Ácido Sulfúrico 98%",
    price: 45.9,
    category: "Ácidos Inorgânicos",
    colorCode: "bg-orange-600",
    image: "/sulfuric-acid-bottle.jpg",
  },
  {
    id: "2",
    code: "QMX-002",
    name: "Hidróxido de Sódio",
    price: 32.5,
    category: "Bases",
    colorCode: "bg-green-700",
    image: "/sodium-hydroxide-bottle.jpg",
  },
  {
    id: "3",
    code: "QMX-003",
    name: "Álcool Etílico 99.5%",
    price: 28.9,
    category: "Inflamáveis",
    colorCode: "bg-red-600",
    image: "/ethanol-bottle.jpg",
  },
  {
    id: "4",
    code: "QMX-004",
    name: "Acetona PA",
    price: 35.0,
    category: "Inflamáveis",
    colorCode: "bg-red-600",
    image: "/acetone-bottle.jpg",
  },
  {
    id: "5",
    code: "QMX-005",
    name: "Cloreto de Sódio",
    price: 15.9,
    category: "Químicos Gerais",
    colorCode: "bg-gray-200",
    image: "/sodium-chloride-bottle.jpg",
  },
  {
    id: "6",
    code: "QMX-006",
    name: "Peróxido de Hidrogênio",
    price: 22.5,
    category: "Oxidantes",
    colorCode: "bg-lime-500",
    image: "/hydrogen-peroxide-bottle.jpg",
  },
  {
    id: "7",
    code: "QMX-007",
    name: "Ácido Clorídrico 37%",
    price: 38.9,
    category: "Ácidos Inorgânicos",
    colorCode: "bg-orange-600",
    image: "/hydrochloric-acid-bottle.jpg",
  },
  {
    id: "8",
    code: "QMX-008",
    name: "Carbonato de Cálcio",
    price: 18.5,
    category: "Químicos Gerais",
    colorCode: "bg-gray-200",
    image: "/calcium-carbonate-bottle.jpg",
  },

  // --- Produtos da Agroindústria ---
  {
    id: "9",
    code: "AGRO-001",
    name: "Ácido Bórico",
    price: 40.0,
    category: "Tóxicos", // Uso condicionado devido à toxicidade
    colorCode: "bg-purple-600", // Roxo
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "10",
    code: "AGRO-002",
    name: "Ácido Cítrico",
    price: 25.0,
    category: "Ácidos Orgânicos",
    colorCode: "bg-yellow-500", // Amarelo
    image: "/placeholder-chemical-bottle.jpg",
  },
  // Ácido Clorídrico (já existe, mas garantindo que esteja na categoria certa)
  // { id: "11", code: "AGRO-003", name: "Ácido Clorídrico", price: 38.9, category: "Ácidos Inorgânicos", colorCode: "bg-orange-600", image: "/hydrochloric-acid-bottle.jpg" },
  {
    id: "12",
    code: "AGRO-004",
    name: "Ácido Fosfórico (alimentício)",
    price: 55.0,
    category: "Ácidos Inorgânicos",
    colorCode: "bg-orange-600",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "13",
    code: "AGRO-005",
    name: "Ácido Nítrico",
    price: 60.0,
    category: "Ácidos Inorgânicos Oxidantes/Manuseio Especial",
    colorCode: "bg-blue-600", // Azul
    image: "/placeholder-chemical-bottle.jpg",
  },
  // Ácido Sulfúrico (já existe)
  {
    id: "14",
    code: "AGRO-006",
    name: "Basefloc (Agente Floculante)",
    price: 80.0,
    category: "Químicos Gerais", // Agente de tratamento, uso condicionado
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "15",
    code: "AGRO-007",
    name: "Borax (Tetraborato de Sódio)",
    price: 30.0,
    category: "Tóxicos", // Uso restrito por toxicidade
    colorCode: "bg-purple-600",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "16",
    code: "AGRO-008",
    name: "Cloreto Férrico",
    price: 48.0,
    category: "Ácidos Inorgânicos Oxidantes/Manuseio Especial", // Tratamento de água
    colorCode: "bg-blue-600",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "17",
    code: "AGRO-009",
    name: "Enxofre",
    price: 20.0,
    category: "Químicos Gerais", // Fungicida, fertilizante
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "18",
    code: "AGRO-010",
    name: "Formaldeído",
    price: 42.0,
    category: "Tóxicos", // Proibido/Restrito por toxicidade
    colorCode: "bg-purple-600",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "19",
    code: "AGRO-011",
    name: "Hidróxido de Potássio",
    price: 37.0,
    category: "Bases",
    colorCode: "bg-green-700",
    image: "/placeholder-chemical-bottle.jpg",
  },
  // Hidróxido de Sódio (já existe)
  {
    id: "20",
    code: "AGRO-012",
    name: "Hipoclorito de Sódio",
    price: 18.0,
    category: "Oxidantes", // Desinfetante, alvejante
    colorCode: "bg-lime-500",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "21",
    code: "AGRO-013",
    name: "Metabissulfito de Sódio",
    price: 28.0,
    category: "Químicos Gerais", // Conservante/antioxidante
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  // Peróxido de Hidrogênio (já existe)
  {
    id: "22",
    code: "AGRO-014",
    name: "Sulfato de Alumínio Ferroso",
    price: 52.0,
    category: "Químicos Gerais", // Tratamento de água
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "23",
    code: "AGRO-015",
    name: "Sulfato de Amônia",
    price: 22.0,
    category: "Químicos Gerais", // Fertilizante
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "24",
    code: "AGRO-016",
    name: "Sulfato de Zinco",
    price: 33.0,
    category: "Químicos Gerais", // Micronutriente
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "25",
    code: "AGRO-017",
    name: "Ureia",
    price: 16.0,
    category: "Químicos Gerais", // Fertilizante
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },

  // --- Produtos da Indústria de Transformação ---
  // Ácido Sulfúrico (já existe)
  // Hidróxido de Sódio (já existe)
  // Acetona (já existe)
  {
    id: "26",
    code: "TRANS-001",
    name: "Tolueno",
    price: 45.0,
    category: "Inflamáveis", // Solvente orgânico
    colorCode: "bg-red-600",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "27",
    code: "TRANS-002",
    name: "Etanol (Industrial)",
    price: 29.0,
    category: "Inflamáveis",
    colorCode: "bg-red-600",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "28",
    code: "TRANS-003",
    name: "Isopropanol",
    price: 38.0,
    category: "Inflamáveis",
    colorCode: "bg-red-600",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "29",
    code: "TRANS-004",
    name: "Polietileno (PE) Granulado",
    price: 75.0,
    category: "Químicos Gerais", // Polímero, matéria-prima
    colorCode: "bg-gray-200",
    image: "/placeholder-raw-material.jpg",
  },
  {
    id: "30",
    code: "TRANS-005",
    name: "Resina Epóxi",
    price: 120.0,
    category: "Químicos Gerais", // Resina termofixa
    colorCode: "bg-gray-200",
    image: "/placeholder-resin.jpg",
  },
  {
    id: "31",
    code: "TRANS-006",
    name: "Plastificante DOP",
    price: 90.0,
    category: "Químicos Gerais", // Aditivo para plásticos
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "32",
    code: "TRANS-007",
    name: "Antioxidante BHT",
    price: 65.0,
    category: "Químicos Gerais", // Aditivo químico
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "33",
    code: "TRANS-008",
    name: "Dióxido de Titânio (Pigmento)",
    price: 88.0,
    category: "Químicos Gerais", // Pigmento
    colorCode: "bg-gray-200",
    image: "/placeholder-pigment.jpg",
  },
  {
    id: "34",
    code: "TRANS-009",
    name: "Lauril Éter Sulfato de Sódio",
    price: 50.0,
    category: "Químicos Gerais", // Tensoativo
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "35",
    code: "TRANS-010",
    name: "Catalisador para Polímeros",
    price: 150.0,
    category: "Químicos Gerais", // Catalisador
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  // Peróxido de Hidrogênio (já existe)
  // Metabissulfito de Sódio (já existe)
  {
    id: "36",
    code: "TRANS-011",
    name: "PAC (Policloreto de Alumínio)",
    price: 60.0,
    category: "Químicos Gerais", // Coagulante/Floculante
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "37",
    code: "TRANS-012",
    name: "Óleo Lubrificante Industrial",
    price: 70.0,
    category: "Químicos Gerais", // Lubrificante
    colorCode: "bg-gray-200",
    image: "/placeholder-oil.jpg",
  },
  {
    id: "38",
    code: "TRANS-013",
    name: "Agente Antiespumante",
    price: 85.0,
    category: "Químicos Gerais", // Antiespumante
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "39",
    code: "TRANS-014",
    name: "Carbonato de Cálcio (Carga Mineral)",
    price: 25.0,
    category: "Químicos Gerais", // Carga mineral
    colorCode: "bg-gray-200",
    image: "/placeholder-raw-material.jpg",
  },
  {
    id: "40",
    code: "TRANS-015",
    name: "Agente de Cura para Resinas",
    price: 95.0,
    category: "Químicos Gerais", // Agente de cura
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "41",
    code: "TRANS-016",
    name: "Cloreto de Metileno",
    price: 58.0,
    category: "Tóxicos", // Composto halogenado, solvente
    colorCode: "bg-purple-600",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "42",
    code: "TRANS-017",
    name: "Aditivo Antiestático",
    price: 72.0,
    category: "Químicos Gerais", // Aditivo
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "43",
    code: "TRANS-018",
    name: "Dimeticona (Silicone)",
    price: 110.0,
    category: "Químicos Gerais", // Silicone
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "44",
    code: "TRANS-019",
    name: "Biocida Isotiazolinona",
    price: 80.0,
    category: "Tóxicos", // Biocida
    colorCode: "bg-purple-600",
    image: "/placeholder-chemical-bottle.jpg",
  },

  // --- Produtos da Indústria Farmacêutica & Cosmética ---
  {
    id: "45",
    code: "FARMA-001",
    name: "Lactose Monohidratada",
    price: 40.0,
    category: "Químicos Gerais", // Excipiente
    colorCode: "bg-gray-200",
    image: "/placeholder-raw-material.jpg",
  },
  {
    id: "46",
    code: "FARMA-002",
    name: "Celulose Microcristalina",
    price: 45.0,
    category: "Químicos Gerais", // Excipiente
    colorCode: "bg-gray-200",
    image: "/placeholder-raw-material.jpg",
  },
  {
    id: "47",
    code: "FARMA-003",
    name: "Lauril Sulfato de Sódio (LSS)",
    price: 35.0,
    category: "Químicos Gerais", // Surfactante
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "48",
    code: "FARMA-004",
    name: "Carbopol 940 (Espessante)",
    price: 70.0,
    category: "Químicos Gerais", // Espessante
    colorCode: "bg-gray-200",
    image: "/placeholder-raw-material.jpg",
  },
  {
    id: "49",
    code: "FARMA-005",
    name: "Propilenoglicol",
    price: 30.0,
    category: "Químicos Gerais", // Solvente
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "50",
    code: "FARMA-006",
    name: "Glicerina Bi-destilada",
    price: 28.0,
    category: "Químicos Gerais", // Solvente/Umectante
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "51",
    code: "FARMA-007",
    name: "Fenoxietanol (Conservante)",
    price: 60.0,
    category: "Químicos Gerais", // Conservante
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  // Ácido Cítrico (já existe)
  {
    id: "52",
    code: "FARMA-008",
    name: "Ácido Lático",
    price: 42.0,
    category: "Ácidos Orgânicos",
    colorCode: "bg-yellow-500",
    image: "/placeholder-chemical-bottle.jpg",
  },
  // Hidróxido de Sódio (já existe)
  {
    id: "53",
    code: "FARMA-009",
    name: "Vitamina E (Tocoferol)",
    price: 85.0,
    category: "Químicos Gerais", // Antioxidante
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "54",
    code: "FARMA-010",
    name: "Óleo de Amêndoas Doces (Emoliente)",
    price: 50.0,
    category: "Químicos Gerais", // Emoliente
    colorCode: "bg-gray-200",
    image: "/placeholder-oil.jpg",
  },
  {
    id: "55",
    code: "FARMA-011",
    name: "Sorbitol (Umectante)",
    price: 25.0,
    category: "Químicos Gerais", // Umectante
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  // Dióxido de Titânio (já existe)
  {
    id: "56",
    code: "FARMA-012",
    name: "Óxido de Zinco (Filtro UV)",
    price: 55.0,
    category: "Químicos Gerais", // Filtro UV
    colorCode: "bg-gray-200",
    image: "/placeholder-raw-material.jpg",
  },
  {
    id: "57",
    code: "FARMA-013",
    name: "Essência Floral (Fragrância)",
    price: 75.0,
    category: "Químicos Gerais", // Fragrância
    colorCode: "bg-gray-200",
    image: "/placeholder-fragrance.jpg",
  },
  // Dimeticona (já existe)
  {
    id: "58",
    code: "FARMA-014",
    name: "Vitamina C (Ácido Ascórbico)",
    price: 90.0,
    category: "Ácidos Orgânicos", // Vitamina funcional
    colorCode: "bg-yellow-500",
    image: "/placeholder-raw-material.jpg",
  },
  {
    id: "59",
    code: "FARMA-015",
    name: "Ácido Salicílico",
    price: 50.0,
    category: "Ácidos Orgânicos", // Queratolítico
    colorCode: "bg-yellow-500",
    image: "/placeholder-chemical-bottle.jpg",
  },
  // Ureia (já existe)
  {
    id: "60",
    code: "FARMA-016",
    name: "EDTA Dissódico (Quelante)",
    price: 48.0,
    category: "Químicos Gerais", // Agente quelante
    colorCode: "bg-gray-200",
    image: "/placeholder-raw-material.jpg",
  },
  {
    id: "61",
    code: "FARMA-017",
    name: "Creme Base Neutra",
    price: 38.0,
    category: "Químicos Gerais", // Base cosmética
    colorCode: "bg-gray-200",
    image: "/placeholder-cream-base.jpg",
  },
  {
    id: "62",
    code: "FARMA-018",
    name: "Cocamidopropil Betaína",
    price: 40.0,
    category: "Químicos Gerais", // Agente espumante
    colorCode: "bg-gray-200",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "63",
    code: "FARMA-019",
    name: "Ibuprofeno em Pó (API)",
    price: 180.0,
    category: "Químicos Gerais", // API
    colorCode: "bg-gray-200",
    image: "/placeholder-raw-material.jpg",
  },
  {
    id: "64",
    code: "FARMA-020",
    name: "Ácido Hialurônico (Grau Cosmético)",
    price: 250.0,
    category: "Químicos Gerais", // Agente umectante cutâneo
    colorCode: "bg-gray-200",
    image: "/placeholder-raw-material.jpg",
  },

  // --- Produtos da Indústria de Limpeza e Saneamento ---
  // Ácido Clorídrico (já existe)
  // Ácido Fosfórico (já existe)
  // Ácido Nítrico (já existe)
  // Ácido Sulfúrico (já existe)
  {
    id: "65",
    code: "LIMPEZA-001",
    name: "Barrilha Leve (Carbonato de Sódio)",
    price: 22.0,
    category: "Bases", // Usado em detergentes, controle de pH
    colorCode: "bg-green-700",
    image: "/placeholder-raw-material.jpg",
  },
  // PAC (Policloreto de Alumínio) (já existe)
  {
    id: "66",
    code: "LIMPEZA-002",
    name: "Bifluoreto de Amônio",
    price: 55.0,
    category: "Ácidos Inorgânicos Oxidantes/Manuseio Especial", // Desincrustante ácido
    colorCode: "bg-blue-600",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "67",
    code: "LIMPEZA-003",
    name: "Bissulfito de Sódio",
    price: 30.0,
    category: "Químicos Gerais", // Agente redutor
    colorCode: "bg-gray-200",
    image: "/placeholder-raw-material.jpg",
  },
  // Borax (Borato de Sódio) (já existe)
  // Formaldeído (já existe)
  // Hidróxido de Potássio (já existe)
  // Hidróxido de Sódio (já existe)
  // Hipoclorito de Sódio (já existe)
  // Metabissulfito de Sódio (já existe)
  {
    id: "68",
    code: "LIMPEZA-004",
    name: "Percarbonato de Sódio",
    price: 38.0,
    category: "Oxidantes", // Alvejante, agente de limpeza
    colorCode: "bg-lime-500",
    image: "/placeholder-raw-material.jpg",
  },
  // Peróxido de Hidrogênio (já existe)
  {
    id: "69",
    code: "LIMPEZA-005",
    name: "Silicato de Sódio Alcalino",
    price: 45.0,
    category: "Bases", // Anticorrosivo, detergente
    colorCode: "bg-green-700",
    image: "/placeholder-chemical-bottle.jpg",
  },
  {
    id: "70",
    code: "LIMPEZA-006",
    name: "Sulfato de Alumínio Isento de Ferro",
    price: 50.0,
    category: "Químicos Gerais", // Tratamento de água
    colorCode: "bg-gray-200",
    image: "/placeholder-raw-material.jpg",
  },
  {
    id: "71",
    code: "LIMPEZA-007",
    name: "Sulfato de Sódio",
    price: 15.0,
    category: "Químicos Gerais", // Carga em detergentes
    colorCode: "bg-gray-200",
    image: "/placeholder-raw-material.jpg",
  },
];

// Categorias atualizadas para corresponder à tabela e em português
const categories = [
  "Todos",
  "Ácidos Inorgânicos",
  "Ácidos Orgânicos",
  "Bases",
  "Ácidos Inorgânicos Oxidantes/Manuseio Especial",
  "Oxidantes",
  "Tóxicos",
  "Inflamáveis",
  "Químicos Gerais",
];

// ================================
// Componente Principal
// ================================
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

  const handlePayment = (method) => {
    alert(`Pagamento de R$ ${total.toFixed(2)} realizado via ${method}`);
    setCart([]);
    setShowPayment(false);
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-primary px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">QUIMEX</h1>
              <p className="text-sm text-primary-foreground">
                Sistema de Caixa - Produtos Químicos
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-primary-foreground">Operador</p>
              <p className="text-sm font-medium text-primary-foreground">Caixa 01</p>
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
              {categories.map((category) => {
                // Define cor conforme categoria
                const colorMap = {
                  "Ácidos Inorgânicos": "bg-orange-600",
                  "Ácidos Orgânicos": "bg-yellow-500",
                  Bases: "bg-green-700",
                  "Ácidos Inorgânicos Oxidantes/Manuseio Especial": "bg-blue-600",
                  Oxidantes: "bg-lime-500",
                  Tóxicos: "bg-purple-600",
                  Inflamáveis: "bg-red-600",
                  "Químicos Gerais": "bg-gray-200",
                  Todos: "bg-secondary",
                };

                const color = colorMap[category] || "bg-opink-300";
                const isSelected = selectedCategory === category;

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all border
              ${isSelected
                        ? "border-primary bg-muted-foreground/20 text-pink"
                        : "border-border bg-background text-background-foreground hover:bg-background/80"
                      }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${color} border border-border`}></span>
                    {category}
                  </button>
                );
              })}
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
                className="bg-card border border-border rounded-md overflow-hidden hover:border-primary hover:shadow-lg transition-all text-left"
              >
                {/* Faixa de cor da categoria */}
                <div
                  className={`${product.colorCode} h-2 w-full rounded-t-md`}
                  style={{ marginTop: "0px", borderTopLeftRadius: "0.5rem", borderTopRightRadius: "0.5rem" }}
                ></div>


                <div className="p-4 space-y-1">
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
                <div
                  key={item.id}
                  className="bg-background border border-border rounded-lg p-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-mono">
                        {item.code}
                      </p>
                      <h3 className="font-semibold text-sm text-foreground leading-tight">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="h-7 w-7 flex items-center justify-center rounded-md bg-secondary hover:bg-secondary/80 disabled:opacity-50 transition-colors"
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
                        <p className="text-sm font-bold text-primary">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
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

        {/* Total e Pagamento */}
        <div className="border-t border-border p-4 bg-muted/30">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-foreground">Total:</span>
            <span className="text-2xl font-bold text-primary">
              R$ {total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => setShowPayment(true)}
            disabled={cart.length === 0}
            className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Finalizar Venda
          </button>
        </div>
      </div>

      {/* Modal de Pagamento */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Forma de Pagamento
              </h2>
              <button
                onClick={() => setShowPayment(false)}
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Total a pagar:
              </p>
              <p className="text-3xl font-bold text-primary">
                R$ {total.toFixed(2)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Débito", icon: <CreditCard /> },
                { name: "Crédito", icon: <CreditCard /> },
                { name: "Dinheiro", icon: <Banknote /> },
                { name: "PIX", icon: <Smartphone /> },
              ].map((method) => (
                <button
                  key={method.name}
                  onClick={() => handlePayment(method.name)}
                  className="flex flex-col items-center gap-3 p-6 bg-background border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="h-10 w-10 text-primary">{method.icon}</div>
                  <span className="font-semibold text-foreground">
                    {method.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

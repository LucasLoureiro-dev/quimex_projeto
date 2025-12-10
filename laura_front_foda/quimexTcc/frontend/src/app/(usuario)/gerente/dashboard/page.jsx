"use client"
import React from 'react';
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/auth-context";
import {
  TrendingUp,
  DollarSign,
  Package,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { useState, useEffect } from "react"


export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      if (!isLoading && !user) {
        router.push("/login");
      }
      else if (user.cargo != "Gerente") {
        router.push("/login");
      }
    }
  }, [user, isLoading, router]);
  const [vendas, setVendas] = useState("");
  const [despesas, setDespesas] = useState("");
  const [produtos, setProdutos] = useState("");
  const [contas, setContas] = useState("");
  const colors = ["#20532A", "#0F703A", "#1B8742", "#279D49", "#2EAF4A", "#7CC472", "#BEE2B9"]

  useEffect(() => {
    if (user) {
      fetch("http://localhost:8080/produtos", {
        credentials: "include",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setProdutos(data.produtos.filter((produto) => produto.filial == user.Loja_vinculada && produto.id != 1));
        });

      // fetch("http://localhost:8080/lojas", {
      //   credentials: "include",
      // })
      //   .then((res) => {
      //     return res.json();
      //   })
      //   .then((data) => {
      //     setLojas(data.lojas);
      //   });

      // fetch("http://localhost:8080/fornecedores", {
      //   credentials: "include",
      // })
      //   .then((res) => {
      //     return res.json();
      //   })
      //   .then((data) => {
      //     setFornecedores(data.fornecedores);
      //   });


      fetch("http://localhost:8080/contas", {
        credentials: "include",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setContas(data.contas.filter((conta) => conta.loja == user.Loja_vinculada));
        });

      fetch("http://localhost:8080/transferencias", {
        credentials: "include",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setVendas(data.trasferencias.filter((transferencia) => transferencia.loja == user.Loja_vinculada));
        });
    }
  }, [user]);

  function getReceitaHoje() {
    const now = new Date();

    // We use reduce to Filter and Sum at the same time (faster)
    const total = vendas ? vendas.reduce((acc, item) => {
      const itemDate = new Date(item.horario);

      // Check if Year, Month, and Day match "Today"
      const isToday =
        itemDate.getDate() === now.getDate() &&
        itemDate.getMonth() === now.getMonth() &&
        itemDate.getFullYear() === now.getFullYear();

      if (isToday) {
        return acc + Number(item.preco);
      }

      return acc;
    }, 0)
      : 0;
    return `R$ ${total.toFixed(2)}`;
  }

  function getReceitaSemanal() {
    const now = new Date();
    const msPerDay = 86400000;

    const total = vendas ? vendas.reduce((acc, item) => {
      const itemDate = new Date(item.horario);

      const diffDays = (now - itemDate) / msPerDay;

      if (diffDays >= 0 && diffDays <= 7) {
        return acc + Number(item.preco);
      }

      return acc;
    }, 0)
      : 0;
    return `R$ ${total.toFixed(2)}`;
  }

  function calcularLucroTotal() {
    const totalVendas = vendas ? vendas.reduce((acc, item) => acc + Number(item.preco), 0) : 0

    const totalDespesas = despesas ? despesas.reduce((acc, item) => acc + Number(item.valor), 0) : 0

    return `R$  ${(totalVendas - totalDespesas).toFixed(2)}`;
  }


  const semana = ["Seg", "Ter", "Qua", "Qui", "Sex", 'Sab', "Dom"];

  function contarVendasPorSemana() {
    if (!vendas) return [];

    const now = new Date();

    const result = semana.map(m => ({ week: m, value: 0 }));

    vendas.forEach(v => {
      const data = new Date(v.horario);

      if (data.getMonth() === now.getMonth() && data.getFullYear() === now.getFullYear()) {

        const index = Math.floor((data.getDate() - 1) / 7);

        if (result[index]) {
          result[index].value++;
        }
      }
    });

    return result;
  }

  function getAlerts() {
    if (produtos && contas) {
      console.log(produtos, contas)
      const alerts = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      produtos.forEach((p) => {
        if (p.quantidade <= 2) {
          alerts.push({
            type: "critical",
            title: "Estoque Crítico",
            desc: `${p.nome} tem apenas ${p.quantidade} un.`,
            weight: 2 // High Priority
          });
        } else if (p.quantidade <= 5) {
          alerts.push({
            type: "warning",
            title: "Estoque Baixo",
            desc: `${p.nome} com ${p.quantidade} un restantes.`,
            weight: 1 // Low Priority
          });
        }
      });

      // 2. CHECK BILLS (Contas)
      contas.forEach((c) => {
        // Skip if already paid
        if (c.estado === 'pago') return;

        const vencimento = new Date(c.vencimento);
        vencimento.setHours(0, 0, 0, 0);

        // Pure JS Day Difference: (Target - Today) / Milliseconds in a Day
        const diffTime = vencimento - today;
        const diffDays = Math.ceil(diffTime / 86400000);

        if (diffDays < 0) {
          alerts.push({
            type: "critical",
            title: "Conta Atrasada",
            desc: `${c.descricao} venceu há ${Math.abs(diffDays)} dias.`,
            weight: 2
          });
        } else if (diffDays >= 0 && diffDays <= 3) {
          alerts.push({
            type: "warning",
            title: "Vencimento Próximo",
            desc: `${c.descricao} vence ${diffDays === 0 ? 'hoje' : `em ${diffDays} dias`}.`,
            weight: 1
          });
        }
      });

      return alerts.sort((a, b) => b.weight - a.weight).slice(0, 2);
    }
  }

  const salesData = contarVendasPorSemana();

  const currentAlerts = getAlerts();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 dark:bg-[#121212]">
      {/* Cabeçalho com Saudação e Data */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#20532A] dark:text-[#BEE2B9]">Visão Geral</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">Bem-vindo! Aqui está uma visão geral sobre sua loja hoje.</p>
        </div>
        <div className="flex items-center gap-3 bg-[#2EAF4A] dark:bg-[#3C5A3B] px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-600 text-sm font-medium text-[#BEE2B9]">
          <Clock size={16} className="text-[#BEE2B9]" />
          <span>Loja Aberta • Fecha às 22:00</span>
        </div>
      </div>

      {/* Grid de KPIs - Design "Glass" e Gradientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Vendas Hoje"
          value={getReceitaHoje()}
          trendUp={true}
          icon={DollarSign}
          color="white" // Destaque para o principal
        />
        <KpiCard
          title="Vendas da Semana"
          value={getReceitaSemanal()}
          trendUp={true}
          icon={TrendingUp}
          color="white"
        />
        <KpiCard
          title="Saldo em Caixa"
          value={calcularLucroTotal()}
          icon={Package}
          color="white"
        />
        <KpiCard
          title="Volume de Vendas"
          value={vendas ? vendas.length : 0}
          trendUp={false}
          icon={Package}
          color="white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seção Principal: Gráfico Premium */}
        <div className="col-span-1 lg:col-span-2 rounded-xl p-5 border bg-card border-border shadow-sm relative ">
          <h2 className="text-lg font-semibold mb-3">Análise de Vendas</h2>

          {/* Componente de Gráfico SVG Customizado (Bonito e Curvo) */}
          <div className="h-72 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#44403c33" />
                <XAxis dataKey="week" stroke="#9CA3AF" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={colors[4]}
                  strokeWidth={2.5}
                  dot={{ fill: colors[2], r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>

          </div>

          {/* Decoração de Fundo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#BEE2B9] dark:bg-[#20532A] rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        </div>

        {/* Coluna Lateral: Alertas e Top Produtos */}
        <div className="space-y-8">
          {/* Alertas Importantes */}
          <div className="bg-white dark:bg-[#20532A] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-[#BEE2B9] mb-4 flex items-center gap-2">
              <div className="w-2 h-6 bg-[#BEE2B9] text-[#20532A] dark:text-white rounded-full"></div>
              Atenção Necessária
            </h3>
            <div className="space-y-3">
              {/* {currentAlerts ? : (<>Tudo está me ordem</>)} */}
              {/* <AlertCard
                type="critical"
                title="Caixa Pendente"
                desc="Fechamento de ontem não realizado."
              />
              <AlertCard
                type="warning"
                title="Estoque Baixo"
                desc="Papel A4 abaixo do mínimo."
              /> */}
              {currentAlerts ? currentAlerts.map((alert, i) => (
                <AlertCard
                  key={i}
                  type={alert.type}
                  title={alert.title}
                  desc={alert.desc}
                />
              ))
                : null}

              {currentAlerts ? currentAlerts.length === 0 && (
                <div className="text-sm text-gray-500 p-2">Sem alertas pendentes.</div>
              )
                : null}
            </div>
          </div>

          {/* Produtos Mais Vendidos com Barras de Progresso */}
          <div className="bg-white dark:bg-[#20532A] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#20532A] dark:text-white">Top Produtos</h3>
            </div>
            <div className="space-y-5">
              <ProductRow
                rank={1}
                name="Produto químico"
                sales="54 un"
                price="R$ 120,00"
              />
              <ProductRow
                rank={2}
                name="Produto químico"
                sales="32 un"
                price="R$ 25,90"
              />
              <ProductRow
                rank={3}
                name="Produto químico"
                sales="20 un"
                price="R$ 55,00"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- COMPONENTES VISUAIS RICOS --- */

// 1. Card KPI com suporte a variantes visuais
function KpiCard({ title, value, trend, trendUp, subtext, icon: Icon, color }) {
  // Configuração de cores baseada na prop 'color'
  const isDark = color === 'dark';
  const isLight = color === 'light';

  let containerClass = "bg-white dark:bg-[#20532A] border-gray-100 dark:border-gray-700 text-gray-800 dark:text-white";
  let iconBgClass = "bg-[#F3F4F6] dark:bg-[#20532A] text-[#20532A] dark:text-white";
  let titleClass = "text-gray-500 dark:text-gray-400";
  let valueClass = "text-[#20532A] dark:text-white";

  if (isDark) {
    // Gradiente Verde Escuro Luxuoso
    containerClass = "bg-gradient-to-br from-[#20532A] to-[#1B8742] text-white border-transparent shadow-lg shadow-[#20532A]/20";
    iconBgClass = "bg-white/20 text-white backdrop-blur-sm";
    titleClass = "text-[#BEE2B9]";
    valueClass = "text-white";
  } else if (isLight) {
    // Fundo Verde Suave
    containerClass = "bg-[#BEE2B9]/30 border-[#BEE2B9] text-[#20532A]";
    iconBgClass = "bg-[#20532A] text-white";
    titleClass = "text-[#1B8742]";
    valueClass = "text-[#20532A]";
  }

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${containerClass}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${iconBgClass}`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isDark
            ? 'bg-white/20 text-white'
            : trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
            {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className={`text-sm font-medium mb-1 ${titleClass}`}>{title}</p>
        <h3 className={`text-3xl font-bold tracking-tight ${valueClass}`}>{value}</h3>
        {subtext && <p className="text-xs opacity-70 mt-2">{subtext}</p>}
      </div>
    </div>
  );
}

// 2. Card de Alerta com Iconografia Distinta
function AlertCard({ type, title, desc }) {
  const isCritical = type === 'critical';
  return (
    <div className={`flex gap-4 p-4 rounded-2xl border transition-colors cursor-pointer ${isCritical
      ? 'bg-red-50/50 border-red-100 hover:bg-red-50'
      : 'bg-amber-50/50 border-amber-100 hover:bg-amber-50'
      }`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isCritical ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
        }`}>
        <AlertCircle size={20} />
      </div>
      <div>
        <h4 className={`font-bold text-sm ${isCritical ? 'text-red-800' : 'text-amber-800'}`}>{title}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

// 3. Linha de Produto com Barra de Progresso Visual
function ProductRow({ rank, name, sales, price, percent }) {
  return (
    <div className="group">
      <div className="flex justify-between items-end mb-1">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded bg-[#F3F4F6] dark:bg-[#20532A] text-xs font-bold text-gray-400 group-hover:bg-[#20532A] group-hover:text-white transition-colors">
            {rank}
          </span>
          <div>
            <p className="text-sm font-bold text-gray-800 dark:text-white">{name}</p>
            <p className="text-xs text-gray-400 dark:text-gray-300">{sales}</p>
          </div>
        </div>
        <span className="text-sm font-semibold text-[#1B8742] dark:text-[#BEE2B9]">{price}</span>
      </div>
      {/* Barra de Progresso Fundo */}
      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-600 rounded-full mt-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#20532A] to-[#2EAF4A] rounded-full transition-all duration-1000 group-hover:shadow-[0_0_10px_#2EAF4A]"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}



// 4. Gráfico de Área Suave (SVG Puro sem bibliotecas)
// function SmoothAreaChart() {
//   // Simulação de dados para a curva
//   // Usamos SVG nativo para garantir performance e beleza sem bibliotecas externas
//   return (
//     <svg className="w-full h-full overflow-visible" viewBox="0 0 800 300" preserveAspectRatio="none">
//       <defs>
//         {/* Gradiente de Preenchimento */}
//         <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
//           <stop offset="0%" stopColor="#2EAF4A" stopOpacity="0.4" />
//           <stop offset="100%" stopColor="#BEE2B9" stopOpacity="0" />
//         </linearGradient>
//         {/* Sombra da Linha */}
//         <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
//           <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1B8742" floodOpacity="0.3" />
//         </filter>
//       </defs>

//       {/* Grid Lines Horizontais (Fundo) */}
//       {[0, 100, 200].map((y, i) => (
//         <line key={i} x1="0" y1={y + 50} x2="800" y2={y + 50} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />
//       ))}

//       {/* Área (Preenchimento) */}
//       <path
//         d="M0,250 C100,200 150,280 250,180 C350,80 450,150 550,100 C650,50 750,80 800,20 V300 H0 Z"
//         fill="url(#chartGradient)"
//       />

//       {/* Linha Principal (Stroke) */}
//       <path
//         d="M0,250 C100,200 150,280 250,180 C350,80 450,150 550,100 C650,50 750,80 800,20"
//         fill="none"
//         stroke="#1B8742"
//         strokeWidth="4"
//         strokeLinecap="round"
//         filter="url(#shadow)"
//         className="drop-shadow-sm"
//       />

//       {/* Pontos Interativos (Tooltips visuais) */}
//       <circle cx="250" cy="180" r="6" fill="#fff" stroke="#20532A" strokeWidth="3" className="hover:scale-150 transition-transform cursor-pointer" />
//       <circle cx="550" cy="100" r="6" fill="#fff" stroke="#20532A" strokeWidth="3" className="hover:scale-150 transition-transform cursor-pointer" />

//       {/* Label Flutuante (Exemplo de "enfeite") */}
//       <g transform="translate(550, 70)">
//         <rect x="-30" y="-25" width="60" height="20" rx="4" fill="#20532A" />
//         <text x="0" y="-11" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">R$ 5.2k</text>
//         <path d="M-4,-6 L0,0 L4,-6" fill="#20532A" transform="translate(0, 1)" />
//       </g>

//       {/* Eixo X (Dias) */}
//       <g className="text-muted text-xs font-medium text-[#20532A] dark:text-white" style={{ transform: 'translateY(290px)' }}>
//         <text x="50" textAnchor="middle">SEG</text>
//         <text x="166" textAnchor="middle">TER</text>
//         <text x="282" textAnchor="middle">QUA</text>
//         <text x="400" textAnchor="middle">QUI</text>
//         <text x="516" textAnchor="middle">SEX</text>
//         <text x="632" textAnchor="middle">SÁB</text>
//         <text x="750" textAnchor="middle">DOM</text>
//       </g>
//     </svg>
//   );
// }

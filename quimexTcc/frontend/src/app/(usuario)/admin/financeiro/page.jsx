"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/auth-context";
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingDown, DollarSign, Plus, Download, Eye, FlaskConical, Banknote, Calendar, CheckCircle, Clock, Receipt, User
} from "lucide-react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { ControlePaginacao } from "@/components/paginacao/controlePaginacao";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { VendasTable } from "@/components/vendasTable/vendasTable";

//  Cores e estilos
const COLOR_RECEITA = "text-[#0F703A]"
const COLOR_DESPESAS = "text-[#20532A]"
const COLOR_SALDO = "text-[#279D49]"
const COLOR_CONTA_PAGAR = "text-[#20532A]"
const BORDER_RECEITA = "border-l-[#0F703A]"
const BORDER_DESPESAS = "border-l-[#20532A]"
const BORDER_SALDO = "border-l-[#279D49]"
const BORDER_CONTA_PAGAR = "border-l-[#20532A]"
const BG_PRINCIPAL = "bg-[#1B8742]"
const BG_CONTA_PAGAR_BUTTON = "bg-[#20532A]"
const BG_PAGAR_BUTTON = "bg-[#0F703A]"

//  DADOS SIMPLIFICADOS
const DADOS_FILIAIS = [
  { id: "1", nome: "Quimex SP", receita: 2850000, despesas: 1950000 },
  { id: "2", nome: "Quimex RJ", receita: 1950000, despesas: 1400000 },
  { id: "3", nome: "Quimex MG", receita: 1650000, despesas: 1200000 },
]

const FLUXO_INICIAL = [
  { id: 1, filial: "Quimex SP", data: "2024-11-12", tipo: "receita", valor: 80000, descricao: "Venda Lote #SP125" },
  { id: 3, filial: "Quimex SP", data: "2024-11-11", tipo: "despesa", valor: 50000, descricao: "Fornecedor A" },
]

// const CONTAS_INICIAL = [
//   { id: 1, filial: "Quimex SP", tipo: "Salário", descricao: "Salários Mês", valor: 150000, vencimento: "2024-12-05", pago: false },
//   { id: 2, filial: "Quimex RJ", tipo: "Fornecedor", descricao: "Compra Metanol", valor: 250000, vencimento: "2024-11-30", pago: false },
// ]

//  NOVO: DADOS DE VENDAS PDV
const VENDAS_PDV_INICIAL = [
  { id: "10234", itens: "2x Ácido Sulfúrico 5L, 1x Probeta Vidro", valor: 450.00, pagamento: "Pix", horario: "10:45", operador: "Carlos Silva" },
  { id: "10233", itens: "5x Solvente Industrial 20L", valor: 1250.00, pagamento: "Cartão Crédito", horario: "10:12", operador: "Ana Costa" },
  { id: "10232", itens: "10x Luvas Nitrílicas (Caixa)", valor: 350.00, pagamento: "Dinheiro", horario: "09:30", operador: "Carlos Silva" },
  { id: "10231", itens: "1x Kit Reagentes Básico", valor: 890.00, pagamento: "Boleto", horario: "08:15", operador: "Roberto Dias" },
]

const PRODUTOS_POR_FILIAL = {
  "Quimex SP": [{ id: 1, nome: "Ácido Sulfúrico", quantidade: 120, preco: 850 }],
  "Quimex RJ": [{ id: 1, nome: "Ácido Nítrico", quantidade: 80, preco: 900 }],
}

const formatCurrency = (val) => val >= 1000000 ? `R$ ${(val / 1000000).toFixed(2)}M` : `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
const formatShortDate = (date) => date ? new Intl.DateTimeFormat('pt-BR').format(new Date(date)) : "N/A"
const getToday = () => new Date().toISOString().split('T')[0]

export default function FinancialDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      if (!isLoading && !user) {
        router.push("/login");
      }
      else if (user.cargo != "Administrador") {
        router.push("/login");
      }
    }
  }, [user, isLoading, router]);
  const [filiais, setFiliais] = useState(DADOS_FILIAIS)
  const [fluxo, setFluxo] = useState(FLUXO_INICIAL)
  const [contas, setContas] = useState("")
  const [vendasPdv, setVendasPdv] = useState("")
  const [lojas, setLojas] = useState("");
  const [despesas, setDespesas] = useState("");
  const [produtos, setProdutos] = useState("");
  const [filialFilter, setFilialFilter] = useState("");

  // Controle de Modais
  const [modais, setModais] = useState({ pagar: false, report: false, transacao: false, detalhes: false })
  const toggle = (modal, state) => setModais(p => ({ ...p, [modal]: state }))

  // Estados de Filtro e Seleção
  const [filialSel, setFilialSel] = useState("")
  const [cashFlowFilial, setCashFlowFilial] = useState(filiais[0].nome)
  const [periodo, setPeriodo] = useState("diario")

  // Formulários
  const [formPagar, setFormPagar] = useState({ filialId: "", tipo: "Fornecedor", descricao: "", valor: "", vencimento: "" })
  const [formTrans, setFormTrans] = useState({ filialId: "", tipo: "receita", valor: "", descricao: "" })

  useEffect(() => {
    fetch("http://localhost:8080/transferencias", {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setVendasPdv(data.trasferencias);
      });
    fetch("http://localhost:8080/lojas", {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLojas(data.lojas);
      });
    fetch("http://localhost:8080/contas", {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setContas(data.contas);
      });
    fetch("http://localhost:8080/despesas", {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setDespesas(data.despesas);
      });
    fetch("http://localhost:8080/produtos", {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setProdutos(data.produtos);
      });
  }, []);
  //  LÓGICA DE NEGÓCIO
  // const totais = useMemo(() => filiais.reduce((acc, f) => ({
  //   receita: vendasPdv? vendasPdv.reduce((acc, f) => acc + f.preco, 0) : 0,
  //   despesas: despesas ? despesas.reduce((acc, f) => acc + f.valor, 0) : 0,
  //   saldo: acc.saldo + (f.receita -  despesas ? despesas.reduce((acc, f) => acc + f.valor, 0) : 0)
  // }), { receita: 0, despesas: 0, saldo: 0 }), [filiais])

  const receitasFiltradas = vendasPdv && filialFilter ? vendasPdv.filter(i => i.loja == filialFilter).filter(i => {
    const diff = (new Date() - new Date(i.horario)) / (86400000)
    return periodo === 'diario' ? diff <= 1 : periodo === 'semanal' ? diff <= 7 : diff <= 30
  }).sort((a, b) => new Date(b.horario) - new Date(a.horario)) : []

  const despesasFiltradas = despesas && filialFilter ? despesas.filter(i => i.loja == filialFilter).filter(i => {
    const diff = (new Date() - new Date(i.data)) / (86400000)
    return periodo === 'diario' ? diff <= 1 : periodo === 'semanal' ? diff <= 7 : diff <= 30
  }).sort((a, b) => new Date(b.horario) - new Date(a.horario)) : []

  const contasPendentes = useMemo(() => {
    if (!contas) return null;
    return contas.filter(c => c.estado != "pago");
  }, [contas]);
  const valorPendente = contasPendentes ? contasPendentes.reduce((acc, c) => acc + c.preco, 0) : 0

  const fluxoFiltrado = useMemo(() => {
    const receita = vendasPdv ? vendasPdv.filter(i => i.loja == filialFilter).filter(i => {
      const diff = (new Date() - new Date(i.horario)) / (86400000)
      return periodo === 'diario' ? diff <= 1 : periodo === 'semanal' ? diff <= 7 : diff <= 30
    }) : []
    const despesas1 = despesas ? despesas.filter(i => i.loja == filialFilter).filter(i => {
      const diff = (new Date() - new Date(i.data)) / (86400000)
      return periodo === 'diario' ? diff <= 1 : periodo === 'semanal' ? diff <= 7 : diff <= 30
    }) : []
    const fluxo = [...receita, ...despesas1].sort((a, b) => new Date(b.horario) - new Date(a.horario))
    console.log(receita, despesas1)
    return fluxo
  }, [fluxo, vendasPdv, periodo])

  const resumoFluxo = fluxoFiltrado.reduce((acc, i) => {
    i.tipo === 'receita' ? acc.entradas += i.valor : acc.saidas += i.valor
    acc.saldo = acc.entradas - acc.saidas
    return acc
  }, { entradas: 0, saidas: 0, saldo: 0 })

  const handleTransacao = () => {
    const val = parseFloat(formTrans.valor)
    const nomeFilial = filiais.find(f => f.id === formTrans.filialId)?.nome || "N/A"

    setFiliais(prev => prev.map(f => f.id === formTrans.filialId ? {
      ...f, receita: formTrans.tipo === "receita" ? f.receita + val : f.receita,
      despesas: formTrans.tipo === "despesa" ? f.despesas + val : f.despesas
    } : f))

    setFluxo(prev => [...prev, { id: Date.now(), filial: nomeFilial, data: getToday(), tipo: formTrans.tipo, valor: val, descricao: formTrans.descricao }])
    toggle('transacao', false); setFormTrans({ filialId: "", tipo: "receita", valor: "", descricao: "" })
  }

  const nome = (id) => lojas ? lojas.find((loja) => loja.id == id).nome : null

  const handlePagar = () => {
    fetch("http://localhost:8080/contas", {
      method: "post",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(formPagar),
    })
      .then((res) => {
        if (!res.ok) {
          return alert("Houve um erro");
        }
        return res.json()
      })
      .then((data) => {
        setContas(prev => [...prev, { id: data.criado, loja: formPagar.filialId, ...formPagar, preco: parseFloat(formPagar.valor), estado: "pendente" }])
      })
    toggle('pagar', false); setFormPagar({ filialId: "", tipo: "Fornecedor", descricao: "", valor: "", vencimento: "" })
  }

  const handleBaixarConta = (id) => {
    const conta = contas.find(c => c.id === id);
    if (!conta) return;
    const atualizada = { ...conta, estado: "pago" };
    fetch(`http://localhost:8080/contas/${id}`, {
      method: "put",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(atualizada),
    })
      .then((res) => {
        if (!res.ok) {
          return alert("Houve um erro");
        }
        return res.json();
      });
    fetch('http://localhost:8080/despesas', {
      method: "post",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        loja: conta.loja,
        valor: conta.preco,
        data: new Date().toISOString().slice(0, 10),
        descricao: conta.descricao,
        tipo: 'entrada'
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return alert("Houve um erro");
        }
        return res.json();
      });
    setContas(prev => prev.map(c => c.id === id ? { ...c, estado: "pago" } : c))
    setFiliais(prev => prev.map(f => f.nome === conta.filialId ? { ...f, despesas: f.despesas + conta.valor } : f))
    setFluxo(prev => [...prev, { id: Date.now(), filial: conta.filialId, data: getToday(), tipo: "despesa", valor: conta.valor, descricao: `Pgto: ${conta.descricao}` }])
  }

  const receita = (id) => {
    if (receita.length > 0) {
      const tranferenciaLoja = vendasPdv ? vendasPdv.filter((transferencia) => transferencia.loja == id) : null
      const total = tranferenciaLoja ? tranferenciaLoja.reduce((sum, item) => {
        return sum + item.preco * item.quantidade_produto;
      }, 0)
        : 0
      return formatCurrency(total)
    }
    else {
      return formatCurrency(0)
    }
  }

  const despesa = (id) => {
    if (despesas != []) {
      const despesaLoja = despesas.filter((despesa) => despesa.loja == id);
      const total = despesaLoja.reduce((sum, item) => {
        return sum + item.valor;
      }, 0);
      return formatCurrency(total);
    }
    else {
      return formatCurrency(0);
    }
  }



  const despesasTotaisFilial = despesasFiltradas ? despesasFiltradas.reduce((sum, f) => sum + f.valor, 0) : 0;

  const saldoFilial = despesasFiltradas && receitasFiltradas ? receitasFiltradas.reduce((sum, f) => sum + f.preco * f.quantidade_produto, 0) - despesasFiltradas.reduce((sum, f) => sum + f.valor, 0) : 0

  const receitaTotalFilial = receitasFiltradas ? receitasFiltradas.reduce((sum, f) => sum + f.preco * f.quantidade_produto, 0) : 0

  const despesasTotais = despesas ? despesas.reduce((sum, f) => sum + f.valor, 0) : 0;

  const saldo = despesas && vendasPdv ? vendasPdv.reduce((sum, f) => sum + f.preco * f.quantidade_produto, 0) - despesas.reduce((sum, f) => sum + f.valor, 0) : 0

  const receitaTotal = vendasPdv ? vendasPdv.reduce((sum, f) => sum + f.preco * f.quantidade_produto, 0) : 0

  const exportPDF = (filial) => {
    const msPerDay = 86400000;
    const now = new Date();

    // 2. Filter Revenue (Vendas)
    const receita = vendasPdv
      ? vendasPdv.filter(i => {
        // Check Store ID
        if (i.loja != filialFilter) return false;

        // Check Date
        const diff = (now - new Date(i.horario)) / msPerDay;
        return periodo === 'diario' ? diff <= 1 : periodo === 'semanal' ? diff <= 7 : diff <= 30;
      })
      : [];

    // 3. Filter Expenses (Despesas)
    const despesasFiltradas = despesas
      ? despesas.filter(i => {
        // Check Store ID
        if (i.loja != filialFilter) return false;

        // Check Date (NOTE: using i.data here)
        const diff = (now - new Date(i.data)) / msPerDay;
        return periodo === 'diario' ? diff <= 1 : periodo === 'semanal' ? diff <= 7 : diff <= 30;
      })
      : [];

    // 4. Merge and Sort (THE FIX IS HERE)
    const fluxo = [...receita, ...despesasFiltradas].sort((a, b) => {
      // We use || (OR) to grab the date from whichever field exists
      const dateA = new Date(a.horario || a.data);
      const dateB = new Date(b.horario || b.data);

      return dateB - dateA; // Descending (Newest first)
    });
    const doc = new jsPDF(); doc.text(`Fluxo - ${cashFlowFilial}`, 14, 20)
    autoTable(doc, { startY: 30, head: [["Métrica", "Valor"]], body: [["Receita", formatCurrency(receitaTotalFilial)], ["Saldo", formatCurrency(receitaTotalFilial - despesasTotaisFilial)]] })
    doc.save(`relatorio_${filial.nome}.pdf`)
  }

  const exportFluxoPDF = () => {
    const msPerDay = 86400000;
    const now = new Date();

    // --- STEP 1: Filter Raw Sales Data ---
    const rawVendas = vendasPdv
      ? vendasPdv.filter(i => {
        if (i.loja != filialFilter) return false;
        const diff = (now - new Date(i.horario)) / msPerDay;
        return periodo === 'diario' ? diff <= 1 : periodo === 'semanal' ? diff <= 7 : diff <= 30;
      })
      : [];

    // --- STEP 2: Group Sales by 'cart_id' ---
    const vendasAgrupadasObj = rawVendas.reduce((acc, item) => {
      const id = item.cart_id;

      if (!acc[id]) {
        // A. First time seeing this Cart ID: Create the main object
        acc[id] = {
          ...item, // Copy date, store, payment info, etc.
          preco: Number(item.preco), // Initialize Total Price
          preco_total: 0,
          itens: [{
            produto: item.produto,
            quantidade: item.quantidade_produto,
            preco_item: item.preco
          }]
        };
      } else {
        // B. Cart ID exists: Update the totals
        acc[id].preco += Number(item.preco); // Sum the price
        // Add this specific product to the list
        acc[id].itens.push({
          produto: item.produto,
          quantidade: item.quantidade_produto,
          preco_item: item.preco
        });
      }
      acc[id].preco_total += item.preco * item.quantidade_produto;
      return acc;
    }, {});

    // Convert the Object back to an Array
    const receita = Object.values(vendasAgrupadasObj);


    // --- STEP 3: Filter Expenses (Same as before) ---
    const despesasFiltradas = despesas
      ? despesas.filter(i => {
        if (i.loja != filialFilter) return false;
        const diff = (now - new Date(i.data)) / msPerDay;
        return periodo === 'diario' ? diff <= 1 : periodo === 'semanal' ? diff <= 7 : diff <= 30;
      })
      : [];


    // --- STEP 4: Merge and Sort ---
    const fluxo = [...receita, ...despesasFiltradas].sort((a, b) => {
      const dateA = new Date(a.horario || a.data);
      const dateB = new Date(b.horario || b.data);

      return dateB - dateA; // Newest First
    });

    const doc = new jsPDF(); doc.text(`Fluxo - ${cashFlowFilial}`, 14, 20)
    produtos ? autoTable(doc, { startY: 30, head: [["Data", "Tipo", "Desc", "Valor"]], body: fluxo.map(i => [formatShortDate(i.horario || i.data), i.id ? "Entrada" : "Saída", i.id ? `Compra de ${i.itens.map(p => `${p.quantidade}x ${produtos.find((f) => f.id == p.produto).nome}`).join(', ')}` : i.descricao, formatCurrency(i.id ? i.preco_total : i.valor)]), headStyles: { fillColor: [32, 83, 42] } }) : null
    doc.save(`fluxo_${cashFlowFilial}.pdf`)
  }

  const achar_filial = (filial) => {
    if (produtos) {
      const produtosFilial = produtos.filter((produto) => produto.filial == filial)
      if (produtosFilial.length > 0) {
        setFilialSel(produtosFilial);
      }
      else {
        setFilialSel("");
      }
    }
  }

  const filialFluxo = useMemo(() => {
    // 1. If no filter is selected, return empty immediately
    if (!filialFilter) return [];

    const msPerDay = 86400000;
    const now = new Date();

    // 2. Filter Sales (Time & Store)
    const rawVendas = vendasPdv
      ? vendasPdv.filter(i => {
        if (i.loja != filialFilter) return false;
        const diff = (now - new Date(i.horario)) / msPerDay;
        return periodo === 'diario' ? diff <= 1 : periodo === 'semanal' ? diff <= 7 : diff <= 30;
      })
      : [];

    // 3. Group Sales by Cart ID
    const vendasAgrupadasObj = rawVendas.reduce((acc, item) => {
      const id = item.cart_id;

      if (!acc[id]) {
        acc[id] = {
          ...item,
          preco: Number(item.preco), // Start Total Price
          itens: [{
            produto: item.produto,
            quantidade: item.quantidade_produto,
            preco_item: item.preco
          }]
        };
      } else {
        acc[id].preco += Number(item.preco); // Add to Total Price
        acc[id].itens.push({
          produto: item.produto,
          quantidade: item.quantidade_produto,
          preco_item: item.preco
        });
      }
      return acc;
    }, {});

    const receita = Object.values(vendasAgrupadasObj);

    // 4. Filter Expenses
    const despesasFiltradas = despesas
      ? despesas.filter(i => {
        if (i.loja != filialFilter) return false;
        const diff = (now - new Date(i.data)) / msPerDay;
        return periodo === 'diario' ? diff <= 1 : periodo === 'semanal' ? diff <= 7 : diff <= 30;
      })
      : [];

    // 5. Merge and Sort
    return [...receita, ...despesasFiltradas].sort((a, b) => {
      const dateA = new Date(a.horario || a.data);
      const dateB = new Date(b.horario || b.data);
      return dateB - dateA;
    });

  }, [filialFilter, vendasPdv, despesas, periodo]);


  function isThisWeek(dateString) {
    const today = new Date();
    const date = new Date(dateString);

    // Get the day number (0 = Sunday, 1 = Monday, ...)
    const dayOfWeek = today.getDay();

    // Calculate the start of the week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    // End of week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return date >= startOfWeek && date <= endOfWeek;
  }

  function isThisMonth(dateString) {
    const today = new Date();
    const date = new Date(dateString);

    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">Financeiro</h1>
            <p className="mt-2 text-sm text-muted-foreground lg:text-base">Visão geral do desempenho financeiro das filiais</p>
          </div>

          <div className="flex gap-3">
            {/*  botão lançar conta para pagar*/}
            <Dialog open={modais.pagar} onOpenChange={(v) => toggle('pagar', v)}>
              <DialogTrigger asChild>
                <Button variant="secondary" className={`gap-2 border border-border ${BG_CONTA_PAGAR_BUTTON} hover:bg-[#102A16] text-white`}>
                  <Banknote className="h-4 w-4" /> Lançar Conta a Pagar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Lançar Conta a Pagar</DialogTitle>
                  <DialogDescription>Registre uma despesa futura.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="loja">Loja</Label>
                    <Select
                      value={formPagar.filialId}
                      onValueChange={(value) =>
                        setFormPagar({ ...formPagar, filialId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma loja" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {lojas
                          ? lojas.map((loja) => (
                            <SelectItem key={loja.id} value={loja.id}>
                              {loja.nome}
                            </SelectItem>
                          ))
                          : null}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={formPagar.tipo} onValueChange={(v) => setFormPagar({ ...formPagar, tipo: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                      <SelectContent><SelectItem value="Fornecedor">Fornecedor</SelectItem><SelectItem value="Salário">Salário</SelectItem><SelectItem value="Aluguel">Aluguel</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input placeholder="Ex: Pagamento X" value={formPagar.descricao} onChange={(e) => setFormPagar({ ...formPagar, descricao: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Valor (R$)</Label>
                      <Input type="number" placeholder="0.00" value={formPagar.valor} onChange={(e) => setFormPagar({ ...formPagar, valor: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Vencimento</Label>
                      <Input type="date" value={formPagar.vencimento} onChange={(e) => setFormPagar({ ...formPagar, vencimento: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => toggle('pagar', false)}>Cancelar</Button>
                  <Button onClick={handlePagar}>Lançar Conta</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* botão de fluxo de caixa */}
            <Dialog open={modais.report} onOpenChange={(v) => toggle('report', v)}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border border-border bg-[#1B8742] text-primary-foreground hover:bg-[#146C34]">
                  <Clock className="h-4 w-4" /> Fluxo de Caixa
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-4xl w-full max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Relatório de Fluxo de Caixa</DialogTitle>
                  <DialogDescription>Visão detalhada de entradas e saídas.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4 flex-1 overflow-y-auto pr-2">

                  {/* Filtros e Botão */}
                  <div className="flex gap-4 items-end">
                    <div className="space-y-2 w-2/3">
                      <Label>Filial</Label>
                      <Select
                        value={filialFilter}
                        onValueChange={setFilialFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma loja" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {lojas
                            ? lojas.map((loja) => (
                              <SelectItem key={loja.id} value={loja.id}>
                                {loja.nome}
                              </SelectItem>
                            ))
                            : null}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 w-1/3">
                      <Label>Período</Label>
                      <Select value={periodo} onValueChange={setPeriodo}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diario">Diário</SelectItem>
                          <SelectItem value="semanal">Semanal</SelectItem>
                          <SelectItem value="mensal">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="gap-2 w-1/3" onClick={exportFluxoPDF}>
                      <Download className="h-4 w-4" /> Baixar PDF
                    </Button>
                  </div>

                  {/* Cards de Resumo */}
                  <div className="grid grid-cols-3 gap-4">

                    <Card className={`border-l-4 ${BORDER_RECEITA} bg-card shadow-sm`}>
                      <CardHeader className="pb-1 pt-3"><CardTitle className="text-sm font-medium text-muted-foreground">Entradas</CardTitle></CardHeader>
                      <CardContent className="pb-3"><p className={`text-2xl font-bold ${COLOR_RECEITA}`}>{formatCurrency(receitaTotalFilial)}</p></CardContent>
                    </Card>
                    <Card className={`border-l-4 ${BORDER_DESPESAS} bg-card shadow-sm`}>
                      <CardHeader className="pb-1 pt-3"><CardTitle className="text-sm font-medium text-muted-foreground">Saídas</CardTitle></CardHeader>
                      <CardContent className="pb-3"><p className={`text-2xl font-bold ${COLOR_DESPESAS}`}>{formatCurrency(despesasTotaisFilial)}</p></CardContent>
                    </Card>
                    <Card className={`border-l-4 ${BORDER_SALDO} bg-card shadow-sm`}>
                      <CardHeader className="pb-1 pt-3"><CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle></CardHeader>
                      <CardContent className="pb-3"><p className={`text-2xl font-bold ${COLOR_SALDO}`}>{formatCurrency(saldoFilial)}</p></CardContent>
                    </Card>
                  </div>
                  <div className="border rounded-lg w-full">
                    <table className="w-full table-auto text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/20">
                          <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-3">Data</th>
                          <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-3">Tipo</th>
                          <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-3 w-1/2">Descrição</th>
                          <th className="text-right text-xs font-semibold text-muted-foreground py-2 px-3 pr-4">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          filialFluxo ?
                            filialFluxo.map((fluxo, index) => {
                              return (
                                <tr key={index}>
                                  <td className="py-1 px-3 font-medium whitespace-nowrap">{fluxo.id ? new Date(fluxo.horario).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : new Date(fluxo.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                  <td className={`py-1 px-3  COLOR_RECEITA : COLOR_DESPESAS} font-medium`}>
                                    {fluxo.checkid ? "Saída" : "Entrada"}
                                  </td>
                                  <td className="py-1 px-3 truncate max-w-[200px]" >{fluxo.checkid ? "Despesa" : "Venda"}</td>
                                  <td className={`py-1 px-3 pr-4 text-right COLOR_RECEITA : COLOR_DESPESAS} font-semibold whitespace-nowrap`}>
                                    {fluxo.valor ? formatCurrency(fluxo.valor) : formatCurrency(fluxo.preco)}
                                  </td>
                                </tr>
                              )
                            })
                            : (<tr>
                              <td className="py-1 px-3 truncate max-w-[200px]" >Não há nada aqui</td>
                            </tr>)
                        }
                        {/* <tr className="border-b border-border last:border-b-0 hover:bg-muted/50 transition">
                          <td className="py-1 px-3 font-medium whitespace-nowrap">Placeholder</td>
                          <td className={`py-1 px-3  COLOR_RECEITA : COLOR_DESPESAS} font-medium`}>
                            {formatCurrency(0)}
                          </td>
                          <td className="py-1 px-3 truncate max-w-[200px]" >Placeholder</td>
                          <td className={`py-1 px-3 pr-4 text-right COLOR_RECEITA : COLOR_DESPESAS} font-semibold whitespace-nowrap`}>
                            {formatCurrency(0)}
                          </td>
                        </tr> */}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t mt-auto">
                  <Button variant="outline" onClick={() => toggle('report', false)}>Fechar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/*cards dashboard */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { titulo: "Vendas do PDV", valor: receitaTotal, icon: DollarSign, color: COLOR_RECEITA, border: BORDER_RECEITA },
            { titulo: "Despesas Totais", valor: despesasTotais, icon: TrendingDown, color: COLOR_DESPESAS, border: BORDER_DESPESAS },
            { titulo: "Saldo da Empresa", valor: saldo, icon: FlaskConical, color: COLOR_SALDO, border: BORDER_SALDO },
            { titulo: "Contas a Pagar", valor: valorPendente, icon: Banknote, color: COLOR_CONTA_PAGAR, border: BORDER_CONTA_PAGAR },
          ].map((item, i) => (
            <Card key={i} className={`border-l-4 ${item.border} bg-card shadow-lg`}>
              <CardHeader className="pb-3 flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-muted-foreground">{item.titulo}</CardTitle>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </CardHeader>
              <CardContent><p className={`text-2xl font-bold ${item.color}`}>{formatCurrency(item.valor)}</p></CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card shadow-lg">
          <CardHeader><CardTitle className="text-xl font-bold">Análise Financeira por Filial</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto min-w-[600px]">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3 px-2">Filial</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3">Receita</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3">Despesas</th>
                    <th className="text-center text-sm font-semibold text-muted-foreground py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {lojas ?
                    lojas.map((filial) => (
                      <tr key={filial.id} className="border-b border-border last:border-b-0 hover:bg-muted/50 transition text-sm">
                        <td className="py-3 px-2 font-medium">{filial.nome}</td>
                        <td className={`py-3 ${COLOR_RECEITA}`}>{receita(filial.id)}</td>
                        <td className={`py-3 ${COLOR_DESPESAS}`}>{despesa(filial.id)}</td>
                        <td className="py-3 flex items-center justify-center gap-2">
                          <Button size="icon" variant="ghost" title="Detalhes" onClick={() => { achar_filial(filial.id); toggle('detalhes', true) }}>
                            <Eye className={`h-4 w-4 ${COLOR_SALDO}`} />
                          </Button>
                          <Button size="icon" variant="ghost" title="Baixar relatório" onClick={() => { 
                            setFilialFilter(filial.id)
                            exportPDF(filial) }}>
                            <Download className={`h-4 w-4 ${COLOR_RECEITA}`} />
                          </Button>
                        </td>
                      </tr>
                    ))
                    : (<tr>
                      <td>
                        N/A
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Banknote className={`h-5 w-5 ${COLOR_CONTA_PAGAR}`} /> Contas a Pagar Pendentes
            </CardTitle>
            <p className="text-sm text-muted-foreground">Controle de fornecedores e despesas.</p>
          </CardHeader>
          <CardContent>
            {
              contasPendentes ?
                contasPendentes.length === 0 ? (
                  <p className="text-center text-muted-foreground p-4">Nenhuma conta pendente!</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto min-w-[700px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/20">
                          <th className="text-left text-sm font-semibold text-muted-foreground py-3 px-2">Filial</th>
                          <th className="text-left text-sm font-semibold text-muted-foreground py-3">Desc</th>
                          <th className="text-left text-sm font-semibold text-muted-foreground py-3">Valor</th>
                          <th className="text-left text-sm font-semibold text-muted-foreground py-3">Vencimento</th>
                          <th className="text-center text-sm font-semibold text-muted-foreground py-3">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contasPendentes.map((conta) => (
                          <tr key={conta.id} className="border-b border-border text-sm hover:bg-muted/50">
                            <td className="py-3 px-2 font-medium">{nome(conta.loja)}</td>
                            <td className="py-3">{conta.descricao}</td>
                            <td className={`py-3 ${COLOR_DESPESAS} font-semibold`}>{formatCurrency(conta.preco)}</td>
                            <td className="py-3">{formatShortDate(conta.vencimento)}</td>
                            <td className="py-3 flex items-center justify-center">
                              <Button size="sm" className={`${BG_PAGAR_BUTTON} hover:bg-[#07381C] text-white gap-1`} onClick={() => handleBaixarConta(conta.id)}>
                                <CheckCircle className="h-4 w-4" /> Pagar
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
                : null
            }
          </CardContent>
        </Card>

        {/*registros de venda do pdv*/}
        <div className="bg-card gap-6 rounded-xl border shadow-lg py-card p-0">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-row items-center gap-3 p-2">
              <Receipt className={`h-5 w-5 ${COLOR_RECEITA}`} /><h1 className="text-2xl font-bold">Histórico de Vendas PDV</h1>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <VendasTable vendasPdv={vendasPdv} formatCurrency={formatCurrency} COLOR_RECEITA={COLOR_RECEITA} />
            </div>
          </div>
        </div>

        {/*Modal Detalhes Estoque */}
        <Dialog open={modais.detalhes} onOpenChange={(v) => toggle('detalhes', v)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Estoque e Preços</DialogTitle></DialogHeader>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full table-auto text-sm text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="py-2 px-2 font-semibold text-muted-foreground">Produto</th>
                    <th className="py-2 font-semibold text-muted-foreground">Quantidade</th>
                    <th className="py-2 font-semibold text-muted-foreground">Preço Unitário (R$)</th>
                    <th className="py-2 font-semibold text-muted-foreground">Total (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {filialSel ? filialSel.map(p => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="py-2 px-2 font-medium">{p.nome}</td>
                      <td className="py-2">{p.quantidade}</td>
                      <td className="py-2">{formatCurrency(p.preco)}</td>
                      <td className={`py-2 font-bold ${COLOR_SALDO}`}>
                        {formatCurrency(p.preco * p.quantidade)}
                      </td>
                    </tr>
                  )) : (
                    <tr className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="py-2 px-2 font-medium">
                        Não há produtos
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

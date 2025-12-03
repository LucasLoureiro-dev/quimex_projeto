"use client"
 
import { useState, useMemo } from "react"
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
 
const CONTAS_INICIAL = [
  { id: 1, filial: "Quimex SP", tipo: "Salário", descricao: "Salários Mês", valor: 150000, vencimento: "2024-12-05", pago: false },
  { id: 2, filial: "Quimex RJ", tipo: "Fornecedor", descricao: "Compra Metanol", valor: 250000, vencimento: "2024-11-30", pago: false },
]
 
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
  const [filiais, setFiliais] = useState(DADOS_FILIAIS)
  const [fluxo, setFluxo] = useState(FLUXO_INICIAL)
  const [contas, setContas] = useState(CONTAS_INICIAL)
  const [vendasPdv, setVendasPdv] = useState(VENDAS_PDV_INICIAL) // Novo estado para vendas PDV
 
  // Controle de Modais
  const [modais, setModais] = useState({ pagar: false, report: false, transacao: false, detalhes: false })
  const toggle = (modal, state) => setModais(p => ({ ...p, [modal]: state }))
 
  // Estados de Filtro e Seleção
  const [filialSel, setFilialSel] = useState(null)
  const [cashFlowFilial, setCashFlowFilial] = useState(filiais[0].nome)
  const [periodo, setPeriodo] = useState("diario")
 
  // Formulários
  const [formPagar, setFormPagar] = useState({ filialId: "", tipo: "Fornecedor", descricao: "", valor: "", vencimento: "" })
  const [formTrans, setFormTrans] = useState({ filialId: "", tipo: "receita", valor: "", descricao: "" })
 
  //  LÓGICA DE NEGÓCIO
  const totais = useMemo(() => filiais.reduce((acc, f) => ({
    receita: acc.receita + f.receita,
    despesas: acc.despesas + f.despesas,
    saldo: acc.saldo + (f.receita - f.despesas)
  }), { receita: 0, despesas: 0, saldo: 0 }), [filiais])
 
  const contasPendentes = useMemo(() => contas.filter(c => !c.pago), [contas])
  const valorPendente = contasPendentes.reduce((acc, c) => acc + c.valor, 0)
 
  const fluxoFiltrado = useMemo(() => {
    return fluxo.filter(i => i.filial === cashFlowFilial).filter(i => {
      const diff = (new Date() - new Date(i.data)) / (86400000)
      return periodo === 'diario' ? diff <= 1 : periodo === 'semanal' ? diff <= 7 : diff <= 30
    }).sort((a, b) => new Date(b.data) - new Date(a.data))
  }, [fluxo, cashFlowFilial, periodo])
 
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
 
  const handlePagar = () => {
    const nomeFilial = filiais.find(f => f.id === formPagar.filialId)?.nome || "N/A"
    setContas(prev => [...prev, { id: Date.now(), filial: nomeFilial, ...formPagar, valor: parseFloat(formPagar.valor), pago: false }])
    toggle('pagar', false); setFormPagar({ filialId: "", tipo: "Fornecedor", descricao: "", valor: "", vencimento: "" })
  }
 
  const handleBaixarConta = (id) => {
    const conta = contas.find(c => c.id === id)
    if (!conta) return
    setContas(prev => prev.map(c => c.id === id ? { ...c, pago: true } : c))
    setFiliais(prev => prev.map(f => f.nome === conta.filial ? { ...f, despesas: f.despesas + conta.valor } : f))
    setFluxo(prev => [...prev, { id: Date.now(), filial: conta.filial, data: getToday(), tipo: "despesa", valor: conta.valor, descricao: `Pgto: ${conta.descricao}` }])
  }
 
  const exportPDF = (filial) => {
    const doc = new jsPDF(); doc.text(`Relatório ${filial.nome}`, 14, 20)
    autoTable(doc, { startY: 30, head: [["Métrica", "Valor"]], body: [["Receita", formatCurrency(filial.receita)], ["Saldo", formatCurrency(filial.receita - filial.despesas)]] })
    doc.save(`relatorio_${filial.nome}.pdf`)
  }
 
  const exportFluxoPDF = () => {
    const doc = new jsPDF(); doc.text(`Fluxo - ${cashFlowFilial}`, 14, 20)
    autoTable(doc, { startY: 30, head: [["Data", "Tipo", "Desc", "Valor"]], body: fluxoFiltrado.map(i => [formatShortDate(i.data), i.tipo, i.descricao, formatCurrency(i.valor)]), headStyles: { fillColor: [32, 83, 42] } })
    doc.save(`fluxo_${cashFlowFilial}.pdf`)
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
                    <Label>Filial</Label>
                    <Select value={formPagar.filialId} onValueChange={(v) => setFormPagar({ ...formPagar, filialId: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione a filial" /></SelectTrigger>
                      <SelectContent>{filiais.map((f) => (<SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>))}</SelectContent>
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
                    <div className="space-y-2 w-1/3">
                      <Label>Filial</Label>
                      <Select value={cashFlowFilial} onValueChange={setCashFlowFilial}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {filiais.map((f) => (<SelectItem key={f.id} value={f.nome}>{f.nome}</SelectItem>))}
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
                      <CardContent className="pb-3"><p className={`text-2xl font-bold ${COLOR_RECEITA}`}>{formatCurrency(resumoFluxo.entradas)}</p></CardContent>
                    </Card>
                    <Card className={`border-l-4 ${BORDER_DESPESAS} bg-card shadow-sm`}>
                      <CardHeader className="pb-1 pt-3"><CardTitle className="text-sm font-medium text-muted-foreground">Saídas</CardTitle></CardHeader>
                      <CardContent className="pb-3"><p className={`text-2xl font-bold ${COLOR_DESPESAS}`}>{formatCurrency(resumoFluxo.saidas)}</p></CardContent>
                    </Card>
                    <Card className={`border-l-4 ${BORDER_SALDO} bg-card shadow-sm`}>
                      <CardHeader className="pb-1 pt-3"><CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle></CardHeader>
                      <CardContent className="pb-3"><p className={`text-2xl font-bold ${COLOR_SALDO}`}>{formatCurrency(resumoFluxo.saldo)}</p></CardContent>
                    </Card>
                  </div>
 
                  <div className="border rounded-lg w-full">
                    <table className="w-full table-auto text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/20">
                          <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-3">Data</th>
                          <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-3">Tipo</th>
                          <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-3 w-1/2">Descrição</th> {/* Dei mais espaço pra descrição */}
                          <th className="text-right text-xs font-semibold text-muted-foreground py-2 px-3 pr-4">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fluxoFiltrado.map((item) => (
                          <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-muted/50 transition">
                            <td className="py-1 px-3 font-medium whitespace-nowrap">{formatShortDate(item.data)}</td>
                            <td className={`py-1 px-3 ${item.tipo === 'receita' ? COLOR_RECEITA : COLOR_DESPESAS} font-medium`}>
                              {item.tipo === 'receita' ? 'Entrada' : 'Saída'}
                            </td>
                            <td className="py-1 px-3 truncate max-w-[200px]" title={item.descricao}>{item.descricao}</td>
                            <td className={`py-1 px-3 pr-4 text-right ${item.tipo === 'receita' ? COLOR_RECEITA : COLOR_DESPESAS} font-semibold whitespace-nowrap`}>
                              {formatCurrency(item.valor)}
                            </td>
                          </tr>
                        ))}
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
            { titulo: "Vendas do PDV", valor: totais.receita, icon: DollarSign, color: COLOR_RECEITA, border: BORDER_RECEITA },
            { titulo: "Despesas Totais", valor: totais.despesas, icon: TrendingDown, color: COLOR_DESPESAS, border: BORDER_DESPESAS },
            { titulo: "Saldo da Empresa", valor: totais.saldo, icon: FlaskConical, color: COLOR_SALDO, border: BORDER_SALDO },
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
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Banknote className={`h-5 w-5 ${COLOR_CONTA_PAGAR}`} /> Contas a Pagar Pendentes
            </CardTitle>
            <p className="text-sm text-muted-foreground">Controle de fornecedores e despesas.</p>
          </CardHeader>
          <CardContent>
            {contasPendentes.length === 0 ? (
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
                        <td className="py-3 px-2 font-medium">{conta.filial}</td>
                        <td className="py-3">{conta.descricao}</td>
                        <td className={`py-3 ${COLOR_DESPESAS} font-semibold`}>{formatCurrency(conta.valor)}</td>
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
            )}
          </CardContent>
        </Card>
 
        {/*registros de venda do pdv*/}
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Receipt className={`h-5 w-5 ${COLOR_RECEITA}`} /> Histórico de Vendas PDV
            </CardTitle>
            <p className="text-sm text-muted-foreground">Registro automático de todas as vendas realizadas no PDV.</p>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3 px-2">Nº Venda</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3">Itens Vendidos</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3">Valor</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3">Pagamento</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3">Horário</th>
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3">Operador</th>
                  </tr>
                </thead>
                <tbody>
                  {vendasPdv.map((venda) => (
                    <tr key={venda.id} className="border-b border-border text-sm hover:bg-muted/50">
                      <td className="py-3 px-2 font-medium">#{venda.id}</td>
                      <td className="py-3 truncate max-w-[150px] md:max-w-[250px]" title={venda.itens}>
                        {venda.itens}
                      </td>
                      <td className={`py-3 ${COLOR_RECEITA} font-semibold`}>{formatCurrency(venda.valor)}</td>
                      <td className="py-3">
                        <span className="px-2 py-1 rounded-full bg-muted text-xs font-medium whitespace-nowrap">
                          {venda.pagamento}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {venda.horario}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <User className="h-3 w-3 text-muted-foreground" />
                          {venda.operador}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
       
        {/*Modal Detalhes Estoque */}
        <Dialog open={modais.detalhes} onOpenChange={(v) => toggle('detalhes', v)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{filialSel?.nome} - Estoque e Preços</DialogTitle></DialogHeader>
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
                  {(PRODUTOS_POR_FILIAL[filialSel?.nome] || []).map(p => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="py-2 px-2 font-medium">{p.nome}</td>
                      <td className="py-2">{p.quantidade}</td>
                      <td className="py-2">{formatCurrency(p.preco)}</td>
                      <td className={`py-2 font-bold ${COLOR_SALDO}`}>
                        {formatCurrency(p.preco * p.quantidade)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
 
      </div>
    </div>
  )
}
 
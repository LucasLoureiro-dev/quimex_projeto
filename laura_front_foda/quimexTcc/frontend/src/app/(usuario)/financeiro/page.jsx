"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MaskedInput } from '@/components/ui/masked-input';
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingDown,
  DollarSign,
  Plus,
  Download,
  Eye,
  FlaskConical,
  Banknote,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const COLOR_RECEITA = "text-[#0F703A]";
const COLOR_DESPESAS = "text-[#20532A]";
const COLOR_SALDO = "text-[#279D49]";
const COLOR_CONTA_PAGAR = "text-[#20532A]";
const BORDER_RECEITA = "border-l-[#0F703A]";
const BORDER_DESPESAS = "border-l-[#20532A]";
const BORDER_SALDO = "border-l-[#279D49]";
const BORDER_CONTA_PAGAR = "border-l-[#20532A]";
const BG_PRINCIPAL = "bg-[#1B8742]";
const BG_CONTA_PAGAR_BUTTON = "bg-[#20532A]";
const BG_PAGAR_BUTTON = "bg-[#0F703A]";

const DADOS_FILIAIS = [
  { id: "1", nome: "Quimex SP", receita: 2850000, despesas: 1950000 },
  { id: "2", nome: "Quimex RJ", receita: 1950000, despesas: 1400000 },
  { id: "3", nome: "Quimex MG", receita: 1650000, despesas: 1200000 },
  { id: "5", nome: "Quimex RS", receita: 2100000, despesas: 1500000 },
];

const FLUXO_DE_CAIXA_INICIAL = [
  {
    id: 1,
    filial: "Quimex SP",
    data: "2024-11-12",
    tipo: "receita",
    valor: 80000,
    descricao: "Venda Lote #SP125",
  },
  {
    id: 2,
    filial: "Quimex RJ",
    data: "2024-11-10",
    tipo: "receita",
    valor: 90000,
    descricao: "Venda Lote #RJ001",
  },
  {
    id: 3,
    filial: "Quimex SP",
    data: "2024-11-11",
    tipo: "despesa",
    valor: 50000,
    descricao: "Pagamento Fornecedor A",
  },
];

const CONTAS_A_PAGAR_INICIAL = [
  {
    id: 1,
    filial: "Quimex SP",
    tipo: "Salário",
    descricao: "Salários Mês Atual",
    valor: 150000,
    vencimento: "2024-12-05",
    pago: false,
  },
  {
    id: 2,
    filial: "Quimex RJ",
    tipo: "Fornecedor",
    descricao: "Compra de Metanol",
    valor: 250000,
    vencimento: "2024-11-30",
    pago: false,
  },
  {
    id: 3,
    filial: "Quimex MG",
    tipo: "Aluguel",
    descricao: "Aluguel Armazém",
    valor: 35000,
    vencimento: "2024-12-10",
    pago: false,
  },
];

const PRODUTOS_POR_FILIAL = {
  "Quimex SP": [
    { id: 1, nome: "Ácido Sulfúrico", quantidade: 120, preco: 850 },
    { id: 2, nome: "Hidróxido de Sódio", quantidade: 90, preco: 650 },
  ],
  "Quimex RJ": [{ id: 1, nome: "Ácido Nítrico", quantidade: 80, preco: 900 }],
};

const formatCurrency = (value) => {
  if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(2)}M`;
  return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
};

const formatShortDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR").format(date);
};

const getTodayDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function FinancialDashboard() {
  const [filiais, setFiliais] = useState(DADOS_FILIAIS);
  const [fluxoDeCaixa, setFluxoDeCaixa] = useState(FLUXO_DE_CAIXA_INICIAL);
  const [contasAPagar, setContasAPagar] = useState(CONTAS_A_PAGAR_INICIAL);

  const [isPayableDialogOpen, setIsPayableDialogOpen] = useState(false);
  const [isCashFlowReportOpen, setIsCashFlowReportOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false);
  const [filialSelecionada, setFilialSelecionada] = useState(null);
  const [cashFlowFilial, setCashFlowFilial] = useState(filiais[0].nome);
  const [periodo, setPeriodo] = useState("diario");

  // Estados dos Formulários
  const [payableFormData, setPayableFormData] = useState({
    filialId: "",
    tipo: "Fornecedor",
    descricao: "",
    valor: "",
    vencimento: "",
  });

  const [formData, setFormData] = useState({
    filialId: "",
    tipo: "receita",
    valor: "",
    descricao: "",
  });

  const receitaTotal = filiais.reduce((acc, f) => acc + f.receita, 0);
  const despesasTotal = filiais.reduce((acc, f) => acc + f.despesas, 0);
  const saldoEmpresa = receitaTotal - despesasTotal;
  const contasPendentes = useMemo(
    () => contasAPagar.filter((c) => !c.pago),
    [contasAPagar]
  );
  const valorTotalPendente = contasPendentes.reduce(
    (acc, c) => acc + c.valor,
    0
  );

  const filteredCashFlow = useMemo(() => {
    return fluxoDeCaixa
      .filter((item) => item.filial === cashFlowFilial)
      .filter((item) => {
        const itemDate = new Date(item.data);
        const today = new Date();
        const timeDifference = today.getTime() - itemDate.getTime();
        const dayDifference = timeDifference / (1000 * 3600 * 24);

        switch (periodo) {
          case "diario":
            return dayDifference <= 1;
          case "semanal":
            return dayDifference <= 7;
          case "mensal":
            return dayDifference <= 30;
          default:
            return true;
        }
      })
      .sort((a, b) => new Date(b.data) - new Date(a.data));
  }, [fluxoDeCaixa, cashFlowFilial, periodo]);

  const resumoCashFlow = filteredCashFlow.reduce(
    (acc, item) => {
      if (item.tipo === "receita") acc.entradas += item.valor;
      else acc.saidas += item.valor;
      acc.saldo = acc.entradas - acc.saidas;
      return acc;
    },
    { entradas: 0, saidas: 0, saldo: 0 }
  );

  const handleAddTransaction = () => {
    const valor = parseFloat(formData.valor);
    const filialIndex = filiais.findIndex((f) => f.id === formData.filialId);
    const filialNome =
      filiais.find((f) => f.id === formData.filialId)?.nome || "Desconhecida";

    if (filialIndex !== -1) {
      const updatedFiliais = [...filiais];
      const filial = updatedFiliais[filialIndex];

      if (formData.tipo === "receita") filial.receita += valor;
      else filial.despesas += valor;

      setFiliais(updatedFiliais);

      const newCashFlowEntry = {
        id: fluxoDeCaixa.length + 1,
        filial: filialNome,
        data: getTodayDateString(),
        tipo: formData.tipo,
        valor: valor,
        descricao: formData.descricao,
      };
      setFluxoDeCaixa((prevFluxo) => [...prevFluxo, newCashFlowEntry]);
    }
    setIsDialogOpen(false);
    setFormData({ filialId: "", tipo: "receita", valor: "", descricao: "" });
  };

  const handleVisualizar = (filial) => {
    setFilialSelecionada(filial);
    setIsDetalhesOpen(true);
  };

  const handleAddPayable = () => {
    const valor = parseFloat(payableFormData.valor);
    const filialNome =
      filiais.find((f) => f.id === payableFormData.filialId)?.nome ||
      "Desconhecida";

    const newPayable = {
      id: contasAPagar.length + 1,
      filial: filialNome,
      tipo: payableFormData.tipo,
      descricao: payableFormData.descricao,
      valor: valor,
      vencimento: payableFormData.vencimento,
      pago: false,
    };

    setContasAPagar((prevContas) => [...prevContas, newPayable]);
    setIsPayableDialogOpen(false);
    setPayableFormData({
      filialId: "",
      tipo: "Fornecedor",
      descricao: "",
      valor: "",
      vencimento: "",
    });
  };

  const handleMarkAsPaid = (id) => {
    setContasAPagar((prevContas) => {
      const contaIndex = prevContas.findIndex((c) => c.id === id);
      if (contaIndex === -1 || prevContas[contaIndex].pago) return prevContas;

      const updatedContas = [...prevContas];
      const contaPaga = { ...updatedContas[contaIndex], pago: true };
      updatedContas[contaIndex] = contaPaga;

      const filialNome = contaPaga.filial;
      const valorPago = contaPaga.valor;

      setFiliais((prevFiliais) => {
        const updatedFiliais = [...prevFiliais];
        const filialIndex = updatedFiliais.findIndex(
          (f) => f.nome === filialNome
        );
        if (filialIndex !== -1)
          updatedFiliais[filialIndex].despesas += valorPago;
        return updatedFiliais;
      });

      const newCashFlowEntry = {
        id: fluxoDeCaixa.length + 1,
        filial: filialNome,
        data: getTodayDateString(),
        tipo: "despesa",
        valor: valorPago,
        descricao: `Pagamento: ${contaPaga.descricao}`,
      };
      setFluxoDeCaixa((prevFluxo) => [...prevFluxo, newCashFlowEntry]);

      return updatedContas;
    });
  };

  const handleDownloadReport = (filial) => {
    const doc = new jsPDF();
    doc.text(`Relatório Simples de ${filial.nome}`, 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Métrica", "Valor"]],
      body: [
        ["Receita", formatCurrency(filial.receita)],
        ["Despesas", formatCurrency(filial.despesas)],
        ["Saldo", formatCurrency(filial.receita - filial.despesas)],
      ],
      headStyles: { fillColor: [27, 135, 66] },
    });
    doc.save(`relatorio_${filial.nome.replace(/\s/g, "_")}.pdf`);
  };

  const handleDownloadCashFlow = () => {
    const doc = new jsPDF();
    doc.text(`Fluxo de Caixa Simples - ${cashFlowFilial}`, 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Data", "Tipo", "Descrição", "Valor"]],
      body: filteredCashFlow.map((item) => [
        formatShortDate(item.data),
        item.tipo === "receita" ? "Entrada (R)" : "Saída (D)",
        item.descricao,
        formatCurrency(item.valor),
      ]),
      headStyles: { fillColor: [32, 83, 42] },
    });
    doc.save(`fluxo_caixa_${cashFlowFilial}_${periodo}.pdf`);
  };

  const LancarContaAPagarDialog = () => (
    <Dialog open={isPayableDialogOpen} onOpenChange={setIsPayableDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className={`gap-2 border border-border ${BG_CONTA_PAGAR_BUTTON} hover:bg-[#102A16] text-white`}
        >
          <Banknote className="h-4 w-4" />
          Lançar Conta a Pagar
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Lançar Conta a Pagar</DialogTitle>
          <DialogDescription>
            Registre uma despesa futura (fornecedores, salários e despesas
            fixas).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Filial</Label>
            <Select
              value={payableFormData.filialId}
              onValueChange={(value) =>
                setPayableFormData({ ...payableFormData, filialId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a filial" />
              </SelectTrigger>
              <SelectContent>
                {filiais.map((filial) => (
                  <SelectItem key={filial.id} value={filial.id}>
                    {filial.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Despesa</Label>
            <Select
              value={payableFormData.tipo}
              onValueChange={(value) =>
                setPayableFormData({ ...payableFormData, tipo: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                <SelectItem value="Salário">Salário</SelectItem>
                <SelectItem value="Aluguel">Aluguel</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {payableFormData.tipo == "Fornecedor" && (
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <MaskedInput
                id="cnpj"
                mask="00.000.000/0000-00"
                value={formData.cnpj}
                onChange={(value) => setFormData({ ...formData, cnpj: value })}
                placeholder="00.000.000/0000-00"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              placeholder="Ex: Pagamento de fornecedor X"
              value={payableFormData.descricao}
              onChange={(e) =>
                setPayableFormData({
                  ...payableFormData,
                  descricao: e.target.value,
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={payableFormData.valor}
                onChange={(e) =>
                  setPayableFormData({
                    ...payableFormData,
                    valor: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Vencimento</Label>
              <Input
                type="date"
                value={payableFormData.vencimento}
                onChange={(e) =>
                  setPayableFormData({
                    ...payableFormData,
                    vencimento: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsPayableDialogOpen(false)}
          >
            Cancelar
          </Button>
          <Button onClick={handleAddPayable}>Lançar Conta</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const FluxoDeCaixaReportDialog = () => {
    return (
      <Dialog
        open={isCashFlowReportOpen}
        onOpenChange={setIsCashFlowReportOpen}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={`gap-2 border border-border bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700`}
          >
            <Clock className="h-4 w-4" />
            Fluxo de Caixa
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Relatório de Fluxo de Caixa</DialogTitle>
            <DialogDescription>
              Visão detalhada de entradas e saídas por filial e período.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex gap-4 items-end">
              <div className="space-y-2 w-1/3">
                <Label>Filial</Label>
                <Select
                  value={cashFlowFilial}
                  onValueChange={setCashFlowFilial}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a filial" />
                  </SelectTrigger>
                  <SelectContent>
                    {filiais.map((filial) => (
                      <SelectItem key={filial.id} value={filial.nome}>
                        {filial.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-1/3">
                <Label>Período</Label>
                <Select value={periodo} onValueChange={setPeriodo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diario">Diário (24h)</SelectItem>
                    <SelectItem value="semanal">Semanal (7 dias)</SelectItem>
                    <SelectItem value="mensal">Mensal (30 dias)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="gap-2 w-1/3" onClick={handleDownloadCashFlow}>
                <Download className="h-4 w-4" />
                Baixar PDF
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card
                className={`border-l-4 ${BORDER_RECEITA} bg-card shadow-sm`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Entradas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${COLOR_RECEITA}`}>
                    {formatCurrency(resumoCashFlow.entradas)}
                  </p>
                </CardContent>
              </Card>

              <Card
                className={`border-l-4 ${BORDER_DESPESAS} bg-card shadow-sm`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Saídas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${COLOR_DESPESAS}`}>
                    {formatCurrency(resumoCashFlow.saidas)}
                  </p>
                </CardContent>
              </Card>

              <Card className={`border-l-4 ${BORDER_SALDO} bg-card shadow-sm`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Saldo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${COLOR_SALDO}`}>
                    {formatCurrency(resumoCashFlow.saldo)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-lg font-semibold mt-6">
              Transações no Período
            </h3>
            {filteredCashFlow.length === 0 ? (
              <p className="text-center text-muted-foreground p-4">
                Nenhuma transação encontrada.
              </p>
            ) : (
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full table-auto min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="text-left text-sm font-semibold text-muted-foreground py-3 px-4">
                        Data
                      </th>
                      <th className="text-left text-sm font-semibold text-muted-foreground py-3">
                        Tipo
                      </th>
                      <th className="text-left text-sm font-semibold text-muted-foreground py-3">
                        Descrição
                      </th>
                      <th className="text-right text-sm font-semibold text-muted-foreground py-3 pr-4">
                        Valor
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCashFlow.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-border last:border-b-0 hover:bg-muted/50 transition text-sm"
                      >
                        <td className="py-3 px-4 font-medium">
                          {formatShortDate(item.data)}
                        </td>
                        <td
                          className={`py-3 ${item.tipo === "receita" ? COLOR_RECEITA : COLOR_DESPESAS} font-medium`}
                        >
                          {item.tipo === "receita" ? "Entrada" : "Saída"}
                        </td>
                        <td className="py-3">{item.descricao}</td>
                        <td
                          className={`py-3 text-right pr-4 ${item.tipo === "receita" ? COLOR_RECEITA : COLOR_DESPESAS} font-semibold`}
                        >
                          {formatCurrency(item.valor)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsCashFlowReportOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              Dashboard Financeiro
            </h1>
            <p className="mt-2 text-sm text-muted-foreground lg:text-base">
              Visão geral do desempenho financeiro das filiais
            </p>
          </div>

          <div className="flex gap-3">
            {LancarContaAPagarDialog()}
            {FluxoDeCaixaReportDialog()}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className={`gap-2 ${BG_PRINCIPAL} text-primary-foreground hover:bg-[#146C34]`}
                >
                  <Plus className="h-4 w-4" />
                  Nova Transação
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Transação</DialogTitle>
                  <DialogDescription>
                    Registre uma nova entrada (receita) ou saída (despesa).
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Filial</Label>
                    <Select
                      value={formData.filialId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, filialId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a filial" />
                      </SelectTrigger>
                      <SelectContent>
                        {filiais.map((filial) => (
                          <SelectItem key={filial.id} value={filial.id}>
                            {filial.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select
                      value={formData.tipo}
                      onValueChange={(value) =>
                        setFormData({ ...formData, tipo: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="receita">Receita</SelectItem>
                        <SelectItem value="despesa">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Valor (R$)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.valor}
                      onChange={(e) =>
                        setFormData({ ...formData, valor: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      placeholder="Ex: Venda X, compra Y..."
                      value={formData.descricao}
                      onChange={(e) =>
                        setFormData({ ...formData, descricao: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleAddTransaction}>Adicionar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              titulo: "Receita Total",
              valor: receitaTotal,
              icon: DollarSign,
              color: COLOR_RECEITA,
              border: BORDER_RECEITA,
            },
            {
              titulo: "Despesas Totais",
              valor: despesasTotal,
              icon: TrendingDown,
              color: COLOR_DESPESAS,
              border: BORDER_DESPESAS,
            },
            {
              titulo: "Saldo da Empresa",
              valor: saldoEmpresa,
              icon: FlaskConical,
              color: COLOR_SALDO,
              border: BORDER_SALDO,
            },
            {
              titulo: "Contas a Pagar",
              valor: valorTotalPendente,
              icon: Banknote,
              color: COLOR_CONTA_PAGAR,
              border: BORDER_CONTA_PAGAR,
            },
          ].map((item, i) => (
            <Card
              key={i}
              className={`border-l-4 ${item.border} bg-card shadow-lg`}
            >
              <CardHeader className="pb-3 flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.titulo}
                </CardTitle>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${item.color}`}>
                  {formatCurrency(item.valor)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Análise Financeira por Filial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto min-w-[600px]">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3 px-2">
                      Filial
                    </th>
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3">
                      Receita
                    </th>
                    <th className="text-left text-sm font-semibold text-muted-foreground py-3">
                      Despesas
                    </th>
                    <th className="text-center text-sm font-semibold text-muted-foreground py-3">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filiais.map((filial) => (
                    <tr
                      key={filial.id}
                      className="border-b border-border last:border-b-0 hover:bg-muted/50 transition text-sm"
                    >
                      <td className="py-3 px-2 font-medium">{filial.nome}</td>
                      <td className={`py-3 ${COLOR_RECEITA}`}>
                        {formatCurrency(filial.receita)}
                      </td>
                      <td className={`py-3 ${COLOR_DESPESAS}`}>
                        {formatCurrency(filial.despesas)}
                      </td>
                      <td className="py-3 flex items-center justify-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Visualizar Detalhes"
                          onClick={() => handleVisualizar(filial)}
                        >
                          <Eye className={`h-4 w-4 ${COLOR_SALDO}`} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Baixar relatório"
                          onClick={() => handleDownloadReport(filial)}
                        >
                          <Download className={`h-4 w-4 ${COLOR_RECEITA}`} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Banknote className={`h-5 w-5 ${COLOR_CONTA_PAGAR}`} />
              Contas a Pagar Pendentes
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Controle de fornecedores, salários e despesas fixas a vencer.
            </p>
          </CardHeader>
          <CardContent>
            {contasPendentes.length === 0 ? (
              <p className="text-center text-muted-foreground p-4">
                Nenhuma conta a pagar pendente!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto min-w-[700px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="text-left text-sm font-semibold text-muted-foreground py-3 px-2">
                        Filial
                      </th>
                      <th className="text-left text-sm font-semibold text-muted-foreground py-3">
                        Tipo
                      </th>
                      <th className="text-left text-sm font-semibold text-muted-foreground py-3">
                        Descrição
                      </th>
                      <th className="text-left text-sm font-semibold text-muted-foreground py-3">
                        Valor
                      </th>
                      <th className="text-left text-sm font-semibold text-muted-foreground py-3 flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> Vencimento
                      </th>
                      <th className="text-center text-sm font-semibold text-muted-foreground py-3">
                        Ação
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contasPendentes
                      .sort(
                        (a, b) =>
                          new Date(a.vencimento) - new Date(b.vencimento)
                      )
                      .map((conta) => (
                        <tr
                          key={conta.id}
                          className="border-b border-border last:border-b-0 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition text-sm"
                        >
                          <td className="py-3 px-2 font-medium">
                            {conta.filial}
                          </td>
                          <td className="py-3 text-muted-foreground">
                            {conta.tipo}
                          </td>
                          <td className="py-3">{conta.descricao}</td>
                          <td
                            className={`py-3 ${COLOR_DESPESAS} font-semibold`}
                          >
                            {formatCurrency(conta.valor)}
                          </td>
                          <td className="py-3">
                            {formatShortDate(conta.vencimento)}
                          </td>
                          <td className="py-3 flex items-center justify-center">
                            <Button
                              size="sm"
                              className={`${BG_PAGAR_BUTTON} hover:bg-[#07381C] text-white gap-1`}
                              onClick={() => handleMarkAsPaid(conta.id)}
                            >
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

        <Dialog open={isDetalhesOpen} onOpenChange={setIsDetalhesOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{filialSelecionada?.nome}</DialogTitle>
              <DialogDescription>Produtos em estoque</DialogDescription>
            </DialogHeader>
            <div className="overflow-x-auto mt-4">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-sm font-semibold text-muted-foreground pb-2">
                      Produto
                    </th>
                    <th className="text-left text-sm font-semibold text-muted-foreground pb-2">
                      Quantidade
                    </th>
                    <th className="text-left text-sm font-semibold text-muted-foreground pb-2">
                      Preço Unitário (R$)
                    </th>
                    <th className="text-left text-sm font-semibold text-muted-foreground pb-2">
                      Total (R$)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(filialSelecionada
                    ? PRODUTOS_POR_FILIAL[filialSelecionada.nome] || []
                    : []
                  ).map((p) => (
                    <tr key={p.id} className="border-b border-border text-sm">
                      <td className="py-2">{p.nome}</td>
                      <td className="py-2">{p.quantidade}</td>
                      <td className="py-2">{formatCurrency(p.preco)}</td>
                      <td className={`py-2 ${COLOR_SALDO}`}>
                        {formatCurrency(p.preco * p.quantidade)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDetalhesOpen(false)}
              >
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

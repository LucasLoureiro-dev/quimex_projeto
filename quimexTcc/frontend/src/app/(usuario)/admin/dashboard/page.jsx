"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/auth-context";
import { Package, ShoppingCart, Users, TrendingUp, Building2, Factory, FileText } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"  // <---- IMPORTAÇÃO CORRETA

export default function DashboardPage() {
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
  const [produtos, setProdutos] = useState("");
  const [fornecedores, setFornecedores] = useState("");
  const [lojas, setLojas] = useState("");
  const [vendas, setVendas] = useState("");
  const [funcionarios, setFuncionarios] = useState("");
  const [contas, setContas] = useState("");


  const colors = ["#20532A", "#0F703A", "#1B8742", "#279D49", "#2EAF4A", "#7CC472", "#BEE2B9"]

  const revenueData = [
    { name: "Jan", revenue: 3000 },
    { name: "Fev", revenue: 4200 },
    { name: "Mar", revenue: 9000 },
    { name: "Abr", revenue: 7500 },
    { name: "Mai", revenue: 5200 },
    { name: "Jun", revenue: 4800 },
    { name: "Jul", revenue: 6300 },
    { name: "Ago", revenue: 7100 },
    { name: "Set", revenue: 8200 },
    { name: "Out", revenue: 7600 },
    { name: "Nov", revenue: 8700 },
    { name: "Dez", revenue: 7900 },
  ]

  // const salesData = [
  //   { month: "Jan", value: 5000 },
  //   { month: "Fev", value: 7200 },
  //   { month: "Mar", value: 6300 },
  //   { month: "Abr", value: 8900 },
  //   { month: "Mai", value: 9700 },
  //   { month: "Jun", value: 8200 },
  //   { month: "Jul", value: 6900 },
  //   { month: "Ago", value: 7600 },
  //   { month: "Set", value: 8100 },
  //   { month: "Out", value: 8500 },
  //   { month: "Nov", value: 8700 },
  //   { month: "Dez", value: 7900 },
  // ]

  const invoiceData = contas
    ? (() => {
      const hoje = new Date();

      let countPago = 0;
      let countPendente = 0;
      let countVencido = 0;

      contas.forEach(c => {
        const dataVenc = new Date(c.vencimento);

        if (c.estado === "pago") {
          countPago++;
        }
        else if (c.estado === "pendente") {
          if (dataVenc < hoje) {
            countVencido++;   // pending but expired
          } else {
            countPendente++;  // pending but still valid
          }
        }
      });

      return [
        { name: "Pagos", value: countPago },
        { name: "Vencidos", value: countVencido },
        { name: "Pendentes", value: countPendente }
      ];
    })()
    : [
      { name: "Pagos", value: 0 },
      { name: "Vencidos", value: 0 },
      { name: "Pendentes", value: 0 }
    ];

  const totalInvoices = invoiceData ? invoiceData.reduce((a, b) => a + b.value, 0) : 0

  // 📄 Função para gerar relatório geral
  const handleDownloadReport = () => {
    const doc = new jsPDF()

    const dataRevenue = organizarPorMes()


    doc.setFontSize(18)
    doc.text("Relatório Geral - Empresa de Produtos Químicos", 14, 20)

    doc.setFontSize(12)
    doc.text("Resumo Financeiro e Operacional", 14, 30)
    doc.line(14, 32, 195, 32)

    // Tabela de receita
    doc.text("Receita Mensal (R$):", 14, 45)
    autoTable(doc, {  // <---- aqui
      startY: 50,
      head: [["Mês", "Receita"]],
      body: dataRevenue.map((d) => [d.name, `R$ ${d.revenue.toLocaleString("pt-BR")}`]),
      theme: "grid",
      styles: { fontSize: 10 },
    })

    // Tabela de vendas
    const finalY = doc.lastAutoTable.finalY + 10
    doc.text("Vendas Mensais:", 14, finalY)
    autoTable(doc, {  // <---- aqui
      startY: finalY + 5,
      head: [["Mês", "Vendas (R$)"]],
      body: salesData.map((d) => [d.month, `R$ ${d.value.toLocaleString("pt-BR")}`]),
      theme: "grid",
      styles: { fontSize: 10 },
    })

    // Tabela de faturas
    const finalY2 = doc.lastAutoTable.finalY + 10
    doc.text("Status de Faturas:", 14, finalY2)
    autoTable(doc, {  // <---- aqui
      startY: finalY2 + 5,
      head: [["Status", "Quantidade"]],
      body: invoiceData.map((d) => [d.name, d.value]),
      theme: "grid",
      styles: { fontSize: 10 },
    })

    // Resumo final
    const finalY3 = doc.lastAutoTable.finalY + 15
    doc.setFontSize(12)
    doc.text(`Total de Faturas: ${totalInvoices}`, 14, finalY3)
    doc.text(`Data de emissão: ${new Date().toLocaleDateString("pt-BR")}`, 14, finalY3 + 10)

    doc.save("relatorio_geral_produtos_quimicos.pdf")
  }

  useEffect(() => {
    fetch("http://localhost:8080/produtos", {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setProdutos(data.produtos);
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

    fetch("http://localhost:8080/fornecedores", {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setFornecedores(data.fornecedores);
      });


    fetch("http://localhost:8080/usuarios", {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setFuncionarios(data);
      });

    fetch("http://localhost:8080/transferencias", {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setVendas(data.trasferencias);
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
  }, [])

  function countItemsThisMonth() {
    const today = new Date();

    const itemsThisMonth = vendas ? vendas.filter(item => {
      const itemDate = new Date(item['horario']);
      return (
        itemDate.getMonth() === today.getMonth() &&  // same month
        itemDate.getFullYear() === today.getFullYear() // same year
      );
    })
      : 0;

    return itemsThisMonth.length;
  }

  function calcularCrescimento() {
    if (vendas) {
      if (vendas.length > 1) {
        const hoje = new Date();
        const mesAtual = hoje.getMonth();
        const mesAnterior = (mesAtual - 1 + 12) % 12;
        const atual = vendas.filter((f) => {
          const date = new Date(f.data);
          return date.getMonth() === mesAtual && date.getFullYear() === currentYear;
        });

        const anterior = vendas.filter((f) => {
          const date = new Date(f.data);
          return date.getMonth() === mesAnterior && date.getFullYear() === prevYear;
        });

        if (anterior == 0) {
          // If last month had no data, avoid division by zero
          return atual > 0 ? "+100%" : "0%";
        }

        const diff = atual - anterior;
        const percent = (diff / anterior) * 100;

        const formatted =
          (percent >= 0 ? "+" : "") + percent.toFixed(1) + "%";

        return formatted;
      }
      else {
        return "0%"
      }
    }
  }

  const crescimento = calcularCrescimento();

  const receitaTotal = vendas ? vendas.reduce((sum, f) => sum + f.preco * f.quantidade_produto, 0) : 0

  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  function organizarPorMes() {
    const resultado = meses.map(m => ({ name: m, revenue: 0 }));

    vendas ? vendas.forEach(item => {
      const date = new Date(item.horario);
      const mesIndex = date.getMonth();
      resultado[mesIndex].revenue += item.preco.toFixed(0) * item.quantidade_produto;
    })
      : null
    console.log(resultado)
    return resultado;
  }

  function contarVendasPorMes() {
    if (vendas) {
      const result = meses.map(m => ({ month: m, value: 0 }));

      vendas.forEach(v => {
        const data = new Date(v.horario);
        const mesIndex = data.getMonth();
        result[mesIndex].value++;
      });

      return result;
    }
  }

  const salesData = contarVendasPorMes();

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl bg-background text-foreground transition-colors duration-500">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Sistema</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie seus produtos, vendas e operações
        </p>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: "Total de Produtos",
            value: produtos ? produtos.length : 0,
            icon: Package
          },
          {
            title: "Vendas do Mês",
            value: countItemsThisMonth(),
            icon: ShoppingCart,
          },
          {
            title: "Fornecedores Ativos",
            value: fornecedores ? fornecedores.length : 0,
            icon: Factory,
          },
          {
            title: "Crescimento",
            value: crescimento,
            icon: TrendingUp,
          },
        ].map(({ title, value, icon: Icon, note }) => (
          <div
            key={title}
            className="rounded-xl p-6 border bg-card border-border shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                {title}
              </h3>
              <Icon className="w-5 h-5 text-foreground/60" />
            </div>
            <div className="text-3xl font-bold mb-1">{value}</div>
            <p className="text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de barras */}
        <div className="rounded-xl p-6 border bg-card border-border shadow-sm">
          <h2 className="text-lg font-semibold mb-2">
            Total de Receita:{" "}
            <span className="font-normal text-muted-foreground">
              R$ {receitaTotal.toFixed(2)}
            </span>
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={organizarPorMes()}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#44403c33"
              />
              <XAxis
                dataKey="name"
                stroke="#9CA3AF"
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
              <Bar
                dataKey="revenue"
                fill={colors[5]}
                radius={[5, 5, 0, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de pizza */}
        <div className="rounded-xl p-6 border bg-card border-border shadow-sm flex flex-col lg:flex-row items-center justify-center">
          <div className="w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={invoiceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={45}
                  paddingAngle={2}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {invoiceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={[colors[1], colors[4], colors[6]][index]}
                    />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-lg font-bold fill-foreground"
                >
                  {totalInvoices}
                </text>
                <text
                  x="50%"
                  y="60%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] fill-muted-foreground"
                >
                  Faturas
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 lg:mt-0 lg:ml-4 space-y-1 text-xs">
            {invoiceData.map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div
                  className="w-2.5 hA-2.5 rounded-full"
                  style={{
                    backgroundColor: [colors[1], colors[4], colors[6]][i],
                  }}
                ></div>
                <span className="text-muted-foreground">{item.name}:</span>
                <span className="font-semibold text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ações rápidas e atividades recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-5 mt-5">
        {/* Ações rápidas */}
        <div className="rounded-xl border bg-card border-border shadow-sm p-6 mb-10">
          <h2 className="text-xl font-bold mb-2">Ações Rápidas</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Acesse as funcionalidades principais
          </p>

          <div className="grid grid-cols-4 gap-4">
            {[
              { title: "Produtos", icon: Package, action: () => router.push("/admin/produtos") },
              { title: "Financeiro", icon: TrendingUp, action: () => router.push("/admin/financeiro") },
              { title: "Fornecedores", icon: Factory, action: () => router.push("/admin/fornecedores") },
              { title: "Relatórios", icon: FileText, action: handleDownloadReport },
            ].map(({ title, icon: Icon, action }) => (
              <button
                key={title}
                onClick={action}
                className="flex flex-col items-center justify-center p-6 bg-muted hover:bg-muted/80 rounded-xl transition-all shadow-sm border border-border hover:scale-[1.03]"
              >
                <Icon className="w-6 h-6 mb-2 text-primary" />
                <span className="text-sm font-medium">{title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards secundários */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { title: "Total de Funcionários", value: funcionarios ? funcionarios.length : 0, icon: Users },
          { title: "Total de Lojas", value: lojas ? lojas.length : 0, icon: Building2 },
          { title: "Contas Pendentes", value: contas ? contas.filter((conta) => conta.estado == "pendente").length : 0, icon: Factory },
        ].map(({ title, value, icon: Icon }) => (
          <div
            key={title}
            className="rounded-xl p-6 border bg-card border-border shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                {title}
              </h3>
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      {/* Gráfico de linha */}
      <div className="rounded-xl p-5 border bg-card border-border shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Análise de Vendas</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#44403c33" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
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
    </main>
  )
}


"use client"
import { Clock, User } from "lucide-react"
import { useState, useEffect } from "react";

export function VendasTable({ vendasPdv, formatCurrency, COLOR_RECEITA }) {
  const [vendas, setVendas] = useState("");
  const [funcionarios, setFuncionarios] = useState("");
  const [lojas, setLojas] = useState("");
  const [produtos, setProdutos] = useState("");

  const handletempo = (hora) => {
    const d = new Date(hora);

    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');

    return `${hh}:${mm}`;
  };


  const funcionario = (id) => {
    return funcionarios.find((funcionario) => funcionario.id == id).nome
  }
  const loja = () => {
    return lojas.find((loja) => loja.id == id);
  }

  useEffect(() => {
    fetch("http://localhost:8080/usuarios", {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setFuncionarios(data);
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

  useEffect(() => {
    if (vendasPdv) {
      const groups = {};

      for (const item of vendasPdv) {
        const cart = item.cart_id;

        if (!groups[cart]) {
          groups[cart] = {
            cart_id: cart,
            loja: item.loja,
            operador_id: item.operador_id,
            horario: item.horario,
            pagamento: item.pagamento,
            troco: item.troco,
            total_preco: 0,
            items: []
          };
        }

        groups[cart].total_preco += item.preco * item.quantidade_produto;

        groups[cart].items.push({
          produto: item.produto,
          quantidade: item.quantidade_produto
        });
      }

      // Convert object → array
      let purchases = Object.values(groups);

      // Sort by newest first
      purchases.sort((a, b) => new Date(b.horario) - new Date(a.horario));

      // Assign incremental ids based on chronological (oldest first)
      const chronological = [...purchases].sort(
        (a, b) => new Date(a.horario) - new Date(b.horario)
      );

      const idMap = new Map();
      chronological.forEach((p, index) => {
        idMap.set(p.cart_id, index + 1); // oldest gets id = 1
      });

      // Add new ids to sorted list
      purchases = purchases.map(p => ({
        new_id: idMap.get(p.cart_id),
        ...p
      }));

      setVendas(purchases);

    }
  }, [vendasPdv]);

  return (
    <div className="w-full">
      {/* Desktop: Tabela tradicional */}
      <div className="hidden md:block overflow-x-auto">
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
            {vendas ?
              vendas.map((venda) => (
                <tr key={venda.new_id} className="border-b border-border text-sm hover:bg-muted/50">
                  <td className="py-3 px-2 font-medium">#{venda.new_id}</td>
                  <td className="py-3 truncate max-w-[250px]" title={venda.itens}>
                    {venda.items ?
                      venda.items.map((item, index) => {
                        const produto = produtos ? produtos.find((p) => p.id == item.produto).nome : null
                        return (
                          <p key={index}>{item.quantidade}x {produto ? produto : <>Produto não encontrado</>}</p>
                        )
                      })
                      : null}
                  </td>
                  <td className={`py-3 ${COLOR_RECEITA} font-semibold`}>{formatCurrency(venda.total_preco)}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full bg-muted text-xs font-medium whitespace-nowrap">
                      {venda.pagamento}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />   {handletempo(venda.horario)}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <User className="h-3 w-3 text-muted-foreground" />
                      {funcionarios ? funcionario(venda.operador_id) : null}
                    </div>
                  </td>
                </tr>
              ))
              : (
                <tr>
                  <td>
                    Não há nada aqui
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {/* Mobile: Layout em cards */}
      <div className="md:hidden space-y-3">
        {vendas ? vendas.map((venda) => (
          <div key={venda.new_id} className="border border-border rounded-lg p-4 bg-card">
            {/* Header do card */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm">#{venda.new_id}</span>
              <span className={`${COLOR_RECEITA} font-semibold text-base`}>{formatCurrency(venda.total_preco)}</span>
            </div>

            {/* Itens vendidos */}
            <p className="text-sm text-foreground mb-3 line-clamp-2" title={venda.itens}>
              {venda.itens}
            </p>

            {/* Footer do card */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-1 rounded-full bg-muted font-medium text-foreground">{venda.pagamento}</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {handletempo(venda.horario)}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {venda.operador_id}
              </div>
            </div>
          </div>
        )) : null}
      </div>
    </div>
  )
}

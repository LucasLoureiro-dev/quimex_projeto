import { Clock, User } from "lucide-react"

export function VendasTable({ vendasPdv, formatCurrency, COLOR_RECEITA }) {
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
            {vendasPdv.map((venda) => (
              <tr key={venda.id} className="border-b border-border text-sm hover:bg-muted/50">
                <td className="py-3 px-2 font-medium">#{venda.id}</td>
                <td className="py-3 truncate max-w-[250px]" title={venda.itens}>
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

      {/* Mobile: Layout em cards */}
      <div className="md:hidden space-y-3">
        {vendasPdv.map((venda) => (
          <div key={venda.id} className="border border-border rounded-lg p-4 bg-card">
            {/* Header do card */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm">#{venda.id}</span>
              <span className={`${COLOR_RECEITA} font-semibold text-base`}>{formatCurrency(venda.valor)}</span>
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
                {venda.horario}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {venda.operador}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

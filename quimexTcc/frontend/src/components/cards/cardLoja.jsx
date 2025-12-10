import { Building2, MapPin, Phone, FileText, User, Truck } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LojaCard({ nomeLoja, filial, nomeGerente, cnpj, cidade, estado, contato }) {
  return (
    <Card className="overflow-hidden p-0">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{nomeLoja}</h2>
              <Badge variant="secondary" className="mt-1">
                {filial}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
            <User className="h-4 w-4" />
            <span>Gerente: {nomeGerente}</span>
          </div>
        </div>
      </CardHeader>

      {/* Content - Responsive Grid/Table */}
      <CardContent className="p-0">
        {/* Desktop: Table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">CNPJ</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Cidade</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Contato</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b last:border-0">
                <td className="px-4 py-4 text-sm font-mono">{cnpj}</td>
                <td className="px-4 py-4 text-sm">{cidade}</td>
                <td className="px-4 py-4 text-sm">{estado}</td>
                <td className="px-4 py-4 text-sm font-mono">{contato}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile: Stacked Cards */}
        <div className="md:hidden divide-y">
          <div className="flex items-start gap-3 p-4">
            <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">CNPJ</p>
              <p className="text-sm font-mono">{cnpj}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Localização</p>
              <p className="text-sm">
                {cidade}, {estado}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4">
            <Phone className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Contato</p>
              <p className="text-sm font-mono">{contato}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

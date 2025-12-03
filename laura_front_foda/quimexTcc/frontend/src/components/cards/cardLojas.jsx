import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Truck,
  Building2,
  Phone,
  MapPin,
  Trash2,
  Edit2,
  UsersRound,
  UserStar,
  Eye
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import Tabela from "../tabelaPaginacao/tabelaPaginacao";
import TabelaFornecedores from "../tabelaFornecedores/tabelaFornecedores";
import { useEffect, useState } from "react";

export function CardLojas({ loja, onEdit, onDelete }) {

  const [gerente, setGerente] = useState([])
  const [fornecedores, setFornecedores] = useState([])
  const [funcionarios, setFuncionarios] = useState([])

  const busca_funcionarios = async () => {
    const busca = await fetch("http://localhost:8080/usuarios")
    const res = await busca.json()

    const usuarios = res
    return usuarios;
  }

  const busca_gerentes = async () => {
    const funcionarios = await busca_funcionarios()

    const gerentes = funcionarios.filter(g => g.cargo === "Gerente" && g.loja_vinculada === loja.id)
    const funcionario_por_lojas = funcionarios.filter(f => f.loja_vinculada === loja.id)
    setGerente(gerentes[0])
    setFuncionarios(funcionario_por_lojas)
  }

  const busca_fornecedores = async () => {
    const busca = await fetch("http://localhost:8080/fornecedores")
    const res = await busca.json();

    const fornecedores = res.fornecedores
    return fornecedores;
  } 

  const fornecedores_por_loja = async () => {
    const forne = await busca_fornecedores()

    if(loja.tipo === "Matriz"){
      setFornecedores(forne);
    }
    else{
      const fornecedores_loja = forne.filter(f => f.loja_vinculada === loja.id)
      setFornecedores(fornecedores_loja)
    }
  }

  const excluir_loja = async (id) => {
    await fetch(`http://localhost:8080/lojas/${id}`, {
      credentials: "include",
      method: "DELETE"
    })
  }

  useEffect(() => {

    busca_gerentes()
    fornecedores_por_loja()

  }, [])


  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
            <div
              className={`p-2.5 rounded-xl transition-colors ${loja.tipo === "Matriz"
                ? "bg-purple-500/10 group-hover:bg-purple-500/20"
                : "bg-primary/10 group-hover:bg-primary/20"
                }`}
            >
              <Building2
                className={`h-5 w-5 ${loja.tipo === "Matriz" ? "text-purple-500" : "text-primary"
                  }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg truncate">{gerente ? gerente.nome : "Não tem"}</CardTitle>
                <Badge
                  variant={loja.tipo === "Matriz" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {loja.tipo}
                </Badge>
              </div>
              <small>{loja.nome}</small>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(loja)}
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-accent"
                >
                  <Truck className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="max-w-6xl max-h-[90vh] overflow-y-automax-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Fornecedores
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Ver Fornecedores
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <TabelaFornecedores data={fornecedores} />
                <AlertDialogFooter>
                  <AlertDialogCancel>Fechar</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  title="Visualizar Detalhes"
                >
                  <Eye className="h-4 w-4 text-primary" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-6xl max-h-[90vh] overflow-y-automax-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tabela de funcionários
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Visualização de funcionários
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {/* TABELAAA */}
                <Tabela data={funcionarios} />
                <AlertDialogFooter>
                  <AlertDialogCancel>Fechar</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-muted-foreground">
            <p>{loja.endereco}</p>
            <p>
              {loja.localizacao} - {loja.estado}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4 flex-shrink-0" />
          {loja.contato}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UsersRound className="h-4 w-4 flex-shrink-0" />
            {funcionarios.length}
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">CNPJ: {loja.cnpj}</p>
        </div>
      </CardContent>
    </Card>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, Hash, Edit2, Trash2, Beaker } from "lucide-react";
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
import Image from "next/image";

export default function CardProdutos({
  produto,
  onEdit,
  onDelete,
  badgeVariant,
  nomeLoja,
  lojaId,
}) {
  console.log(produto.imagem)
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50">
      <CardHeader className="flex flex-col ">
        <div className="w-full rounded-md ">
          <Image
            src={`http://localhost:8080${produto.imagem}`}
            layout="responsive"
            width={360}
            height={30}
            alt={`imagem do produto: ${produto.nome}`}
            className="aspeeo  object-  rounded-2xl"
          />
        </div>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-shrink min-w-0 flex-wrap">
            <div className="p-2.5 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
              <Package className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{produto.nome}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {produto.descricao}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Hash className="h-4 w-4 flex-shrink-0" />
          <span className="font-mono">{produto.sku}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col items-baseline gap-1">
            <span className="text-2xl font-bold">
              R$ {produto.preco.toFixed(2)}
            </span>
          </div>
          <Badge variant={badgeVariant(produto.estoque)}>
            Estoque: {produto.quantidade}
          </Badge>
        </div>

        <div className="flex flex-row justify-between items-center pt-2 border-t">
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all border
              border-border bg-background text-background-foreground hover:bg-background/80`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full ${produto.codigoCor} border border-border`}
            ></span>
            <span>{produto.classificacao}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(produto)}
              className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-primary/10"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja excluir este produto?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isto irá apagar
                    permanentemente o produto dos nossos servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(produto.id)}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

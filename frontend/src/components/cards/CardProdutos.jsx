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

export function CardProdutos({
  produto,
  onEdit,
  onDelete,
  badgeVariant,
  nomeLoja,
  lojaId
}) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50">
      <CardHeader className="pb-3">
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
          <div className="flex items-baseline gap-1">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-2xl font-bold">
              R$ {produto.preco.toFixed(2)}
            </span>
          </div>
          <Badge variant={badgeVariant(produto.estoque)}>
            Estoque: {produto.estoque}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-sm bg-accent p-1 rounded-md">
            <Beaker className="h-5 w-5 flex-shrink-0 text-primary" />
            <span>{produto.classificacao}</span>
          </div>
        <div className="flex flex-row justify-between items-center pt-2 border-t">
          <p className="text-xs text-muted-foreground">
             {produto.filial}
          </p>
          <div className="flex flex-wrap gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(produto)}
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
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

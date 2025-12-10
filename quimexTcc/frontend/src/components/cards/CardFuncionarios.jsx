import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, UserCircle, Mail, Phone, Building2, Edit2 } from "lucide-react";
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
import { useState, useEffect } from "react";


export function CardFuncionarios({ funcionario, onEdit, onDelete }) {
    const [lojaTipo, setLojaTipo] = useState([])

    const busca_loja = async () => {
        const busca = await fetch("http://localhost:8080/lojas")

        const res = await busca.json()

        const acha_loja_por_usuario = res.lojas.find(l => l.id === funcionario.loja_vinculada)

        setLojaTipo(acha_loja_por_usuario)

    }

    useEffect(() => {
        busca_loja()
    }, [])

    return (
        <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <UserCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">{funcionario.nome}</CardTitle>
                            <p className="text-xs text-muted-foreground uppercase mt-1 font-medium">
                                {funcionario.cargo}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(funcionario)}
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
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
                                    <AlertDialogAction onClick={() => onDelete(funcionario.id)}>
                                        Confirmar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{funcionario.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    {funcionario.contato}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 flex-shrink-0" />
                    {lojaTipo.tipo}
                </div>
                <div className="pt-2 mt-2 border-t">
                    <p className="text-xs text-muted-foreground">CPF: {funcionario.cpf}</p>
                </div>
            </CardContent>
        </Card>
    );
}
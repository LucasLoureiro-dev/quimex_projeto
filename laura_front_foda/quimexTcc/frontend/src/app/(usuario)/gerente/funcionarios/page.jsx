"use client"

import { useState, useMemo, useEffect } from "react"
import { mockUsers, mockLojas } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MaskedInput } from '@/components/ui/masked-input';
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Plus, Search, UserCircle, Users, UserRoundPlus, UserRoundMinus, ChartLine } from "lucide-react";
// import { getRoleName } from "@/lib/utils/permissions";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

//paginação
import { ControlePaginacao } from "@/components/paginacao/controlePaginacao";
import { CardFuncionarios } from "@/components/cards/CardFuncionarios";

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFuncionario, setEditingFuncionario] = useState(null)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    role: "vendedor",
    lojaId: "",
  })


  const infoFuncionarios = [{
    titulo: "Total de Funcionários",
    valor: "1,234",
    icon: Users,
  },
  {
    titulo: "Contratações esse mês",
    valor: "1,234",
    icon: UserRoundPlus,
  },
  ]

  const buscaUsuarioLogado = async () => {
    const busca_usuario_logado = await fetch("http://localhost:8080/dashboard",
      {
        credentials: "include"
      }
    )
    const res = await busca_usuario_logado.json();
    const usuarioBuscado = res
    return usuarioBuscado;
  }

  const buscaFuncionarios = async () => {
    const busca_funcionarios = await fetch("http://localhost:8080/usuarios",
      {
        credentials: "include"
      }
    )
    const res = await busca_funcionarios.json();
    const funcionariosBuscados = res
    return funcionariosBuscados;
  }

  const filtraFuncionarios = async () => {
    const funcionarios = await buscaFuncionarios()
    const usuario_logado = await buscaUsuarioLogado()

    const filtraFuncionarios = funcionarios.filter(f => f.loja_vinculada === usuario_logado.Loja_vinculada)
    console.log(filtraFuncionarios)
    setFuncionarios(filtraFuncionarios)
  }

  useEffect(() => {
    filtraFuncionarios()
  }, [])


  const handleEditFuncionario = (funcionario) => {
    setEditingFuncionario(funcionario)
    setFormData({
      nome: funcionario.nome,
      email: funcionario.email,
      cpf: funcionario.cpf,
      telefone: funcionario.telefone,
      role: funcionario.role,
      lojaId: funcionario.lojaId || "",
    })
    setIsDialogOpen(true)
  }

  const handleSaveFuncionario = () => {
    if (editingFuncionario) {
      // Edit funcionario
      setFuncionarios(
        funcionarios.map((f) =>
          f.id === editingFuncionario.id
            ? {
              ...f,
              nome: formData.nome,
              email: formData.email,
              cpf: formData.cpf,
              telefone: formData.telefone,
              role: formData.role,
              lojaId: formData.lojaId,
            }
            : f,
        ),
      )
    } else {
      // Add new
      const newFuncionario = {
        id: String(Date.now()),
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        telefone: formData.telefone,
        role: formData.role,
        lojaId: formData.lojaId,
        ativo: true,
      }
      setFuncionarios([...funcionarios, newFuncionario])
    }

    setIsDialogOpen(false)
    setEditingFuncionario(null)
    setFormData({
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
      role: "vendedor",
      lojaId: "",
    })
  }

  const handleDeleteFuncionario = (id) => {
    setFuncionarios(funcionarios.filter((f) => f.id !== id))
  }

  const handleCloseDialog = (open) => {
    setIsDialogOpen(open)
    if (!open) {
      setEditingFuncionario(null)
      setFormData({
        nome: "",
        email: "",
        cpf: "",
        telefone: "",
        role: "vendedor",
        lojaId: "",
      })
    }
  }

  const getLojaNome = (lojaId) => {
    if (!lojaId) return "Matriz"
    const loja = mockLojas.find((l) => l.id === lojaId)
    return loja?.nome || "N/A"
  }

  const roleFuncionarios = [...new Set(mockUsers.map(user => user.role))];

  const [roleFuncionarioSelecionados, setRoleFuncionarioSelecionados] = useState([]);

  const handleRoleFuncionarioChange = (funcionario, checked) => {
    if (checked) {
      setRoleFuncionarioSelecionados([...roleFuncionarioSelecionados, funcionario]);
    } else {
      setRoleFuncionarioSelecionados(roleFuncionarioSelecionados.filter((f) => f !== funcionario));
    }
  };


  const filteredFuncionarios = useMemo(() => {
    // Comece com a lista filtrada por role de acesso do usuário logado
    let listaFiltrada = funcionarios;
    // Se houver algum setor (role) selecionado, filtra por ele
    if (roleFuncionarioSelecionados.length > 0) {
      listaFiltrada = listaFiltrada.filter(funcionario =>
        roleFuncionarioSelecionados.includes(funcionario.role)
      );
    }

    // Se houver texto na barra de busca, filtra por nome, email ou CPF
    if (searchTerm.trim() !== "") {
      const lowerCaseSearch = searchTerm.toLowerCase();

      listaFiltrada = listaFiltrada.filter(funcionario =>
        funcionario.nome.toLowerCase().includes(lowerCaseSearch) ||
        funcionario.email.toLowerCase().includes(lowerCaseSearch) ||
        funcionario.cpf.toLowerCase().includes(searchTerm)
      );
    }

    // Retorna a lista final filtrada
    return listaFiltrada;
  }, [roleFuncionarioSelecionados, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Funcionários</h1>
          <p className="text-muted-foreground mt-1">Gerencie os funcionários da Quimex</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFuncionario ? "Editar Funcionário" : "Adicionar Funcionário"}</DialogTitle>
              <DialogDescription>
                {editingFuncionario ? "Atualize os dados do funcionário" : "Preencha os dados do novo funcionário"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="João Silva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="joao@quimex.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <MaskedInput
                  id="cpf"
                  mask="000.000.000-00"
                  value={formData.cpf}
                  onChange={(value) => setFormData({ ...formData, cpf: value })}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <MaskedInput
                  id="telefone"
                  mask="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={(value) => setFormData({ ...formData, telefone: value })}
                  placeholder="(11) 98765-4321"
                />
              </div>

              <div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin_matriz">Administrador Matriz</SelectItem>
                      <SelectItem value="gerente_filial">Gerente de Filial</SelectItem>
                      <SelectItem value="vendedor">Vendedor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loja">Loja</Label>
                  <Select
                    value={formData.lojaId}
                    onValueChange={(value) => setFormData({ ...formData, lojaId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma loja" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockLojas.map((loja) => (
                        <SelectItem key={loja.id} value={loja.id}>
                          {loja.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => handleCloseDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveFuncionario}>{editingFuncionario ? "Salvar" : "Adicionar"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        {infoFuncionarios.map((info, index) => {
          const Icon = info.icon;
          return (
            <div
              key={index}
              className="rounded-xl p-6 border bg-card border-border shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{info.titulo}</h3>
                <Icon className="w-5 h-5 text-foreground/60" />
              </div>
              <div className="text-3xl font-bold mb-1">{info.valor}</div>
            </div>
          );
        })}
      </div>


      <div className="flex flex-col md:flex-row gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-fit">Visualizar por função</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44">
            <DropdownMenuLabel>Selecione função</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {roleFuncionarios.map((funcionario) => (
              <DropdownMenuCheckboxItem
                checked={roleFuncionarioSelecionados.includes(funcionario)}
                key={funcionario}
                onCheckedChange={(checked) => handleRoleFuncionarioChange(funcionario, checked)}
                // Prevent the dropdown menu from closing when the checkbox is clicked
                onSelect={(e) => e.preventDefault()}
              >
                {funcionario}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-row gap-2 flex-wrap relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>


      {/* Lista de Funcionários */}
      <ControlePaginacao
        items={funcionarios}
        renderItem={(funcionario) => (
          <CardFuncionarios
            key={funcionario.id}
            funcionario={funcionario}
            onEdit={handleEditFuncionario}
            onDelete={handleDeleteFuncionario}
            roleNome={funcionario.cargo}
            lojaNome={getLojaNome}
          />
        )}
        itemsPerPage={6}
      />

      {/* {filteredFuncionarios.length === 0 && (
        <div className="text-center py-12">
          <UserCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">Nenhum funcionário encontrado.</p>
        </div>
      )} */}
    </div>
  )
}

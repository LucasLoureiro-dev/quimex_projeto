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

import { Plus, Search, Users } from "lucide-react";

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
  const [usuario, setUsuario] = useState(null)
  const [lojas, setLojas] = useState([])

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    RE: "",
    senha: "",
    telefone: "",
    sexo: "",
    cargo: "Funcionario", // sempre funcionario
    vinculo: "",
    loja_vinculada: "",
  })

  const buscaUsuarioLogado = async () => {
    const busca_usuario_logado = await fetch("http://localhost:8080/dashboard",
      {
        credentials: "include"
      }
    )
    const res = await busca_usuario_logado.json();
    return res;
  }

  const buscaFuncionarios = async () => {
    const busca_funcionarios = await fetch("http://localhost:8080/usuarios",
      {
        credentials: "include"
      }
    )
    const res = await busca_funcionarios.json();
    return res;
  }

  const buscaLojas = async () => {
    try {
      const r = await fetch("http://localhost:8080/lojas", { credentials: 'include' })
      const data = await r.json()
      // aceita tanto {lojas: [...]} quanto array direto
      return data.lojas || data || []
    } catch (e) {
      return mockLojas || []
    }
  }

  const filtraFuncionarios = async () => {
    const funcionarios = await buscaFuncionarios()
    const usuarioLogado = await buscaUsuarioLogado()

    setUsuario(usuarioLogado)

    // filtra por loja vinculada do usuário (gerente) - apenas os da mesma loja
    const filtra = (funcionarios || []).filter(f => {
      // se administrador, poderia ver todos — aqui assumimos gerente
      return f.loja_vinculada === usuarioLogado.Loja_vinculada
    })
    setFuncionarios(filtra)

    // seta valores padrão do form com dados do usuário (vinculo e loja)
    setFormData((prev) => ({
      ...prev,
      vinculo: usuarioLogado.vinculo,
      loja_vinculada: usuarioLogado.Loja_vinculada,
      cargo: 'Funcionario',
    }))
  }

  useEffect(() => {
    // carrega lojas e funcionários/usuario
    (async () => {
      const l = await buscaLojas()
      setLojas(l)
      await filtraFuncionarios()
    })()
  }, [])

  const infoFuncionarios = [{
    titulo: "Total de Funcionários",
    valor: funcionarios.length,
    icon: Users,
  },]

  const handleEditFuncionario = (funcionario) => {
    setEditingFuncionario(funcionario)
    setFormData({
      nome: funcionario.nome || "",
      email: funcionario.email || "",
      cpf: funcionario.cpf || "",
      telefone: funcionario.contato || "",
      cargo: "Funcionario",
      loja_vinculada: funcionario.loja_vinculada || usuario?.Loja_vinculada || "",
      RE: funcionario.RE || "",
      senha: "",
      sexo: funcionario.sexo || "",
      vinculo: funcionario.vinculo || usuario?.vinculo || "",
    })
    setIsDialogOpen(true)
  }

  const handleSaveFuncionario = async () => {
    // sempre usa a loja do usuario logado
    const lojaVinculadaFinal = usuario?.Loja_vinculada || formData.loja_vinculada

    const payload = {
      nome: formData.nome,
      email: formData.email,
      cpf: formData.cpf,
      contato: formData.telefone,
      cargo: 'Funcionario',
      loja_vinculada: lojaVinculadaFinal,
      RE: formData.RE,
      senha: formData.senha,
      sexo: formData.sexo,
      vinculo: usuario?.vinculo || formData.vinculo,
    }

    console.log(payload)

    try {
      if (editingFuncionario) {
        await fetch(`http://localhost:8080/usuarios/${editingFuncionario.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        })
      } else {
        await fetch("http://localhost:8080/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      // recarrega lista
      await filtraFuncionarios()
      setIsDialogOpen(false)
      setEditingFuncionario(null)
      setFormData({
        nome: "",
        cpf: "",
        email: "",
        RE: "",
        senha: "",
        telefone: "",
        sexo: "",
        cargo: "Funcionario",
        vinculo: usuario?.vinculo || "",
        loja_vinculada: usuario?.Loja_vinculada || "",
      })
    }
  }

  const handleDeleteFuncionario = async (id) => {
    await fetch(`http://localhost:8080/usuarios/${id}`, {
      method: "DELETE",
      credentials: "include"
    })
  }

  const handleCloseDialog = (open) => {
    setIsDialogOpen(open)
    if (!open) {
      setEditingFuncionario(null)
      setFormData({
        nome: "",
        cpf: "",
        email: "",
        RE: "",
        senha: "",
        telefone: "",
        sexo: "",
        cargo: "Funcionario",
        vinculo: usuario?.vinculo || "",
        loja_vinculada: usuario?.Loja_vinculada || "",
      })
    }
  }

  const getLojaNome = (lojaId) => {
    if (!lojaId) return "Matriz"
    const loja = lojas.find((l) => l.id === lojaId) || mockLojas.find((l) => l.id === lojaId)
    return loja?.nome || "N/A"
  }

  const filteredFuncionarios = useMemo(() => {
    let listaFiltrada = funcionarios;

    if (searchTerm.trim() !== "") {
      const lowerCaseSearch = searchTerm.toLowerCase();

      listaFiltrada = listaFiltrada.filter(funcionario =>
        (funcionario.nome || "").toLowerCase().includes(lowerCaseSearch) ||
        (funcionario.email || "").toLowerCase().includes(lowerCaseSearch) ||
        (funcionario.cpf || "").includes(searchTerm)
      );
    }

    return listaFiltrada;
  }, [searchTerm, funcionarios]);

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

              <div className="space-y-2">
                <Label htmlFor="RE">RE</Label>
                <Input
                  id="RE"
                  value={formData.RE}
                  onChange={(e) => setFormData({ ...formData, RE: e.target.value })}
                  placeholder="Registro Escolar"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  placeholder="********"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo</Label>
                <Select value={formData.sexo || ""} onValueChange={(v) => setFormData({ ...formData, sexo: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input id="cargo" value={formData.cargo} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vinculo">Vínculo</Label>
                  <Input id="vinculo" value={formData.vinculo || usuario?.vinculo || ""} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loja">Loja Vinculada</Label>
                  <Select value={String(formData.loja_vinculada || usuario?.Loja_vinculada || "")} disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Loja" />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        const lojaId = usuario?.Loja_vinculada || formData.loja_vinculada
                        const lojaInfo = lojas.find(l => l.id === lojaId) || mockLojas.find(l => l.id === lojaId)
                        if (lojaInfo) {
                          return (
                            <SelectItem value={String(lojaInfo.id)}>
                              {lojaInfo.nome}
                            </SelectItem>
                          )
                        }
                        return (
                          <SelectItem value="0">Matriz</SelectItem>
                        )
                      })()}
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
        <div className="flex flex-row gap-2 flex-wrap relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>



      {/* Lista de Funcionários */}
      <ControlePaginacao
        items={filteredFuncionarios}
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
    </div>
  )
}

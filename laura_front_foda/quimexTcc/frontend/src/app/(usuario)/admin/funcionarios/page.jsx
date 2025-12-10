
"use client"

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react"
import { useAuth } from "@/app/contexts/auth-context"
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
    else {
      router.push("/login");
    }
  }, [user, isLoading, router]);
  // const [user, setUser] = useState({}) 
  const [funcionarios, setFuncionarios] = useState([])
  const [searchLojas, setSearchLojas] = useState([])
  const [lojas, setLojas] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFuncionario, setEditingFuncionario] = useState(null)
  // 1. ESTADO AJUSTADO: Todos os 8 campos da tabela 'usuario'
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    contato: "",
    cargo: "vendedor", // Renomeado de role para cargo
    loja_vinculada: "", // Renomeado de lojaId para loja_vinculada
    RE: "",
    senha: "",
    sexo: "",
    vinculo: "",
  })

  const busca_funcionarios = async () => {
    try {
      const funci = await fetch("http://localhost:8080/usuarios")
      const users = await funci.json()
      setFuncionarios(users)
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
    }
  }

  const buscaLojas = async () => {
    try {
      const busca_lojas = await fetch("http://localhost:8080/lojas");
      const res = await busca_lojas.json();
      setLojas(res.lojas);
    } catch (error) {
      console.error("Erro ao buscar lojas:", error);
    }
  };


  useEffect(() => {
    busca_funcionarios()
    buscaLojas()
  }, [])

  useEffect(() => {
    if (formData.vinculo == "Matriz") {
      formData.loja_vinculada = ""
      const search = lojas.filter(l => l.tipo === "Matriz")
      setSearchLojas(search)
    }
    else if (formData.vinculo == "Filial") {
      formData.loja_vinculada = ""
      const search = lojas.filter(l => l.tipo === "Filial")
      setSearchLojas(search)
    }
  }, [formData.vinculo])

  const media = lojas.length > 0 ? (funcionarios.length / lojas.length).toFixed(0) : 0;

  // 2. FUNÇÃO AJUSTADA: Carrega todos os 8 campos para edição
  const handleEditFuncionario = (funcionario) => {
    setEditingFuncionario(funcionario)
    setFormData({
      nome: funcionario.nome || "",
      email: funcionario.email || "",
      cpf: funcionario.cpf || "",
      contato: funcionario.contato || "",
      cargo: funcionario.cargo || "vendedor",
      loja_vinculada: funcionario.loja_vinculada || "",
      RE: funcionario.RE || "",
      senha: "",
      sexo: funcionario.sexo || "",
      vinculo: funcionario.vinculo || "",
    })
    setIsDialogOpen(true)
  }

  // 3. FUNÇÃO AJUSTADA: Salva o funcionário com todos os 8 campos
  const handleSaveFuncionario = async () => {
    console.log(formData)
    const lojaVinculadaFinal = formData.loja_vinculada || (user.cargo === "Administrador" ? null : user.loja_vinculada);

    if (editingFuncionario) {
      console.log(editingFuncionario)
      try {
        const res = await fetch(`http://localhost:8080/usuarios/${editingFuncionario.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: formData.nome,
            email: formData.email,
            cpf: formData.cpf,
            contato: formData.contato,
            cargo: formData.cargo,
            loja_vinculada: lojaVinculadaFinal,
            RE: formData.RE,
            senha: formData.senha,
            sexo: formData.sexo,
            vinculo: formData.vinculo,
          }),
          credentials: "include",
        })
      }
      catch (error) {
        console.log(error)
      }
      finally {
        window.location.reload(true)
      }
    } else {
      try {
        const res = await fetch("http://localhost:8080/usuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: formData.nome,
            email: formData.email,
            cpf: formData.cpf,
            contato: formData.contato,
            cargo: formData.cargo,
            loja_vinculada: lojaVinculadaFinal,
            RE: formData.RE,
            senha: formData.senha,
            sexo: formData.sexo,
            vinculo: formData.vinculo,
          }),
          credentials: "include",
        })
        console.log(res)
      }
      catch (error) {
        console.log(error)
      }
      finally {
        window.location.reload(true)
      }


    }


    setIsDialogOpen(false)
    setEditingFuncionario(null)
    setFormData({
      nome: "", email: "", cpf: "", contato: "",
      cargo: "vendedor", loja_vinculada: "",
      RE: "", senha: "", sexo: "", vinculo: null,
    })
  }

  const handleDeleteFuncionario = async (id) => {
    const res = await fetch(`http://localhost:8080/usuarios/${id}`, {
      method: "DELETE",
      credentials: "include"
    })
    setFuncionarios(funcionarios.filter((f) => f.id !== id))
  }

  // 4. FUNÇÃO AJUSTADA: Reseta o estado para os 8 campos
  const handleCloseDialog = (open) => {
    setIsDialogOpen(open)
    if (!open) {
      setEditingFuncionario(null)
      setFormData({
        nome: "", email: "", cpf: "", contato: "",
        cargo: "vendedor", loja_vinculada: "",
        RE: "", senha: "", sexo: "", vinculo: "",
      })
    }
  }

  const roleFuncionarios = [...new Set(funcionarios.map(user => user.cargo))];
  const [roleFuncionarioSelecionados, setRoleFuncionarioSelecionados] = useState([]);

  const handleRoleFuncionarioChange = (funcionario, checked) => {
    if (checked) {
      setRoleFuncionarioSelecionados([...roleFuncionarioSelecionados, funcionario]);
    } else {
      setRoleFuncionarioSelecionados(roleFuncionarioSelecionados.filter((f) => f !== funcionario));
    }
  };

  const filteredFuncionarios = useMemo(() => {
    let listaFiltrada = funcionarios;

    if (roleFuncionarioSelecionados.length > 0) {
      listaFiltrada = listaFiltrada.filter(funcionario =>
        roleFuncionarioSelecionados.includes(funcionario.cargo)
      );
    }

    if (searchTerm.trim() !== "") {
      const lowerCaseSearch = searchTerm.toLowerCase();

      listaFiltrada = listaFiltrada.filter(funcionario =>
        funcionario.nome.toLowerCase().includes(lowerCaseSearch) ||
        funcionario.RE.toLowerCase().includes(searchTerm) ||
        funcionario.cpf.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro de permissão: Administrador vê tudo, outros veem só a própria loja
    if (user.cargo !== "Administrador" && user.loja_vinculada) {
      listaFiltrada = listaFiltrada.filter(f => f.loja_vinculada === user.loja_vinculada);
    }

    return listaFiltrada;
  }, [funcionarios, roleFuncionarioSelecionados, searchTerm, user]);

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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFuncionario ? "Editar Funcionário" : "Adicionar Funcionário"}</DialogTitle>
              <DialogDescription>
                {editingFuncionario ? "Atualize os dados do funcionário" : "Preencha os dados do novo funcionário"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* FORMULÁRIO AJUSTADO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* COLUNA 1: Informações Básicas */}
                <div className="space-y-4">
                  {/* NOME COMPLETO */}
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="João Silva"
                    />
                  </div>

                  {/* CPF */}
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

                  {/* EMAIL */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="joao@empresa.com"
                    />
                  </div>

                  {/* RE (Registro de Empregado) */}
                  <div className="space-y-2">
                    <Label htmlFor="RE">Registro (RE)</Label>
                    <Input
                      id="RE"
                      value={formData.RE}
                      onChange={(e) => setFormData({ ...formData, RE: e.target.value })}
                      placeholder="Ex: 12345"
                    />
                  </div>

                  {/* SENHA */}
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha</Label>
                    <Input
                      id="senha"
                      type="password"
                      value={formData.senha}
                      onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                      placeholder={editingFuncionario ? "Deixe em branco para não alterar" : "Nova senha"}
                    />
                  </div>
                </div>

                {/* COLUNA 2: Informações de Vínculo e Contato */}
                <div className="space-y-4">
                  {/* CONTATO (Antigo Telefone) */}
                  <div className="space-y-2">
                    <Label htmlFor="contato">Contato (Telefone)</Label>
                    <MaskedInput
                      id="contato"
                      mask="(00) 00000-0000"
                      value={formData.contato}
                      onChange={(value) => setFormData({ ...formData, contato: value })}
                      placeholder="(11) 98765-4321"
                    />
                  </div>

                  {/* SEXO */}
                  <div className="space-y-2">
                    <Label htmlFor="sexo">Sexo</Label>
                    <Select
                      value={formData.sexo}
                      onValueChange={(value) => setFormData({ ...formData, sexo: value })}
                    >
                      <SelectTrigger id="sexo">
                        <SelectValue placeholder="Selecione o sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Feminino">Feminino</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* CARGO (Antiga Role) */}
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Select
                      value={formData.cargo}
                      onValueChange={(value) => setFormData({ ...formData, cargo: value })}
                    >
                      <SelectTrigger id="cargo">
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vendedor">Vendedor</SelectItem>
                        <SelectItem value="Gerente">Gerente</SelectItem>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* VÍNCULO (AGORA É SELECT: Matriz ou Filial) */}
                  <div className="space-y-2">
                    <Label htmlFor="vinculo">Vínculo</Label>
                    <Select
                      value={formData.vinculo}
                      onValueChange={(value) => setFormData({ ...formData, vinculo: value })}
                    >
                      <SelectTrigger id="vinculo">
                        <SelectValue placeholder="Selecione o vínculo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Matriz">Matriz</SelectItem>
                        <SelectItem value="Filial">Filial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* LOJA VINCULADA (Sempre Visível) */}
                  <div className="space-y-2">
                    <Label htmlFor="loja_vinculada">Loja Vinculada</Label>
                    <Select
                      value={formData.loja_vinculada ? String(formData.loja_vinculada) : ""}
                      onValueChange={(value) => setFormData({ ...formData, loja_vinculada: Number(value) })}
                      disabled={formData.vinculo === null || formData.vinculo === ""}
                    >
                      <SelectTrigger id="loja_vinculada">
                        <SelectValue placeholder="Selecione a loja" />
                      </SelectTrigger>
                      <SelectContent>
                        {searchLojas.map((loja) => (
                          <SelectItem key={loja.id} value={String(loja.id)}>
                            {loja.nome ? (
                              <>
                                {loja.nome} {loja.localizacao}
                              </>
                            ) : (
                              <>
                                Selecione a loja!
                              </>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => handleCloseDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={() => handleSaveFuncionario()}>{editingFuncionario ? "Salvar" : "Adicionar"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Ajustado: Estatísticas para Administrador */}
      {user.cargo === "Administrador" && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
          <div
            className="rounded-xl p-6 border bg-card border-border shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Total de funcionários</h3>
              {/* <Icon className="w-5 h-5 text-foreground/60" /> */}
            </div>
            <div className="text-3xl font-bold mb-1">{funcionarios.length}</div>
          </div>
          <div
            className="rounded-xl p-6 border bg-card border-border shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Média de funcionários por loja</h3>
              {/* <Icon className="w-5 h-5 text-foreground/60" /> */}
            </div>
            <div className="text-3xl font-bold mb-1">{media}</div>
          </div>
        </div>
      )}

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
            placeholder="Buscar por nome, RE ou CPF..."
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
          />
        )}
        itemsPerPage={10}
      />

    </div>
  )
}
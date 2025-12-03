"use client"

import { useState, useMemo, useEffect } from "react"
import { mockFornecedores } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MaskedInput } from '@/components/ui/masked-input'
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search } from "lucide-react"

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
import { CardFornecedor } from "@/components/cards/CardFornecedor";

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState(mockFornecedores)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFornecedor, setEditingFornecedor] = useState(null)
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    contato: "",
    telefone: "",
    email: "",
    setor: "",
  })


  const handleEditFornecedor = (fornecedor) => {
    setEditingFornecedor(fornecedor)
    setFormData({
      nome: fornecedor.nome,
      setor: fornecedor.setor,
      cnpj: fornecedor.cnpj,
      contato: fornecedor.contato,
      telefone: fornecedor.telefone,
      email: fornecedor.email,
    })
    setIsDialogOpen(true)
  }

  const handleSaveFornecedor = () => {
    if (editingFornecedor) {
      setFornecedores(
        fornecedores.map((f) =>
          f.id === editingFornecedor.id
            ? {
              ...f,
              nome: formData.nome,
              setor: formData.setor,
              cnpj: formData.cnpj,
              contato: formData.contato,
              telefone: formData.telefone,
              email: formData.email,
            }
            : f,
        ),
      )
    } else {
      const newFornecedor = {
        id: String(Date.now()),
        nome: formData.nome,
        setor: formData.setor,
        cnpj: formData.cnpj,
        contato: formData.contato,
        telefone: formData.telefone,
        email: formData.email,
        ativo: true,
      }
      setFornecedores([...fornecedores, newFornecedor])
    }

    setIsDialogOpen(false)
    setEditingFornecedor(null)
    setFormData({
      nome: "",
      cnpj: "",
      contato: "",
      telefone: "",
      email: "",
    })
  }

  const handleDeleteFornecedor = (id) => {
    setFornecedores(fornecedores.filter((f) => f.id !== id))
  }

  const handleCloseDialog = (open) => {
    setIsDialogOpen(open)
    if (!open) {
      setEditingFornecedor(null)
      setFormData({
        setor: "",
        nome: "",
        cnpj: "",
        contato: "",
        telefone: "",
        email: "",
      })
    }
  }

  //visualizar por setor
  const setores = [...new Set(mockFornecedores.map(setor => setor.setor.toLowerCase()))];

  const [setoresSelecionados, setSetoresSelecionados] = useState([]);

  const handlesetoresChange = (setor, checked) => {
    if (checked) {
      setSetoresSelecionados([...setoresSelecionados, setor]);
    } else {
      setSetoresSelecionados(setoresSelecionados.filter((s) => s !== setor));
    }

  };

  const filteredFornecedores = useMemo(() => {
    // Comece com a lista completa
    let listaFiltrada = fornecedores;
    // Se houver algum setor selecionado, filtre por ele
    if (setoresSelecionados.length > 0) {
      listaFiltrada = listaFiltrada.filter(fornecedor =>
        setoresSelecionados.includes(fornecedor.setor.toLowerCase())
      );
    }

    //filtrar resultados
    if (searchTerm.trim() !== "") {
      const lowerCaseSearch = searchTerm.toLowerCase();
      listaFiltrada = listaFiltrada.filter(fornecedor =>
        fornecedor.nome.toLowerCase().includes(lowerCaseSearch) ||
        fornecedor.cnpj.toLowerCase().includes(lowerCaseSearch) ||
        fornecedor.contato.toLowerCase().includes(lowerCaseSearch) ||
        fornecedor.setor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // lista final filtrada
    return listaFiltrada;

    // O 'useMemo' só vai rodar esta lógica quando um destes 3 estados mudar.
  }, [fornecedores, setoresSelecionados, searchTerm]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Fornecedores</h1>
          <p className="text-muted-foreground mt-1">Gerencie os fornecedores de produtos químicos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Fornecedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFornecedor ? "Editar Fornecedor" : "Adicionar Fornecedor"}</DialogTitle>
              <DialogDescription>
                {editingFornecedor ? "Atualize os dados do fornecedor" : "Preencha os dados do novo fornecedor"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Empresa</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Química Industrial Ltda"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Setor da Empresa</Label>
                <Input
                  id="nome"
                  value={formData.setor}
                  onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                  placeholder="Setor da Agroindústria"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <MaskedInput
                  id="cnpj"
                  mask="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={(value) => setFormData({ ...formData, cnpj: value })}
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contato">Nome do Contato</Label>
                <Input
                  id="contato"
                  value={formData.contato}
                  onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
                  placeholder="João Silva"
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contato@fornecedor.com"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => handleCloseDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveFornecedor}>{editingFornecedor ? "Salvar" : "Adicionar"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-fit">Visualizar por setor</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44">
            <DropdownMenuLabel>Selecione setor</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {setores.map((setores) => (
              <DropdownMenuCheckboxItem
                checked={setoresSelecionados.includes(setores)}
                key={setores}
                onCheckedChange={(checked) => handlesetoresChange(setores, checked)}
                // Prevent the dropdown menu from closing when the checkbox is clicked
                onSelect={(e) => e.preventDefault()}
              >
                {setores}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-row gap-2 flex-wrap relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CNPJ ou contato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ControlePaginacao
        items={filteredFornecedores}
        renderItem={(fornecedor) => (
          <CardFornecedor
            key={fornecedor.id}
            fornecedor={fornecedor}
            onEdit={handleEditFornecedor}
            onDelete={handleDeleteFornecedor}
          />
        )}
        itemsPerPage={9}
      />
    </div>
  )
}

"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/app/contexts/auth-context";
// import { mockFornecedores } from "@/lib/mock-data"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const { user } = useAuth();
  const [fornecedores, setFornecedores] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    cnpj: "",
    telefone: "",
    email: "",
    setor: "",
    contato: "",
    localizacao: "",
    loja_vinculada: "",
  });
  const [lojas, setLojas] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/fornecedores", {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setFornecedores(data.fornecedores);
      });

    fetch("http://localhost:8080/lojas", {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLojas(data.lojas);
      });
  }, []);

  if (!user) return null;

  const filteredByRole = fornecedores
    ? user.cargo === "Administrador"
      ? fornecedores
      : fornecedores.filter((p) => p.loja_vinculada == user.lojaId)
    : null;

  const handleEditFornecedor = (fornecedor) => {
    setEditingFornecedor(fornecedor);
    setFormData({
      id: fornecedor.id,
      nome: fornecedor.nome,
      setor: fornecedor.setor,
      cnpj: fornecedor.cnpj,
      telefone: fornecedor.telefone,
      email: fornecedor.email,
      localizacao: fornecedor.localizacao,
      contato: fornecedor.contato,
      loja_vinculada: fornecedor.loja_vinculada,
    });
    setIsDialogOpen(true);
  };

  const handleSaveFornecedor = () => {
    if (editingFornecedor) {
      fetch(`http://localhost:8080/fornecedores/${formData.id}`, {
        method: "put",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then((res) => {
        if (!res.ok) {
          return alert("Houve um erro");
        }
      });
      setFornecedores(
        fornecedores.map((f) =>
          f.id === editingFornecedor.id
            ? {
                ...f,
                id: formData.id,
                nome: formData.nome,
                setor: formData.setor,
                cnpj: formData.cnpj,
                telefone: formData.telefone,
                email: formData.email,
                localizacao: formData.localizacao,
                contato: formData.contato,
                loja_vinculada: formData.loja_vinculada,
              }
            : f
        )
      );
    } else {
      fetch("http://localhost:8080/fornecedores", {
        method: "post",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => {
          if (!res.ok) {
            return alert("Houve um erro");
          }
          return res.json();
        })
        .then((data) => {
          const newFornecedor = {
            // id: String(Date.now()),
            id: data.criado,
            nome: formData.nome,
            setor: formData.setor,
            cnpj: formData.cnpj,
            telefone: formData.telefone,
            email: formData.email,
            localizacao: formData.localizacao,
            contato: formData.contato,
            loja_vinculada: formData.loja_vinculada,
            ativo: true,
          };
          setFornecedores([...fornecedores, newFornecedor]);
        });
    }
    setIsDialogOpen(false);
    setEditingFornecedor(null);
    setFormData({
      id: "",
      nome: "",
      cnpj: "",
      telefone: "",
      email: "",
      setor: "",
      localizacao: "",
      contato: "",
      loja_vinculada: "",
    });
  };

  const handleDeleteFornecedor = async (id) => {
    const res = await fetch(`http://localhost:8080/fornecedores/${id}`, {
      credentials: "include",
      method: "delete",
    });
    if (res.status == 400) {
      return alert(
        "Não foi possível deletar este items pois há outros referencinado ele"
      );
    }
    if (!res.ok) {
      return alert("Houve um erro");
    }
    setFornecedores(fornecedores.filter((f) => f.id !== id));
  };

  const handleCloseDialog = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setFormData({
        id: "",
        nome: "",
        cnpj: "",
        telefone: "",
        email: "",
        setor: "",
        localizacao: "",
        contato: "",
        loja_vinculada: "",
      });
      setEditingFornecedor(null);
    }
  };

  //visualizar por setor
  const setores = fornecedores
    ? [...new Set(fornecedores.map((setor) => setor.setor.toLowerCase()))]
    : null;

  const [setoresSelecionados, setSetoresSelecionados] = useState([]);

  const handlesetoresChange = (setor, checked) => {
    if (checked) {
      setSetoresSelecionados([...setoresSelecionados, setor]);
    } else {
      setSetoresSelecionados(setoresSelecionados.filter((s) => s !== setor));
    }
  };

  const filteredFornecedores = useMemo(() => {
    if (!filteredByRole) return [];

    // 2. Start with 'filteredByRole' instead of raw 'produtos'
    let listaFiltrada = filteredByRole;
    // Se houver algum setor selecionado, filtre por ele
    if (setoresSelecionados.length > 0) {
      listaFiltrada = listaFiltrada.filter((fornecedor) =>
        setoresSelecionados.includes(fornecedor.setor.toLowerCase())
      );
    }

    //filtrar resultados
    if (searchTerm.trim() !== "") {
      const lowerCaseSearch = searchTerm.toLowerCase();
      listaFiltrada = listaFiltrada.filter(
        (fornecedor) =>
          fornecedor.nome.toLowerCase().includes(lowerCaseSearch) ||
          fornecedor.cnpj.toLowerCase().includes(lowerCaseSearch) ||
          fornecedor.contato.toLowerCase().includes(lowerCaseSearch) ||
          fornecedor.setor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // lista final filtrada
    return listaFiltrada;

    // O 'useMemo' só vai rodar esta lógica quando um destes 3 estados mudar.
  }, [filteredByRole, setoresSelecionados, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Fornecedores</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os fornecedores de produtos químicos
          </p>
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
              <DialogTitle>
                {editingFornecedor
                  ? "Editar Fornecedor"
                  : "Adicionar Fornecedor"}
              </DialogTitle>
              <DialogDescription>
                {editingFornecedor
                  ? "Atualize os dados do fornecedor"
                  : "Preencha os dados do novo fornecedor"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Empresa</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Química Industrial Ltda"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Setor da Empresa</Label>
                <Input
                  id="nome"
                  value={formData.setor}
                  onChange={(e) =>
                    setFormData({ ...formData, setor: e.target.value })
                  }
                  placeholder="Setor da Agroindústria"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <MaskedInput
                  id="cnpj"
                  mask="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={(value) =>
                    setFormData({ ...formData, cnpj: value })
                  }
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <MaskedInput
                  id="telefone"
                  mask="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={(value) =>
                    setFormData({ ...formData, telefone: value })
                  }
                  placeholder="(11) 98765-4321"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="contato@fornecedor.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Contato</Label>
                <Input
                  id="contato"
                  type="text"
                  value={formData.contato}
                  onChange={(e) =>
                    setFormData({ ...formData, contato: e.target.value })
                  }
                  placeholder="Refinaria Química.inc"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Localização</Label>
                <Input
                  id="localizacao"
                  type="text"
                  value={formData.localizacao}
                  onChange={(e) =>
                    setFormData({ ...formData, localizacao: e.target.value })
                  }
                  placeholder="Pindamonhaguaba - SP"
                />
              </div>
              {user.cargo === "Administrador" ? (
                <div className="space-y-2">
                  <Label htmlFor="loja">Loja</Label>
                  <Select
                    value={formData.loja_vinculada}
                    onValueChange={(value) =>
                      setFormData({ ...formData, loja_vinculada: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma loja" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {lojas
                        ? lojas.map((loja) => (
                            <SelectItem key={loja.id} value={loja.id}>
                              {loja.nome}
                            </SelectItem>
                          ))
                        : null}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                useEffect(()=>{
                  setFormData({ ...formData, loja_vinculada: user.lojaId })
                },[])
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => handleCloseDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveFornecedor}>
                {editingFornecedor ? "Salvar" : "Adicionar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-fit">
              Visualizar por setor
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44">
            <DropdownMenuLabel>Selecione setor</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {setores ? (
              <>
                {setores.map((setores) => (
                  <DropdownMenuCheckboxItem
                    checked={setoresSelecionados.includes(setores)}
                    key={setores}
                    onCheckedChange={(checked) =>
                      handlesetoresChange(setores, checked)
                    }
                    // Prevent the dropdown menu from closing when the checkbox is clicked
                    onSelect={(e) => e.preventDefault()}
                  >
                    {setores}
                  </DropdownMenuCheckboxItem>
                ))}
              </>
            ) : (
              <></>
            )}
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
            lojaId={fornecedor.loja_vinculada}
            lojas={lojas}
          />
        )}
        itemsPerPage={9}
      />
    </div>
  );
}

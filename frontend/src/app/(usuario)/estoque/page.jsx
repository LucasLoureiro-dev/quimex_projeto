"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/app/contexts/auth-context";
import { mockProdutos, mockLojas } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from '@/components/ui/masked-input';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, } from "lucide-react";

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
import { CardEstoque } from "@/components/cards/CardEstoque";

export default function EstoquePage() {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState(mockProdutos);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    sku: "",
    preco: "",
    estoque: "",
    filial: "",
    classificacao: "",
  });

  //primeira letra maiuscula
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  if (!user) return null;

  const filteredByRole =
    user.role === "admin_matriz"
      ? produtos
      : produtos.filter((p) => p.filial === user.filial);

  const handleEditProduto = (produto) => {
    setEditingProduto(produto);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      sku: produto.sku,
      preco: produto.preco.toString(),
      estoque: produto.estoque.toString(),
      filial: produto.filial,
      classificacao: produto.classificacao,
    });
    setIsDialogOpen(true);
  };

  const handleSaveProduto = () => {
    if (editingProduto) {
      setProdutos(
        produtos.map((p) =>
          p.id === editingProduto.id
            ? {
              ...p,
              nome: formData.nome,
              descricao: formData.descricao,
              sku: formData.sku,
              classificacao: formData.classificacao,
              preco: Number.parseFloat(formData.preco),
              estoque: Number.parseInt(formData.estoque),
              filial: formData.filial || user.filial || "1",
            }
            : p
        )
      );
    } else {
      const newProduto = {
        id: String(Date.now()),
        nome: formData.nome,
        descricao: formData.descricao,
        classificacao: formData.classificacao,
        sku: formData.sku,
        preco: Number.parseFloat(formData.preco),
        estoque: Number.parseInt(formData.estoque),
        filial: formData.filial || user.filial || "1",
        ativo: true,
      };
      setProdutos([...produtos, newProduto]);
    }

    setIsDialogOpen(false);
    setEditingProduto(null);
    setFormData({
      nome: "",
      descricao: "",
      sku: "",
      preco: "",
      estoque: "",
      filial: "",
      classificacao: "",
    });
  };

  const handleDeleteProduto = (id) => {
    setProdutos(produtos.filter((p) => p.id !== id));
  };

  const handleCloseDialog = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingProduto(null);
      setFormData({
        nome: "",
        descricao: "",
        sku: "",
        preco: "",
        estoque: "",
        filial: "",
        classificacao: "",
      });
    }
  };

  const getLojaNome = (filial) => {
    const loja = mockLojas.find((l) => l.id === filial);
    console.log(mockLojas.filial)
    return loja?.nome || "N/A";
  };

  const getStockBadgeVariant = (estoque) => {
    if (estoque > 10) return "default";
    if (estoque > 0) return "secondary";
    return "destructive";
  };

  //visualizar por classificação
  const classificacao = [...new Set(mockProdutos.map(produto => produto.classificacao.toLowerCase()))];
  const [classificacaoSelecionados, setClassificacaoSelecionados] = useState([]);

  const handleClassificacaoChange = (classificacao, checked) => {
    if (checked) {
      setClassificacaoSelecionados([...classificacaoSelecionados, classificacao]);
    } else {
      setClassificacaoSelecionados(classificacaoSelecionados.filter((c) => c !== classificacao));
    }
  };

  const filial = [...new Set(mockProdutos.map(produto => produto.filial.toLowerCase()))];
  const [filialSelecionados, setFilialSelecionados] = useState([]);

  const handleFilialChange = (filial, checked) => {
    if (checked) {
      setFilialSelecionados([...filialSelecionados, filial]);
    } else {
      setFilialSelecionados(filialSelecionados.filter((c) => c !== filial));
    }
  };

  const filteredProdutos = useMemo(() => {
    let listaFiltrada = produtos;

    if (classificacaoSelecionados.length > 0) {
      listaFiltrada = listaFiltrada.filter(produtos =>
        classificacaoSelecionados.includes(produtos.classificacao.toLowerCase())
      );
    }
    if (filialSelecionados.length > 0) {
      listaFiltrada = listaFiltrada.filter(produto =>
        filialSelecionados.includes(produto.filial.toLowerCase())
      );
    }
    //filtrar resultados
    if (searchTerm.trim() !== "") {
      const lowerCaseSearch = searchTerm.toLowerCase();

      listaFiltrada = listaFiltrada.filter(produto =>
        produto.nome.toLowerCase().includes(lowerCaseSearch) ||
        produto.filial.toLowerCase().includes(lowerCaseSearch) ||
        produto.sku.toLowerCase().includes(lowerCaseSearch) ||
        produto.classificacao.toLowerCase().includes(lowerCaseSearch)
      );
    }
    // lista final filtrada
    return listaFiltrada;
  }, [filteredByRole, classificacaoSelecionados, filialSelecionados, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Estoque</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o estoque de produtos químicos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduto ? "Editar Produto" : "Adicionar Produto"}
              </DialogTitle>
              <DialogDescription>
                {editingProduto
                  ? "Atualize os dados do produto"
                  : "Preencha os dados do novo produto"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Ácido Sulfúrico"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Classificação por função</Label>
                <Input
                  id="classificacao"
                  value={formData.classificacao}
                  onChange={(e) =>
                    setFormData({ ...formData, classificacao: e.target.value })
                  }
                  placeholder="Aditivo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Descrição detalhada do produto químico"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU / Código</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  placeholder="QMX-001"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <MaskedInput
                    id="valor"
                    type="currency"
                    value={formData.preco}
                    onChange={(value) => setFormData({ ...formData, preco: value })}
                    placeholder="R$ 0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estoque">Estoque</Label>
                  <Input
                    id="estoque"
                    type="number"
                    value={formData.estoque}
                    onChange={(e) =>
                      setFormData({ ...formData, estoque: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>
              </div>
              {user.role === "admin_matriz" && (
                <div className="space-y-2">
                  <Label htmlFor="loja">Loja</Label>
                  <Select
                    value={formData.filial}
                    onValueChange={(value) =>
                      setFormData({ ...formData, filial: value })
                    }
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
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => handleCloseDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveProduto}>
                {editingProduto ? "Salvar" : "Adicionar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>


      <div className="flex flex-col md:flex-row gap-2 w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-fit">Visualizar por local da filial</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44">
            <DropdownMenuLabel>Selecione filial</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filial.map((filial) => (
              <DropdownMenuCheckboxItem
                checked={filialSelecionados.includes(filial)}
                key={filial}
                onCheckedChange={(checked) => handleFilialChange(filial, checked)}
                // Prevent the dropdown menu from closing when the checkbox is clicked
                onSelect={(e) => e.preventDefault()}
              >
                {capitalize(filial)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-fit">Visualizar por categoria</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44">
            <DropdownMenuLabel>Selecione a categoria</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {classificacao.map((classificacao) => (
              <DropdownMenuCheckboxItem
                checked={classificacaoSelecionados.includes(classificacao)}
                key={classificacao}
                onCheckedChange={(checked) => handleClassificacaoChange(classificacao, checked)}
                // Prevent the dropdown menu from closing when the checkbox is clicked
                onSelect={(e) => e.preventDefault()}>
                {capitalize(classificacao)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-row gap-2 flex-wrap relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, SKU ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ControlePaginacao
        items={filteredProdutos}
        renderItem={(produto) => (
          <CardEstoque
            key={produto.id}
            nomeLoja={getLojaNome}
            produto={produto}
            onEdit={handleEditProduto}
            onDelete={handleDeleteProduto}
            badgeVariant={getStockBadgeVariant}
          />
        )}
        itemsPerPage={9}
      />
    </div>
  );
}
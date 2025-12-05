"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/app/contexts/auth-context";
// import { mockProdutos, mockLojas } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
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
import { Plus, Search } from "lucide-react";

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
import CardProdutos from "@/components/cards/CardProdutos";

export default function ProdutosPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);
  const [produtos, setProdutos] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState(null);
  const [fornecedores, setFornecedores] = useState("");
  const [imagem, setImagem] = useState("");
  const [data, setData] = useState({
    id: "",
    nome: "",
    codigo_de_barras: "",
    descricao: "",
    preco: "",
    sku: "",
    quantidade: "",
    classificacao: "",
    fornecedor: "",
    codigoCor: "",
    imagem: "",
    filial: "",
  });
  const [lojas, setLojas] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/produtos", {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setProdutos(data.produtos);
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

    fetch("http://localhost:8080/fornecedores", {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setFornecedores(data.fornecedores);
      });
  }, []);

  const filteredByRole = user
    ? user.cargo === "Administrador"
      ? produtos
      : produtos.filter((p) => p.filial == user.lojaId)
    : null;

  const handleEditProduto = (produto) => {
    setEditingProduto(produto);
    setData({
      id: produto.id,
      nome: produto.nome,
      codigo_de_barras: produto.codigo_de_barras,
      descricao: produto.descricao,
      preco: produto.preco.toString(),
      sku: produto.sku,
      quantidade: produto.quantidade.toString(),
      classificacao: produto.classificacao,
      fornecedor: produto.fornecedor,
      codigoCor: produto.codigoCor,
      imagem: produto.imagem,
      filial: parseInt(produto.filial),
    });
    setIsDialogOpen(true);
  };

  const handleSaveProduto = async () => {
    if (data.quantidade < 0 || data.preco <= 0) {
      return alert(
        "Quantidade não pode ser menor que zero, preço necessita ser maior que zero"
      );
    }
    const formData = new FormData();
    formData.append("nome", data.nome);
    formData.append("codigo_de_barras", data.codigo_de_barras);
    formData.append("descricao", data.descricao);
    formData.append("classificacao", data.classificacao);
    formData.append("sku", data.sku);
    formData.append("preco", data.preco);
    formData.append("quantidade", data.quantidade);
    formData.append("fornecedor", data.fornecedor);
    formData.append("codigoCor", data.codigoCor);
    formData.append("imagem", data.imagem);
    formData.append("filial", data.filial);
    if (imagem) formData.append("imagem", imagem);

    if (editingProduto) {
      const res = await fetch(`http://localhost:8080/produtos/${data.id}`, {
        method: "put",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        return alert("Houve um erro");
      }

      const path = await res.json();

      setProdutos(
        produtos.map((p) =>
          p.id === editingProduto.id
            ? {
                ...p,
                id: data.id,
                nome: data.nome,
                codigo_de_barras: data.codigo_de_barras,
                descricao: data.descricao,
                classificacao: data.classificacao,
                sku: data.sku,
                preco: Number.parseFloat(data.preco),
                quantidade: Number.parseInt(data.quantidade),
                fornecedor: data.fornecedor,
                codigoCor: data.codigoCor,
                imagem: path.path,
                filial: data.filial,
              }
            : p
        )
      );
    } else {
      const res = await fetch(`http://localhost:8080/produtos`, {
        method: "post",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        return alert("Houve um erro");
      }

      const path = await res.json();

      const newProduto = {
        id: path.criado,
        nome: data.nome,
        codigo_de_barras: data.codigo_de_barras,
        descricao: data.descricao,
        classificacao: data.classificacao,
        sku: data.sku,
        preco: Number.parseFloat(data.preco),
        quantidade: Number.parseInt(data.quantidade),
        fornecedor: data.fornecedor,
        codigoCor: data.codigoCor,
        imagem: path.capaPath,
        filial: data.filial,
        ativo: true,
      };
      setProdutos([...produtos, newProduto]);
    }

    setIsDialogOpen(false);
    setEditingProduto(null);
    setData({
      nome: "",
      codigo_de_barras: "",
      descricao: "",
      preco: "",
      sku: "",
      quantidade: "",
      classificacao: "",
      fornecedor: "",
      codigoCor: "",
      imagem: "",
      filial: "",
    });
  };

  const handleDeleteProduto = async (id) => {
    const res = await fetch(`http://localhost:8080/produtos/${id}`, {
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
    setProdutos(produtos.filter((p) => p.id !== id));
  };

  const handleCloseDialog = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingProduto(null);
      setData({
        nome: "",
        codigo_de_barras: "",
        descricao: "",
        preco: "",
        sku: "",
        quantidade: "",
        classificacao: "",
        fornecedor: "",
        codigoCor: "",
        imagem: "",
        filial: "",
      });
    }
  };

  const getLojaNome = (lojaId) => {
    const loja = mockLojas.find((l) => l.id === lojaId);
    return loja?.nome || "N/A";
  };

  const getStockBadgeVariant = (estoque) => {
    if (estoque > 10) return "default";
    if (estoque > 0) return "secondary";
    return "destructive";
  };

  //visualizar por classificação
  const classificacao = produtos
    ? [
        ...new Set(
          produtos.map((produto) => produto.classificacao.toLowerCase())
        ),
      ]
    : null;

  const [classificacaoSelecionados, setClassificacaoSelecionados] = useState(
    []
  );

  const handleClassificacaoChange = (classificacao, checked) => {
    if (checked) {
      setClassificacaoSelecionados([
        ...classificacaoSelecionados,
        classificacao,
      ]);
    } else {
      setClassificacaoSelecionados(
        classificacaoSelecionados.filter((c) => c !== classificacao)
      );
    }
  };
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const filteredProdutos = useMemo(() => {
    if (!filteredByRole) return [];

    // 2. Start with 'filteredByRole' instead of raw 'produtos'
    let listaFiltrada = filteredByRole;

    if (classificacaoSelecionados.length > 0) {
      listaFiltrada = listaFiltrada.filter((produtos) =>
        classificacaoSelecionados.includes(produtos.classificacao.toLowerCase())
      );
    }

    //filtrar resultados
    if (searchTerm.trim() !== "") {
      const lowerCaseSearch = searchTerm.toLowerCase();

      listaFiltrada = listaFiltrada.filter(
        (produto) =>
          produto.nome.toLowerCase().includes(lowerCaseSearch) ||
          produto.sku.toLowerCase().includes(lowerCaseSearch) ||
          produto.classificacao.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // lista final filtrada
    return listaFiltrada;
  }, [filteredByRole, classificacaoSelecionados, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Produtos Químicos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o catálogo de produtos químicos obrigatórios de cada loja.
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
                  value={data.nome}
                  onChange={(e) => setData({ ...data, nome: e.target.value })}
                  placeholder="Ácido Sulfúrico"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Classificação por função</Label>
                <Select
                  value={data.classificacao}
                  onValueChange={(value) =>
                    setData({ ...data, classificacao: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um setor" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value={"Ácidos Inorgânicos"}>
                      Ácidos Inorgânicos
                    </SelectItem>
                    <SelectItem value={"Ácidos Orgânicos"}>
                      Ácidos Orgânicos
                    </SelectItem>
                    <SelectItem value={"Bases"}>Bases</SelectItem>
                    <SelectItem
                      value={"Ácidos Inorgânicos Oxidantes/Manuseio Especial"}
                    >
                      Ácidos Inorgânicos Oxidantes/Manuseio Especial
                    </SelectItem>
                    <SelectItem value={"Oxidantes"}>Oxidantes</SelectItem>
                    <SelectItem value={"Tóxicos"}>Tóxicos</SelectItem>
                    <SelectItem value={"Inflamáveis"}>Inflamáveis</SelectItem>
                    <SelectItem value={"Químicos Gerais"}>
                      Químicos Gerais
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={data.descricao}
                  onChange={(e) =>
                    setData({ ...data, descricao: e.target.value })
                  }
                  placeholder="Descrição detalhada do produto químico"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">Código de barras</Label>
                <MaskedInput
                  mask="00000000000"
                  type="number"
                  id="codigo_de_barras"
                  value={data.codigo_de_barras}
                  onChange={(value) =>
                    setData({ ...data, codigo_de_barras: value })
                  }
                  placeholder="123456789012"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU / Código</Label>
                <Input
                  id="sku"
                  value={data.sku}
                  onChange={(e) => setData({ ...data, sku: e.target.value })}
                  placeholder="QMX-001"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <MaskedInput
                    mask="000000000"
                    id="valor"
                    type="number"
                    value={data.preco}
                    onChange={(value) => setData({ ...data, preco: value })}
                    placeholder="R$ 0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estoque">Estoque</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    value={data.quantidade}
                    onChange={(e) =>
                      setData({ ...data, quantidade: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>
              </div>
              {user ? (
                user.cargo === "Administrador" ? (
                  <div className="space-y-2">
                    <Label htmlFor="loja">Loja</Label>
                    <Select
                      value={data.filial}
                      onValueChange={(value) =>
                        setData({ ...data, filial: value })
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
                  useEffect(() => {
                    setData({
                      ...data,
                      filial: user.lojaId,
                    });
                  }, [])
                )
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="loja">Fornecedor</Label>
                <Select
                  value={data.fornecedor}
                  onValueChange={(value) =>
                    setData({ ...data, fornecedor: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma loja" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {fornecedores
                      ? fornecedores.map((fornecedor) => (
                          <SelectItem key={fornecedor.id} value={fornecedor.id}>
                            {fornecedor.nome}
                          </SelectItem>
                        ))
                      : null}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">Código da cor</Label>
                <Input
                  id="codigoCor"
                  value={data.codigoCor}
                  onChange={(e) =>
                    setData({ ...data, codigoCor: e.target.value })
                  }
                  placeholder="QMX-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">Imagem</Label>
                <Input
                  type="file"
                  id="imagem"
                  accept="image/*"
                  onChange={(e) => setImagem(e.target.files[0])}
                />
              </div>
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
            <Button variant="outline" className="w-fit">
              Visualizar por categoria
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44">
            <DropdownMenuLabel>Selecione categoria</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {classificacao
              ? classificacao.map((classificacao) => (
                  <DropdownMenuCheckboxItem
                    checked={classificacaoSelecionados.includes(classificacao)}
                    key={classificacao}
                    onCheckedChange={(checked) =>
                      handleClassificacaoChange(classificacao, checked)
                    }
                    // Prevent the dropdown menu from closing when the checkbox is clicked
                    onSelect={(e) => e.preventDefault()}
                  >
                    {capitalize(classificacao)}
                  </DropdownMenuCheckboxItem>
                ))
              : null}
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
          // imagem produto
          <CardProdutos
            key={produto.id}
            nomeLoja={getLojaNome}
            produto={produto}
            onEdit={handleEditProduto}
            onDelete={handleDeleteProduto}
            badgeVariant={getStockBadgeVariant}
            lojaId={produto.lojaId}
          />
        )}
        itemsPerPage={9}
      />
    </div>
  );
}

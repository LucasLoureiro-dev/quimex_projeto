"use client";

import { useState, useMemo } from "react";
import { canManageLojas } from "@/lib/utils/permissions";
import { mockLojas, mockUsers, mockFornecedores } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LojaCard from "@/components/cards/cardLoja";

import Tabela from "@/components/tabelaPaginacao/tabelaPaginacao";
import TabelaFornecedores from "@/components/tabelaFornecedores/tabelaFornecedores";

export default function LojasPage() {
  const [lojas, setLojas] = useState(mockLojas);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLoja, setEditingLoja] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    nomeGerente: "",
    cpfGerente: "",
    id: "",
    cnpj: "",
    endereco: "",
    cidade: "",
    estado: "",
    telefone: "",
    tipo: "filial",
  });

  const handleEditLoja = (loja) => {
    setEditingLoja(loja);
    setFormData({
      nome: loja.nome,
      nomeGerente: loja.gerenteLoja,
      cpfGerente: loja.cpfGerente,
      cnpj: loja.cnpj,
      endereco: loja.endereco,
      cidade: loja.cidade,
      estado: loja.estado,
      telefone: loja.telefone,
      tipo: loja.tipo,
    });
    setIsDialogOpen(true);
  };

  const handleSaveLoja = () => {
    if (editingLoja) {
      setLojas(
        lojas.map((l) =>
          l.id === editingLoja.id
            ? {
                ...l,
                nome: formData.nome,
                nomeGerente: formData.nomeGerente,
                cpfGerente: formData.cpfGerente,
                cnpj: formData.cnpj,
                endereco: formData.endereco,
                cidade: formData.cidade,
                estado: formData.estado,
                telefone: formData.telefone,
                tipo: formData.tipo,
              }
            : l
        )
      );
    } else {
      const newLoja = {
        id: String(Date.now()),
        nome: formData.nome,
        nomeGerente: formData.nomeGerente,
        cpfGerente: formData.cpfGerente,
        cnpj: formData.cnpj,
        endereco: formData.endereco,
        cidade: formData.cidade,
        estado: formData.estado,
        telefone: formData.telefone,
        tipo: formData.tipo,
        ativo: true,
      };
      setLojas([...lojas, newLoja]);
    }

    setIsDialogOpen(false);
    setEditingLoja(null);
    setFormData({
      nome: "",
      nomeGerente: "",
      cpfGerente: "",
      cnpj: "",
      endereco: "",
      cidade: "",
      estado: "",
      telefone: "",
      tipo: "filial",
    });
  };

  const handleDeleteLoja = (id) => {
    const loja = lojas.find((l) => l.id === id);
    if (loja?.tipo === "Matriz") {
      alert("Não é possível excluir a loja matriz!");
      return;
    }
    setLojas(lojas.filter((l) => l.id !== id));
  };

  const handleCloseDialog = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingLoja(null);
      setFormData({
        nome: "",
        nomeGerente: "",
        cpfGerente: "",
        cnpj: "",
        endereco: "",
        cidade: "",
        estado: "",
        telefone: "",
        tipo: "filial",
      });
    }
  };

  const tipoLoja = [
    ...new Set(mockLojas.map((loja) => loja.tipo.toLowerCase())),
  ];
  const [tipoLojaSelecionados, setTipoLojaSelecionados] = useState([]);

  const handleLojaChange = (loja, checked) => {
    loja;
    if (checked) {
      setTipoLojaSelecionados([...tipoLojaSelecionados, loja]);
    } else {
      setTipoLojaSelecionados(tipoLojaSelecionados.filter((l) => l !== loja));
    }
  };
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const filteredLojas = useMemo(() => {
    // Comece com a lista completa
    let listaFiltrada = lojas;

    if (tipoLojaSelecionados.length > 0) {
      listaFiltrada = listaFiltrada.filter((loja) =>
        tipoLojaSelecionados.includes(loja.tipo.toLowerCase())
      );
    }

    //filtrar resultados
    if (searchTerm.trim() !== "") {
      const lowerCaseSearch = searchTerm.toLowerCase();
      listaFiltrada = listaFiltrada.filter(
        (loja) =>
          loja.nome.toLowerCase().includes(lowerCaseSearch) ||
          loja.estado.toLowerCase().includes(lowerCaseSearch) ||
          loja.cidade.toLowerCase().includes(lowerCaseSearch) ||
          loja.endereco.toLowerCase().includes(lowerCaseSearch)
      );
    }
    // lista final filtrada
    return listaFiltrada;

    // O 'useMemo' só vai rodar esta lógica quando um destes 3 estados mudar.
  }, [lojas, tipoLojaSelecionados, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Loja</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie sua loja da rede Quimex
          </p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto">
        <LojaCard
          nomeGerente="batman"
          filial="Sudeste"
          cnpj="12351312"
          cidade="São Caetano"
          estado="São Paulo"
          contato="11-2131312"
        />
      </div>
      <div className="rounded-lg bg-muted px-3 py-3">
        <Tabs defaultValue="gerenciarFuncionarios">
          <TabsList>
            <TabsTrigger value="gerenciarFuncionarios">Gerenciar Funcionários</TabsTrigger>
            <TabsTrigger value="gerenciarFornecedores">Gerenciar Fornecedores</TabsTrigger>
          </TabsList>
          <TabsContent value="gerenciarFuncionarios">
            <Tabela data={mockUsers} />
          </TabsContent>
          <TabsContent value="gerenciarFornecedores">
            <TabelaFornecedores data={mockFornecedores} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

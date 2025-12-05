"use client";

import { useState, useMemo, useEffect } from "react";
import { canManageLojas } from "@/lib/utils/permissions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LojaCard from "@/components/cards/cardLoja";

import Tabela from "@/components/tabelaPaginacao/tabelaPaginacao";
import TabelaFornecedores from "@/components/tabelaFornecedores/tabelaFornecedores";

export default function LojasPage() {
  const [lojas, setLojas] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [funcionarios, setFuncionarios] = useState([])
  const [fornecedores, setFornecedores] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLoja, setEditingLoja] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    tipo: "",
    localizacao: "",
    estado: "",
    contato: "",
    horario_abrtura: "",
    horario_fechamento: "",
  });

  useEffect(() => {
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
    const buscaUsuarios = async () => {
      const busca_usuario = await fetch("http://localhost:8080/usuarios",
        {
          credentials: "include"
        }
      )
      const res = await busca_usuario.json();
      const usuariosBuscados = res
      return usuariosBuscados;
    }
    const buscaFornecedores = async () => {
      const busca_fornecedores = await fetch("http://localhost:8080/fornecedores",
        {
          credentials: "include"
        }
      )
      const res = await busca_fornecedores.json();
      const fornecedoresBuscados = res.fornecedores
      return fornecedoresBuscados;
    }

    const filtraLojas = async () => {
      const usuarioLogado = await buscaUsuarioLogado()
      const usuarios = await buscaUsuarios()
      const fornecedoresBuscados = await buscaFornecedores();

      const busca_lojas = await fetch("http://localhost:8080/lojas");

      const res = await busca_lojas.json();

      const lojasBuscadas = res.lojas;
      console.log(fornecedoresBuscados)

      const loja_usuario = lojasBuscadas.find(l => l.id === usuarioLogado.Loja_vinculada)
      const funcionarios = usuarios.filter(u => u.loja_vinculada === loja_usuario.id)
      const fornecedores = fornecedoresBuscados.filter(f => f.loja_vinculada === loja_usuario.id)

      setLojas(loja_usuario);
      setUsuario(usuarios);
      setFuncionarios(funcionarios)
      setFornecedores(fornecedores)
    };
    filtraLojas();
  }, []);

  console.log(funcionarios)

  const handleEditLoja = (loja) => {
    setEditingLoja(loja);
    setFormData({
      nome: loja.nome,
      cnpj: loja.cnpj,
      localizacao: loja.localizacao,
      estado: loja.estado,
      contato: loja.contato,
      tipo: loja.tipo,
      horario_abertura: loja.horario_abertura,
      horario_fechamento: loja.horario_fechamento,
    });
    setIsDialogOpen(true);
  };

  const handleSaveLoja = async () => {
    if (editingLoja) {
      console.log(editingLoja);

      await fetch(`http://localhost:8080/lojas/${editingLoja.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: formData.nome,
          cnpj: formData.cnpj,
          localizacao: formData.localizacao,
          estado: formData.estado,
          contato: formData.contato,
          tipo: formData.tipo,
          horario_abertura: formData.horario_abertura,
          horario_fechamento: formData.horario_fechamento,
        }),
      });
    } else {
      console.log(formData);

      await fetch("http://localhost:8080/lojas", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    }

    setIsDialogOpen(false);
    setEditingLoja(null);
    setFormData({
      nome: "",
      cnpj: "",
      localizacao: "",
      estado: "",
      contato: "",
      tipo: "filial",
      horario_abertura: "",
      horario_fechamento: "",
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
          nomeGerente={usuario.usuario}
          filial={lojas.nome}
          cnpj={lojas.cnpj}
          cidade={lojas.localizacao}
          estado={lojas.estado}
          contato={lojas.contato}
        />
      </div>
      <div className="rounded-lg bg-muted px-3 py-3">
        <Tabs defaultValue="gerenciarFuncionarios">
          <TabsList>
            <TabsTrigger value="gerenciarFuncionarios">Gerenciar Funcionários</TabsTrigger>
            <TabsTrigger value="gerenciarFornecedores">Gerenciar Fornecedores</TabsTrigger>
          </TabsList>
          <TabsContent value="gerenciarFuncionarios">
            <Tabela data={funcionarios} />
          </TabsContent>
          <TabsContent value="gerenciarFornecedores">
            <TabelaFornecedores data={fornecedores} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

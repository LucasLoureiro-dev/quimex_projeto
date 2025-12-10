"use client";

import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/auth-context";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { usePathname } from "next/navigation";
import { User, Lock, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup
} from "@/components/ui/select";
import Link from "next/link"

export default function CaixaUnico() {
  const nomeCaminho = usePathname();
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      if (!user) {
        router.push("/login");
      }
      else if (user.cargo != "Funcionario") {
        router.push("/login");
      }
    }
  }, [user, isLoading, router]);
  const [usuario, setUsuario] = useState("");
  const [vendas, setVendas] = useState("");
  const [produtos, setProdutos] = useState([]);
  const formatShortDate = (date) => date ? new Intl.DateTimeFormat('pt-BR').format(new Date(date)) : "N/A"
  useEffect(() => {
    if (user) {
      fetch("http://localhost:8080/transferencias", {
        credentials: "include",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setVendas(data.trasferencias.filter((t) => {

            const isUser = t.operador_id == user.id;

            const isToday = new Date(t.horario).toDateString() === new Date().toDateString();

            return isUser && isToday;
          }));
        });
      fetch("http://localhost:8080/produtos", {
        credentials: "include",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setProdutos(data.produtos);
        });
    }
  }, [user]);
  const receita = () => {
    if (vendas.length > 0) {
      const total = vendas ? vendas.reduce((sum, item) => {
        return sum + item.preco * item.quantidade_produto;
      }, 0)
        : 0
      return `R$ ${total.toFixed(0)}.00`
    }
    else {
      return `R$ 0.00`
    }
  }

  const achaProduto = (id) => {
    const produto = produtos.find((p) => p.id == id)

    const nomeProduto = produto
    if(nomeProduto){
       return nomeProduto.nome
    }

   

    // return nomeProduto;
  }

  return (
    <div className="w-full h-screen flex font-sans">

      {/* Imagem à esquerda */}
      <div
        className="w-1/2 h-full bg-cover bg-center relative"
        style={{ backgroundImage: "url('/vendedor/lab.png')" }}
      >
        <div className="absolute inset-0 bg-[#054116]/40"></div>
      </div>

      {/* Área dinâmica à direita */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="max-w-md w-full px-10">

          <img src="/logo/logotipo.png" className="w-100 mx-10 mb-6" />
          <h1 className="text-3xl text-center font-bold text-gray-900">
            Resumo de vendas
          </h1>
          <table className="w-full table-auto min-w-[300px]">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left text-sm font-semibold text-muted-foreground py-3 px-2">produto</th>
                <th className="text-left text-sm font-semibold text-muted-foreground py-3">quantidade</th>
                <th className="text-left text-sm font-semibold text-muted-foreground py-3">Valor</th>
                <th className="text-left text-sm font-semibold text-muted-foreground py-3">Vencimento</th>
              </tr>
            </thead>
            <tbody>
              {vendas ? vendas.map((venda, index) => (
                <tr key={venda.id} className="border-b border-border text-sm hover:bg-muted/50">
                  <td className="py-3 px-2 font-medium">{ achaProduto(venda.produto) }</td>
                  <td className="py-3">{venda.quantidade_produto}</td>
                  <td className={`py-3 font-semibold`}>{venda.preco.toFixed(2)}</td>
                  <td className="py-3">{formatShortDate(venda.horario)}</td>
                </tr>
              )) : (<tr><td>Não houve vendas</td></tr>)}
              <tr className="border-b border-border text-sm hover:bg-muted/50">
                <td className="py-3 px-2 font-medium">{receita()}</td>
              </tr>
            </tbody>
          </table>
           <button
           onClick={() => {
            logout
            window.location.replace("/login")}}
                className={`w-full font-semibold h-12 rounded-lg shadow-lg transition-all mt-6"}
                bg-[#2EAF4A] hover:bg-[#1B8742] text-white shadow-[#2EAF4A]/30`}
              >
                Ir pro login
              </button>
        </div>
      </div>
    </div>
  );
}

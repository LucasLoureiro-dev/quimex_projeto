"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
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

  const router = useRouter();
  const nomeCaminho = usePathname();

  // CONTROLADOR DE TELAS
  const [etapa, setEtapa] = useState("login");
  const [usuario, setUsuario] = useState("");

  // LOGIN
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erroLogin, setErroLogin] = useState("");
  const [RE, setRE] = useState("")
  const [password, setPassword] = useState("")
  const [profile, setProfile] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // VALOR INICIAL
  const [valor, setValor] = useState("");

  useEffect(() => {
    // Se o caixa foi aberto hoje, pula direto para "caixa-aberto"
    const hoje = new Date().toISOString().split("T")[0];
    const dataCaixa = localStorage.getItem("caixaData");
    const valorSalvo = localStorage.getItem("caixaAbertura");
    const usuarioSalvo = localStorage.getItem("usuarioLogado");


    if (usuarioSalvo) setUsuario(usuarioSalvo);

    if (dataCaixa === hoje && valorSalvo) {
      setValor(valorSalvo);
      setEtapa("caixa-aberto");
    }
  }, []);


  // -------------------------
  // 1️⃣ LOGIN
  // -------------------------
  // const verificarLogin = () => {
  //   const usuarios = [
  //     { user: "lucas", pass: "123", nome: "Lucas Loureiro" },
  //     { user: "rafa", pass: "123", nome: "Rafaela" },
  //   ];

  //   const encontrado = usuarios.find(
  //     (u) => u.user === login && u.pass === senha
  //   );

  //   if (!encontrado) {
  //     setErroLogin("Login ou senha incorretos!");
  //     return;
  //   }

  //   localStorage.setItem("usuarioLogado", encontrado.nome);
  //   setUsuario(encontrado.nome);
  //   setEtapa("valor");
  // };


  // -------------------------
  // 2️⃣ VALOR INICIAL
  // -------------------------
  const confirmarValorInicial = async () => {
    if (valor === "" || parseFloat(valor) <= 0) {
      alert("Digite um valor válido!");
      return;
    }

    const response = await fetch("http://localhost:8080/dashboard/caixa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        valor: parseFloat(valor),
      }),
    });

    if (!response.ok) {
      alert("Erro ao abrir caixa");
      return;
    }

    const dados = await response.json();

    setEtapa("caixa-aberto");
  };

  //fazer login
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await fetch(`http://localhost:8080/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        RE: RE,
        senha: password,
        cargo: profile
      }),
      credentials: 'include'
    });

    if (!res.ok) {
      if (res.status == 401) {
        setError("Usuário/Senha errados");
        setLoading(false);
      }
      if (res.status == 404) {
        setError("Usuário não encontrado");
        setLoading(false);
      }
    }
    else {
      setEtapa("valor");
    }

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

          {/* ============================================================= */}
          {/* 1️⃣ TELA DE LOGIN */}
          {/* ============================================================= */}
          {etapa === "login" && (
            <>
              <img src="/logo/logotipo.png" className="w-100 mx-10 mb-6" />
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* EMAIL */}
                <div className="space-y-2">
                  <label
                    htmlFor="RE"
                    className="text-sm font-medium ml-1 text-[#1B8742]"
                  >
                    RE
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#279D49]" />
                    <input
                      id="RE"
                      type="text"
                      placeholder="xxxxxx"
                      value={RE}
                      onChange={(e) => setRE(e.target.value)}
                      required
                      className="pl-10 h-12 w-full rounded-lg border transition-all outline-none
                    bg-white border-[#BEE2B9] text-[#20532A] placeholder-[#20532A]/40
                    focus:ring-1 focus:ring-[#279D49]"
                    />
                  </div>
                </div>

                {/* SENHA */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium ml-1 text-[#1B8742]"
                    autoComplete="off"
                  >
                    Senha
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#279D49]" />

                    <input
                      id="password"
                      type="password"
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 h-12 w-full rounded-lg border transition-all outline-none
                    bg-white border-[#BEE2B9] text-[#20532A] placeholder-[#20532A]/40
                    focus:ring-1 focus:ring-[#279D49]"
                    />
                  </div>
                </div>

                {/* ERRO */}
                {error && (
                  <div className="p-3 rounded-md bg-red-500/20 border border-red-500/50 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* BOTÃO */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full font-semibold h-12 rounded-lg shadow-lg transition-all mt-6
                ${loading ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5 hover:shadow-xl"}
                bg-[#2EAF4A] hover:bg-[#1B8742] text-white shadow-[#2EAF4A]/30`}
                >
                  {loading ? "Entrando..." : "Login"}
                </button>
              </form>
            </>
          )}

          {/* ============================================================= */}
          {/* 2️⃣ INSERIR VALOR INICIAL */}
          {/* ============================================================= */}
          {etapa === "valor" && (
            <>
              <h1 className="text-3xl font-bold text-center text-gray-900">
                Bem vindo(a), {usuario}!
              </h1>

              <p className="text-gray-600 text-center mt-2">
                Antes de começar o expediente, insira o valor inicial do caixa.
              </p>

              <Input
                type="number"
                min="0"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ex: 150,00"
                className="mt-8 text-lg border-[#0f4e29] text-center py-6"
              />

              <Button
                onClick={confirmarValorInicial}
                className="mt-6 w-full bg-[#0f4e29] hover:bg-[#0b3e21] text-white text-lg py-6 rounded-md"
              >
                Enviar
              </Button>
            </>
          )}

          {/* CAIXA ABERTO */}
          {etapa === "caixa-aberto" && (
            <>
              <h1 className="text-3xl text-center font-bold text-gray-900">
                Caixa Aberto!
              </h1>

              <p className="text-gray-600 text-center mt-2 text-lg">
                Valor Inicial:{" "}
                <strong>
                  R$ {parseFloat(valor).toFixed(2).replace(".", ",")}
                </strong>
              </p>

              <Button
                onClick={() => router.push("/vendedor/pdv")}
                className="mt-8 w-full bg-[#0f4e29] hover:bg-[#0b3e21] text-white text-lg py-6 rounded-md"
              >
                Acessar o sistema
              </Button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

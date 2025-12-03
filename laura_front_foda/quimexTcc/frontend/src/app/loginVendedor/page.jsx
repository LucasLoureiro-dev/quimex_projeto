"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CaixaUnico() {
  const router = useRouter();

  // CONTROLADOR DE TELAS
  const [etapa, setEtapa] = useState("login"); 
  const [usuario, setUsuario] = useState("");

  // LOGIN
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erroLogin, setErroLogin] = useState("");

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
  const verificarLogin = () => {
    const usuarios = [
      { user: "lucas", pass: "123", nome: "Lucas Loureiro" },
      { user: "rafa", pass: "123", nome: "Rafaela" },
    ];

    const encontrado = usuarios.find(
      (u) => u.user === login && u.pass === senha
    );

    if (!encontrado) {
      setErroLogin("Login ou senha incorretos!");
      return;
    }

    localStorage.setItem("usuarioLogado", encontrado.nome);
    setUsuario(encontrado.nome);
    setEtapa("valor");
  };
  

  // -------------------------
  // 2️⃣ VALOR INICIAL
  // -------------------------
  const confirmarValorInicial = async () => {
    if (valor === "" || parseFloat(valor) <= 0) {
      alert("Digite um valor válido!");
      return;
    }
  
    const response = await fetch("/api/caixa/abrir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operador: usuario,
        valorInicial: parseFloat(valor),
      }),
    });
  
    if (!response.ok) {
      alert("Erro ao abrir caixa");
      return;
    }
  
    const dados = await response.json();
  
    // ✅ persistência correta
    sessionStorage.setItem("turnoId", dados.id);
    localStorage.setItem("caixaData", new Date().toISOString().split("T")[0]);
    localStorage.setItem("usuarioLogado", usuario);
  
    setEtapa("caixa-aberto");
  };
  
  

  // -------------------------
  // INTERFACE PRINCIPAL
  // -------------------------
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
              <img src="/logocompleta.png" className="w-100 mx-10 mb-6" />

              <h1 className="text-xl text-center mb-4 text-gray-700">
                Efetue seu Login:
              </h1>

              <Input
                placeholder="Login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="py-6 text-lg border-emerald-800 border-1"
              />

              <Input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-3 py-6 text-lg border-1  border-emerald-800 "
              />

              {erroLogin && (
                <p className="text-red-600 bg-red-200 border-1 border-red-600 p-2 rounded mt-2 text-center">{erroLogin}</p>
              )}

              <Button
                onClick={verificarLogin}
                className="mt-5 w-full bg-[#0f4e29] hover:bg-[#0b3e21] text-white text-lg py-6 rounded-md"
              >
                Entrar
              </Button>
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

          {/* ============================================================= */}
          {/* 3️⃣ CAIXA ABERTO */}
          {/* ============================================================= */}
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
                onClick={() => router.push("/pdv")}
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

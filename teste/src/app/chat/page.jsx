"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [usuarios, setUsuarios] = useState([]); // conectados no socket
  const [status_usuarios, setStatus_usuarios] = useState([]);
  const [usuariosBanco, setUsuariosBanco] = useState([]); // todos do banco
  const [usuario, setUsuario] = useState(null);
  const [destino, setDestino] = useState(null); // usuário selecionado
  const [mensagem, setMensagem] = useState("");
  const [chatPrivado, setChatPrivado] = useState([]); // mensagens da conversa
  const messagesEndRef = useRef(null);

  // === Conecta o socket e configura os eventos ===
  useEffect(() => {
    const socketInstance = io("http://localhost:8080", { path: "/chat" });
    setSocket(socketInstance);

    // Pega o usuário logado
    fetch("http://localhost:8080/dashboard", {
      credentials: "include",
    }).then(async (res) => {
      const ola = await res.json();
      if (ola?.usuario) {
        setUsuario(ola);
        socketInstance.emit("usuario", ola);
      } else {
        console.warn("Usuário não logado.");
      }
    });

    // Pega todos os usuários do banco
    fetch("http://localhost:8080/usuarios", {
      credentials: "include",
    }).then(async (res) => {
      const usuarios_banco = await res.json();
      setUsuariosBanco(usuarios_banco.listaUsuarios);
    });

    // Atualiza lista de usuários online
    socketInstance.on("listaUsuarios", (lista) => {
      setUsuarios(lista);
    });

    socketInstance.on("status_usuarios", (status) => {
      setStatus_usuarios(status);
    });

    // Recebe mensagem privada
    socketInstance.on("mensagemPrivada", ({ de, para, conteudo, horario }) => {
      // Exibe só se for da conversa atual
      if (para === usuario?.usuario || de === destino?.nome) {
        setChatPrivado((prev) => [
          ...prev,
          { de, conteudo, horario, recebido: true },
        ]);
      }
    });

    return () => socketInstance.disconnect();
  }, [usuario, destino]);

  // === Envio de mensagem privada ===
  const enviarMensagem = async () => {
    if (!destino || !mensagem) return;

    // Obtém hora atual
    const res = await fetch(
      "https://www.worldtimeapi.org/api/timezone/america/Sao_Paulo"
    );
    const data = await res.json();
    const baseTime = new Date(data.datetime);
    const hora = baseTime.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const msg = {
      de: usuario?.usuario,
      para: destino?.nome,
      conteudo: mensagem,
      horario: hora,
    };

    // Envia ao servidor
    socket.emit("mensagemPrivada", msg);

    // Exibe localmente
    setChatPrivado((prev) => [
      ...prev,
      { ...msg, recebido: false }, // recebido=false → enviado por mim
    ]);

    setMensagem("");
  };

  // === Define cor dos status ===
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    ocupado: "bg-red-500",
    ausente: "bg-yellow-400",
  };

  // === Scroll automático para o fim das mensagens ===
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatPrivado]);

  // === Renderização ===
  return (
    <div className="container flex-1">
      <div className="flex h-screen bg-gray-100">
        {/* === Sidebar === */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-blue-700">Painel de Chat</h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            <h3 className="px-4 pt-3 font-semibold text-gray-600">
              Usuários
            </h3>
            {usuariosBanco.map((u, k) => {
              const usuarioAtivo = usuarios.find(
                (user) => user.usuario === u.nome
              );
              const statusInfo = status_usuarios.find(
                (s) => s.usuario === usuarioAtivo?.id_socket
              );
              const statusFinal = statusInfo ? statusInfo.status : "offline";

              return (
                <button
                  type="button"
                  key={k}
                  onClick={() => {
                    setDestino(u);
                    setChatPrivado([]); // limpa chat anterior
                  }}
                  className="flex items-center px-4 py-3 cursor-pointer hover:bg-blue-50 w-full"
                >
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      statusColors[statusFinal]
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {u.nome} ({statusFinal})
                    </p>
                    <p className="text-xs text-gray-500">{u.cargo}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* === Área principal === */}
        <main className="flex-1 flex flex-col">
          <header className="flex justify-between items-center bg-white border-b px-6 py-3 shadow-sm">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-gray-800">
                {destino ? destino.nome : "Selecione um contato"}
              </h2>
            </div>
          </header>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
            {chatPrivado.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.recebido ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl shadow-sm ${
                    msg.recebido
                      ? "bg-white text-gray-800"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  <p className="text-sm">{msg.conteudo}</p>
                  <span className="text-[10px] text-gray-400 ml-2">
                    {msg.horario}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Campo de texto */}
          {destino && (
            <form
              className="flex items-center bg-white border-t border-gray-200 px-4 py-3"
              onSubmit={(e) => {
                e.preventDefault();
                enviarMensagem();
              }}
            >
              <input
                type="text"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="ml-3 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
              >
                Enviar
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}

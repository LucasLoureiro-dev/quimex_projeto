"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function PrivateChatPage() {
  const socketRef = useRef(null);

  const [user, setUser] = useState(null); // { id, nome }
  const [isLogged, setIsLogged] = useState(false);
  const [connected, setConnected] = useState(false);

  const [activeChat, setActiveChat] = useState(null); // { id, nome }
  const [messages, setMessages] = useState([]); // messages for active chat
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [input, setInput] = useState("");

  // busca usuário logado (supondo que /dashboard retorna { id, usuario, ... })
  const fetchUser = async () => {
    const res = await fetch("http://localhost:8080/dashboard", {
      credentials: "include",
    });
    const data = await res.json();
    // Ajuste se seu retorno for outro: aqui assumimos data.id e data.usuario
    setUser({ id: data.id, nome: data.usuario });
    setIsLogged(true);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!isLogged || !user) return;

    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8080", { path: "/chat" });
    }

    const socket = socketRef.current;

    socket.on("connect", () => {
      setConnected(true);
      // envia objeto com id e nome
      socket.emit("usuario", { id: user.id, nome: user.nome });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    // lista de usuários online (assumimos array de objetos ou nomes)
    socket.on("users", (users) => {
      // normalize => array of { id, nome } or strings
      const normalized = users.map((u) => {
        if (typeof u === "object") return u;
        // se backend enviar apenas nome, não teremos id — então use nome em id também
        return { id: u, nome: u };
      });
      // remove próprio
      setOnlineUsers(normalized.filter((u) => String(u.id) !== String(user.id)));
    });

    // chegada de mensagem privada em tempo real
    socket.on("private_message", (msg) => {
      // msg: { de, para, conteudo, horario }
      // se a mensagem for do chat ativo, adiciona
      if (!activeChat) return;
      const chatUsers = [String(user.id), String(activeChat.id)];
      if (chatUsers.includes(String(msg.de)) && chatUsers.includes(String(msg.para))) {
        setMessages((prev) => [...prev, {
          sender_id: msg.de,
          receiver_id: msg.para,
          message: msg.conteudo,
          timestamp: msg.horario
        }]);
      }
    });

    socket.on("chat_history", ({ messages: msgs }) => {
      // msgs -> array com { sender_id, receiver_id, message, timestamp }
      setMessages(msgs || []);
    });

    // cleanup
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isLogged, user, activeChat]);

  const openChat = (u) => {
    setActiveChat(u);
    setMessages([]);
    // pede histórico
    if (socketRef.current) {
      socketRef.current.emit("request_chat_history", { de: user.id, para: u.id });
    }
  };

  const sendMessage = () => {
    if (!input.trim() || !activeChat) return;
    const payload = {
      de: user.id,
      para: activeChat.id,
      conteudo: input.trim(),
      horario: new Date().toISOString(),
    };

    // enviar ao servidor (será salvo e retransmitido)
    socketRef.current.emit("private_message", payload);

    // mostrar localmente imediato
    setMessages((prev) => [
      ...prev,
      { sender_id: user.id, receiver_id: activeChat.id, message: payload.conteudo, timestamp: payload.horario },
    ]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6">
        {/* Users */}
        <div className="col-span-1 bg-white rounded-2xl shadow p-4 flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Usuários Online</h3>
          <div className="flex-1 overflow-y-auto space-y-2">
            {onlineUsers.length === 0 ? (
              <div className="text-sm text-gray-500">Nenhum usuário online</div>
            ) : (
              onlineUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => openChat(u)}
                  className="w-full text-left p-2 bg-gray-100 rounded-lg"
                >
                  {u.nome}
                </button>
              ))
            )}
          </div>
          <div className="mt-4 text-xs text-gray-500">Conexão: {connected ? "online" : "offline"}</div>
        </div>

        {/* Chat */}
        <div className="col-span-2 bg-white rounded-2xl shadow p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">
              {activeChat ? `Chat com ${activeChat.nome}` : "Selecione um usuário"}
            </h2>
            <span className="text-sm text-gray-600">{user?.nome}</span>
          </div>

          <div className="flex-1 overflow-y-auto border rounded-xl p-3 mb-3 h-96">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-2 p-2 rounded-xl max-w-[80%] ${
                  String(m.sender_id) === String(user?.id) ? "ml-auto bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                <div className="text-sm">
                  <strong>{String(m.sender_id) === String(user?.id) ? "Você" : activeChat?.nome}</strong>
                  <span className="text-xs text-gray-600"> [{new Date(m.timestamp).toLocaleTimeString()}]</span>
                </div>
                <div className="mt-1">{m.message}</div>
              </div>
            ))}
          </div>

          {activeChat && (
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded-xl p-2"
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">Enviar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

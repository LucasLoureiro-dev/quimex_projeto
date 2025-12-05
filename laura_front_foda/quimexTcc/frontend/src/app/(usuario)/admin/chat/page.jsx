"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export default function ChatPage() {
  const socketRef = useRef(null);
  const typingTimeout = useRef(null);
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  const [lojas, setLojas] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingFrom, setTypingFrom] = useState(null);

  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);

  // fetch user & lojas (igual antes)
  const fetchUser = async () => {
    const res = await fetch("http://localhost:8080/dashboard", { credentials: "include" });
    const data = await res.json();
    const lojaNum = Number(data.loja_vinculada ?? data.Loja_vinculada ?? data.lojaVinculada ?? null);
    const userNormalized = {
      id: data.id,
      nome: data.usuario ?? data.nome ?? "",
      cargo: data.cargo ?? null,
      vinculo: data.vinculo ?? null,
      loja_vinculada: isNaN(lojaNum) ? null : lojaNum,
    };
    setUser(userNormalized);
    setIsLogged(true);
  };

  const fetchLojas = async () => {
    const res = await fetch("http://localhost:8080/lojas");
    const json = await res.json();
    if (Array.isArray(json)) setLojas(json);
    else if (Array.isArray(json.lojas)) setLojas(json.lojas);
    else setLojas([]);
  };

  useEffect(() => { fetchUser().then(fetchLojas); }, []);

  // socket setup (idêntico ao seu atual)
  useEffect(() => {
    if (!isLogged || !user) return;

    if (!socketRef.current) socketRef.current = io("http://localhost:8080", { path: "/chat" });
    const socket = socketRef.current;

    socket.on("connect", () => {
      socket.emit("usuario", {
        id: user.id,
        nome: user.nome,
        cargo: user.cargo,
        vinculo: user.vinculo,
        loja_vinculada: user.loja_vinculada,
      });

      if (activeChat) {
        socket.emit("request_chat_history", { de: user.loja_vinculada, para: activeChat.id });
      }
    });

    socket.on("users", (list) => {
      const normalized = (list || []).map((u) => {
        const lojaNum = Number(u.loja_vinculada ?? u.Loja_vinculada ?? u.lojaVinculada ?? null);
        return {
          socketId: u.socketId ?? null,
          id: u.id ?? null,
          nome: u.nome ?? u.usuario ?? "",
          cargo: u.cargo ?? null,
          vinculo: u.vinculo ?? null,
          loja_vinculada: isNaN(lojaNum) ? null : lojaNum,
        };
      });
      setOnlineUsers(normalized);
    });

    socket.on("chat_history", ({ messages: msgs }) => setMessages(msgs || []));

    socket.on("private_message", (msg) => {
      if (!activeChat) return;
      const matches =
        (String(msg.de) === String(user.loja_vinculada) && String(msg.para) === String(activeChat.id)) ||
        (String(msg.para) === String(user.loja_vinculada) && String(msg.de) === String(activeChat.id));
      if (matches) {
        // msg.conteudo pode ser string JSON (arquivo) ou texto simples
        setMessages((prev) => [
          ...prev,
          {
            sender_id: msg.de,
            receiver_id: msg.para,
            message: msg.conteudo,
            timestamp: msg.horario,
          },
        ]);
      }
    });

    socket.on("typing", (data) => {
      if (activeChat && String(data.from) === String(activeChat.id)) {
        setTypingFrom(data.typing ? activeChat.nome : null);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isLogged, user, activeChat]);

  // open chat, request history
  const openChat = (loja) => {
    setActiveChat(loja);
    setMessages([]);
    setTypingFrom(null);
    if (socketRef.current) socketRef.current.emit("request_chat_history", { de: user.loja_vinculada, para: loja.id });
  };

  // send text message
  const sendMessage = () => {
    if (!input.trim() || !activeChat || !socketRef.current) return;
    const payload = { de: user.loja_vinculada, para: activeChat.id, conteudo: input.trim(), horario: new Date().toISOString() };
    socketRef.current.emit("private_message", payload);
    setMessages((prev) => [...prev, { sender_id: payload.de, receiver_id: payload.para, message: payload.conteudo, timestamp: payload.horario }]);
    socketRef.current.emit("typing_stop", { de: user.loja_vinculada, para: activeChat.id });
    setInput("");
  };

  // handle file selection -> upload to server -> send message with file meta
  const handleFileSelected = async (file) => {
    if (!file || !activeChat) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      // Ajuste a URL conforme onde você montou a rota (ex: /api/upload ou /upload)
      const res = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: form,
      });

      const json = await res.json();
      if (!json || !json.url) throw new Error("Falha no upload");

      const fileMeta = {
        type: "file",
        url: json.url,
        name: json.originalname || json.filename,
        mimetype: json.mimetype,
        size: json.size,
      };

      // Envia a mensagem com conteudo sendo o objeto (o backend salva JSON.stringify)
      const payload = { de: user.loja_vinculada, para: activeChat.id, conteudo: fileMeta, horario: new Date().toISOString() };
      socketRef.current.emit("private_message", payload);

    } catch (err) {
      console.error("Erro upload:", err);
      alert("Erro ao enviar arquivo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // helper para abrir file picker
  const onAttachClick = () => fileInputRef.current && fileInputRef.current.click();

  // typing handler
  const handleTyping = (val) => {
    setInput(val);
    if (!activeChat || !socketRef.current) return;
    socketRef.current.emit("typing_start", { de: user.loja_vinculada, para: activeChat.id });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      if (socketRef.current) socketRef.current.emit("typing_stop", { de: user.loja_vinculada, para: activeChat.id });
    }, 1200);
  };

  const lojaOnline = (lojaId) => onlineUsers.some((u) => Number(u.loja_vinculada) === Number(lojaId));

  // render message: detecta se message é JSON com {type:'file',...}
  const renderMessageContent = (m) => {
    let content = m.message;
    // pode já vir como objeto (rare) ou string JSON
    let parsed = null;
    if (typeof content === "string") {
      try { parsed = JSON.parse(content); } catch (e) { parsed = null; }
    } else if (typeof content === "object") {
      parsed = content;
    }

    if (parsed && parsed.type === "file" && parsed.url) {
      // imagem
      if (parsed.mimetype && parsed.mimetype.startsWith("image")) {
        return <img src={parsed.url} alt={parsed.name} className="max-w-full rounded-md" />;
      }
      // arquivo genérico
      return (
        <a href={parsed.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          📎 {parsed.name || "Arquivo"} ({Math.round((parsed.size || 0) / 1024)} KB)
        </a>
      );
    }

    // texto normal
    return <div>{String(content)}</div>;
  };

  // UI (Tailwind)
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => handleFileSelected(e.target.files?.[0])} />

      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6">
        {/* lojas */}
        <div className="col-span-1 bg-white rounded-2xl shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Lojas</h3>
            <span className="text-xs text-gray-500">{user?.nome}</span>
          </div>
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 560 }}>
            {lojas.length === 0 ? <div className="text-sm text-gray-500">Carregando...</div> :
              lojas.filter(loja => {
                if (!user) return false;
                if (user.cargo === "Administrador" && String(user.vinculo).toLowerCase() === "matriz") {
                  return String(loja.tipo).toLowerCase() !== "matriz" && Number(loja.id) !== Number(user.loja_vinculada);
                }
                if (user.cargo === "Gerente") {
                  return String(loja.tipo).toLowerCase() === "matriz";
                }
                return false;
              }).map(loja => (
                <button key={loja.id} onClick={() => openChat(loja)}
                  className={`w-full flex items-center justify-between p-3 mb-2 rounded-lg ${activeChat?.id === loja.id ? "bg-blue-50" : "bg-gray-100 hover:bg-gray-200"}`}>
                  <div>
                    <div className="font-medium">{loja.nome}</div>
                    <div className="text-xs text-gray-500">{loja.localizacao}</div>
                  </div>
                  <div className="text-right">
                    {lojaOnline(loja.id) ? <div className="text-green-600 text-xs">Online</div> : <div className="text-red-600 text-xs">Offline</div>}
                    <div className="text-xs text-gray-400 mt-1">{loja.tipo}</div>
                  </div>
                </button>
              ))
            }
          </div>
        </div>

        {/* chat */}
        <div className="col-span-2 bg-white rounded-2xl shadow flex flex-col p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">{activeChat ? `Chat com ${activeChat.nome}` : "Selecione uma loja"}</h2>
            <div className="text-sm text-gray-600">Minha loja: {user?.loja_vinculada}</div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 border rounded-xl mb-3" style={{ minHeight: 360 }}>
            {messages.length === 0 ? <div className="text-sm text-gray-500">Nenhuma mensagem ainda</div> :
              messages.map((m, i) => (
                <div key={i} className={`mb-3 p-3 rounded-xl max-w-[75%] ${String(m.sender_id) === String(user?.loja_vinculada) ? "ml-auto bg-blue-500 text-white" : "bg-gray-200"}`}>
                  <div className="text-xs opacity-75 mb-1">{new Date(m.timestamp).toLocaleTimeString()}</div>
                  <div>{renderMessageContent(m)}</div>
                </div>
              ))
            }
            {typingFrom && <div className="text-sm text-gray-500 italic">{typingFrom} está digitando...</div>}
          </div>

          {activeChat && (
            <div className="flex gap-2 items-center">
              <button onClick={onAttachClick} className="bg-gray-200 p-2 rounded-md">📎</button>
              <input className="flex-1 border rounded-xl p-2" placeholder="Digite sua mensagem..." value={input} onChange={(e) => handleTyping(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
              <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-xl">Enviar</button>
            </div>
          )}

          {uploading && <div className="text-sm text-gray-500 mt-2">Enviando arquivo...</div>}
        </div>
      </div>
    </div>
  );
}

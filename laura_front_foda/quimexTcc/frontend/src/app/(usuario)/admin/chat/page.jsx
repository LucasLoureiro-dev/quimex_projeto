"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export default function ChatPage() {
  const socketRef = useRef(null);
  const typingTimeout = useRef(null);
  const messagesEndRef = useRef(null);
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

  // ------------------------------
  // Scroll automático
  // ------------------------------

  // const { user, isLoading } = useAuth();
  // const router = useRouter();
  // useEffect(() => {
  //   if (user) {
  //     if (!isLoading && !user) {
  //       router.push("/login");
  //     }
  //     else if (user.cargo != "Administrador") {
  //       router.push("/login");
  //     }
  //   }
  //   else {
  //     router.push("/login");
  //   }
  // }, [user, isLoading, router]);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch usuário
  const fetchUser = async () => {
    const res = await fetch("http://localhost:8080/dashboard", {
      credentials: "include",
    });

    const data = await res.json();

    const lojaNum = Number(
      data.loja_vinculada ?? data.Loja_vinculada ?? data.lojaVinculada ?? null
    );

    setUser({
      id: data.id,
      nome: data.usuario ?? data.nome ?? "",
      cargo: data.cargo,
      vinculo: data.vinculo,
      loja_vinculada: lojaNum,
    });

    setIsLogged(true);
  };

  const fetchLojas = async () => {
    const res = await fetch("http://localhost:8080/lojas");
    const json = await res.json();

    if (Array.isArray(json)) setLojas(json);
    else if (Array.isArray(json.lojas)) setLojas(json.lojas);
    else setLojas([]);
  };

  useEffect(() => {
    fetchUser().then(fetchLojas);
  }, []);

  // ------------------------------
  // SOCKET.IO
  // ------------------------------
  useEffect(() => {
    if (!isLogged || !user) return;

    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8080", { path: "/chat" });
    }

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
        socket.emit("request_chat_history", {
          de: user.loja_vinculada,
          para: activeChat.id,
        });
      }
    });

    socket.on("users", (list) => {
      const normalized = (list || []).map((u) => {
        const lojaNum = Number(
          u.loja_vinculada ?? u.Loja_vinculada ?? u.lojaVinculada ?? null
        );
        return {
          id: u.id,
          nome: u.nome,
          cargo: u.cargo,
          vinculo: u.vinculo,
          loja_vinculada: lojaNum,
        };
      });

      setOnlineUsers(normalized);
    });

    socket.on("chat_history", ({ messages: msgs }) => {
      setMessages(msgs || []);
    });

    socket.on("private_message", (msg) => {
      if (!activeChat) return;

      const isMatch =
        (String(msg.de) === String(user.loja_vinculada) &&
          String(msg.para) === String(activeChat.id)) ||
        (String(msg.para) === String(user.loja_vinculada) &&
          String(msg.de) === String(activeChat.id));

      if (isMatch) {
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
      if (!activeChat) return;

      if (String(data.from) === String(activeChat.id)) {
        setTypingFrom(data.typing ? activeChat.nome : null);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isLogged, user, activeChat]);

  // Abrir conversa
  const openChat = (loja) => {
    setActiveChat(loja);
    setMessages([]);
    setTypingFrom(null);

    if (socketRef.current) {
      socketRef.current.emit("request_chat_history", {
        de: user.loja_vinculada,
        para: loja.id,
      });
    }
  };

  // Enviar texto
  const sendMessage = () => {
    if (!input.trim() || !activeChat) return;

    const payload = {
      de: user.loja_vinculada,
      para: activeChat.id,
      conteudo: input.trim(),
      horario: new Date().toISOString(),
    };

    socketRef.current.emit("private_message", payload);

    setInput("");
  };

  // Upload de arquivo
  const handleFileSelected = async (file) => {
    if (!file || !activeChat) return;

    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: form,
      });

      const json = await res.json();

      const fileMeta = {
        type: "file",
        url: json.url,
        name: json.originalname,
        mimetype: json.mimetype,
        size: json.size,
      };

      const payload = {
        de: user.loja_vinculada,
        para: activeChat.id,
        conteudo: fileMeta,
        horario: new Date().toISOString(),
      };

      socketRef.current.emit("private_message", payload);
    } finally {
      setUploading(false);
      fileInputRef.current.value = "";
    }
  };

  // Exibir mensagem (texto/arquivo/imagem)
  const renderMessageContent = (m) => {
    let content = m.message;
    let parsed = null;

    if (typeof content === "string") {
      try {
        parsed = JSON.parse(content);
      } catch { }
    }

    if (parsed && parsed.type === "file") {
      if (parsed.mimetype.startsWith("image"))
        return <img src={parsed.url} className="max-w-full rounded-md" />;

      return (
        <a
          href={parsed.url}
          target="_blank"
          className="text-blue-600 underline"
        >
          📎 {parsed.name}
        </a>
      );
    }

    return content;
  };

  const lojaOnline = (id) =>
    onlineUsers.some((u) => Number(u.loja_vinculada) === Number(id));

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => handleFileSelected(e.target.files[0])}
      />

      <div className="w-full grid md:grid-cols-3 grid-cols-1 gap-6  min-h-screen overflow-hidden">
        {/* LISTA DE LOJAS */}
        <div className="bg-white rounded-2xl shadow p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-3">Lojas</h3>

          <div className="space-y-2">
            {lojas.map((loja) => {
              // Regras matriz/filial
              if (user.cargo === "Administrador" && user.vinculo === "Matriz") {
                if (Number(loja.id) === Number(user.loja_vinculada))
                  return null;
              }

              if (user.cargo === "Gerente" && loja.tipo !== "Matriz") {
                return null;
              }

              return (
                <button
                  key={loja.id}
                  onClick={() => openChat(loja)}
                  className={`w-full p-3 rounded-lg flex justify-between items-center ${activeChat?.id === loja.id
                    ? "bg-green-100"
                    : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  <div>
                    <div className="font-medium">{loja.nome}</div>
                    <div className="text-xs text-gray-600">
                      {loja.localizacao}
                    </div>
                  </div>

                  <div className="text-right">
                    {lojaOnline(loja.id) ? (
                      <div className="text-green-600 text-xs">Online</div>
                    ) : (
                      <div className="text-red-600 text-xs">Offline</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CHAT */}
        <div className="bg-white rounded-2xl shadow p-4 col-span-2 flex flex-col h-full min-h-0">
          <h2 className="text-xl font-semibold mb-3">
            {activeChat ? `Chat com ${activeChat.nome}` : "Selecione uma loja"}
          </h2>

          {/* ÁREA DE MENSAGENS */}
          <div className="flex-1 overflow-y-auto border rounded-xl p-3 mb-3 min-h-0">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-3 max-w-[75%] p-3 rounded-xl break-words whitespace-pre-wrap overflow-hidden ${String(m.sender_id) === String(user.loja_vinculada)
                  ? "ml-auto bg-green-600 text-white"
                  : "#7CC472"
                  }`}
                style={{ overflowWrap: "anywhere" }}
              >
                <div className="text-xs opacity-70 mb-1">
                  {new Date(m.timestamp).toLocaleTimeString()}
                </div>

                {renderMessageContent(m)}
              </div>
            ))}

            {typingFrom && (
              <div className="text-sm text-gray-600 italic">
                {typingFrom} está digitando...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* CAIXA DE TEXTO */}
          {activeChat && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-green-100 p-2 rounded-md"
              >
                📎
              </button>

              <input
                className="flex-1 border rounded-xl p-2"
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />

              <button
                onClick={sendMessage}
                className="bg-green-600 text-white px-4 py-2 rounded-xl"
              >
                Enviar
              </button>
            </div>
          )}

          {uploading && (
            <div className="text-xs text-gray-500 mt-2">
              Enviando arquivo...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { ms } from "date-fns/locale";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { date } from "zod";

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosBanco, setUsuariosBanco] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [destino, setDestino] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [chatPrivado, setChatPrivado] = useState(null);
  const [horarioAtual, setHorarioAtual] = useState("");
  const [horarioMensagem, setHorarioMensagem] = useState("");
  const messagesEndRef = useRef(null);
  // useEffect {ola, setOla} != const(Gera-resposta() <=={
  //   const.logaritimo(respo),
  // }).

  useEffect(() => {
    const socketInstance = io("http://localhost:8080", { path: "/chat" });
    setSocket(socketInstance);

    fetch("http://localhost:8080/dashboard", {
      credentials: "include",
    }).then(async (res) => {
      const ola = await res.json();
      console.log(ola);
      if (ola.usuario != "" || ola.usuario != null) {
        socketInstance.emit("usuario", {ola, status: "Online"});
        setUsuario({ola, status: "Online"});
      } else {
        console.log("faça login energumeno");
      }
    });

    fetch("http://localhost:8080/usuarios", {
      credentials: "include",
    }).then(async (res) => {
      const usuarios_banco = await res.json();
      console.log(usuarios_banco);
      setUsuariosBanco(usuarios_banco);
    });

    // Escuta lista de usuários
    socketInstance.on("listaUsuarios", (lista, status) => {
      console.log(lista);
      setUsuarios({lista, status});
    });

    // Recebe mensagens privadas
    socketInstance.on("mensagemPrivada", ({ de, conteudo, horario }) => {
      setChatPrivado((prev) => [...prev, { de, conteudo, horario }]);
    });

    return () => socketInstance.disconnect();
  }, []);

  const enviarMensagem = async () => {
    try {
      const res = await fetch(
        "https://www.worldtimeapi.org/api/timezone/america/Sao_Paulo"
      );
      const data = await res.json();

      const baseTime = new Date(data.datetime);

      setHorarioAtual(
        baseTime.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch (err) {
      console.log(err);
    }

    console.log(horarioAtual);

    if (!destino || !mensagem) return "";
    socket.emit("mensagemPrivada", {
      de: nome,
      para: destino,
      conteudo: mensagem,
      horario: horarioAtual,
    });
    setChatPrivado((prev) => [
      ...prev,
      {
        de: "Você",
        para: destino,
        conteudo: mensagem,
        horario: horarioMensagem,
      },
    ]);
    setMensagem("");
  };

  useEffect(() => {
    if (usuariosBanco) {
      const acha_usuario = usuariosBanco.find((ola) => ola.id == usuario.id);
    }
  }, [usuariosBanco]);

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    ocupado: "bg-red-500",
    ausente: "bg-yellow-400",
  };

  return (
    <>
      <div className="container flex-1">
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-blue-700">
                Painel de Chat
              </h2>
              <p className="text-sm text-gray-500">{""}</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              <h3 className="px-4 pt-3 font-semibold text-gray-600">
                Pedófelos online
              </h3>
              {usuariosBanco.map((u, k) => {
                return (
                  <button type="button" key={k}>
                    <div
                      onClick={() => setChatPrivado(u.id)}
                      className={`flex items-center px-4 py-3 cursor-pointer hover:bg-blue-50`}
                    >
                      <div className={`w-3 h-3 rounded-full mr-2`}></div>
                      <div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {u.nome} (online)
                          </p>
                          <p className="text-xs text-gray-500">{u.cargo}</p>
                        </div>
                        {/* {usuarios.map((users, index) => {
                          console.log(usuariosBanco)
                          console.log(users)
                          var usuarios_achados = []
                          const acha_usuario = usuariosBanco.find((uid) => uid.id === users.id_usuario)
                          usuarios_achados.push(acha_usuario)
                          console.log(usuarios_achados)
                          if (usuarios_achados) {
                            return (
                              <div key={index}> 
                                <p
                                  
                                  className="text-sm font-medium text-gray-800"
                                >
                                  {usuarios_achados.nome} (online)
                                </p>
                                <p className="text-xs text-gray-500">
                                  {usuarios_achados.cargo}
                                </p>
                              </div>
                            );
                          } else {
                            // return (
                            //   <p key={index} className="text-sm font-medium text-gray-800">
                            //     {u.nome} (offline)
                            //   </p>
                            // );
                          }
                        })} */}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Chat Main */}
          <main className="flex-1 flex flex-col">
            <header className="flex justify-between items-center bg-white border-b px-6 py-3 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full`}></div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {/* {activeChat.name} */}
                </h2>
                <span className="text-sm text-gray-500">
                  {/* ({activeChat.status}) */}
                </span>
              </div>
            </header>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {/* {chatPrivado.map((msg, i) => {
                if (msg.de === "Você") {
                  return <div className=""></div>;
                }
              })} */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="flex items-center bg-white border-t border-gray-200 px-4 py-3">
              <input
                type="text"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={enviarMensagem}
                className="ml-3 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
              >
                Enviar
              </button>
            </form>
          </main>

          {/* Painel lateral direito */}
          <aside className="w-72 bg-white border-l border-gray-200 p-4 flex flex-col">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-300 mb-2"></div>
              <h3 className="text-lg font-semibold text-gray-800">
                {/* {activeChat.name} */}
              </h3>
              <p className="text-sm text-gray-500"></p>
              <span
                className={`mt-1 text-xs px-3 py-1 rounded-full text-white ${
                  ""
                  //   activeChat.status === "online"
                  //     ? "bg-green-500"
                  //     : activeChat.status === "ocupado"
                  //     ? "bg-red-500"
                  //     : activeChat.status === "ausente"
                  //     ? "bg-yellow-500"
                  //     : "bg-gray-400"
                }`}
              >
                {/* {activeChat.status} */}
              </span>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <h4 className="font-semibold mb-2">Informações</h4>
              <p>Último login: 10/10/2025</p>
              <p>Email: exemplo@empresa.com</p>
              <p>Departamento: Química</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

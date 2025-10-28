import { Server } from "socket.io";
import express, { json } from "express";
import {
  listar_chatController,
  criar_chatController,
} from "../controllers/chatControler.js";

export function startChat(server) {
  const io = new Server(server, {
    path: "/chat",
    cors: { origin: "*" },
  });

  let usuarios = [];

  io.on("connection", (socket) => {
    console.log("Novo usuário conectado:", socket.id);

    // Quando o usuário se identifica
    socket.on("usuario", (usuario, status) => {
      console.log(usuario, status)
      // console.log("Olá,", usuario.usuario);

      // Evita duplicação se o mesmo usuário reconectar
      usuarios = usuarios.filter((u) => u.usuario !== usuario.usuario);

      usuarios.push({
        id_usuario: usuario.id,
        usuario: usuario.usuario,
        RE: usuario.RE,
        id_socket: socket.id,
      });
      console.log(usuario)

      console.log(`${usuario.usuario} conectado com o id: ${socket.id}`);

      // Envia lista atualizada a todos
      io.emit("listaUsuarios", {usuarios, status: status});
    });

    // Recebe mensagem privada
    socket.on("mensagemPrivada", ({ de, para, conteudo, horario }) => {
      const usuarioDestino = usuarios.find((u) => u.usuario === para);
      if (usuarioDestino) {
        io.to(usuarioDestino.id).emit("mensagemPrivada", { de, conteudo, horario });
        console.log(`${de} → ${para}: ${conteudo} horário: ${horario}`);
      }
    });

    // Quando o usuário desconecta
    socket.on("disconnect", () => {
      const usuarioDesconectado = usuarios.find((u) => u.id === socket.id);
      if (usuarioDesconectado) {
        console.log(`${usuarioDesconectado.usuario} saiu`);
      }

      // Remove da lista
      usuarios = usuarios.filter((u) => u.id_socket !== socket.id);

      // Atualiza a lista em todos os clientes
      io.emit("listaUsuarios", usuarios);
    });
  });
}

export default startChat;
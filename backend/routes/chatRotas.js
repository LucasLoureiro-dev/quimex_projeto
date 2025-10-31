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

  // let usuarios = [];
  // let status = []

  const usuariosConectados = new Map(); // socket.id -> { usuario }

  iio.on("connection", (socket) => {
    console.log("Novo cliente conectado:", socket.id);

    // Quando um cliente se identifica
    socket.on("usuario", (dados) => {
      const usuario = {
        ...dados,
        id_socket: socket.id,
        status: "online",
      };

      usuariosConectados.set(socket.id, usuario);

      console.log(`🟢 ${usuario.usuario} está online`);

      // Envia lista atualizada a todos
      io.emit("listaUsuarios", Array.from(usuariosConectados.values()));
    });

    // Quando o usuário muda o status manualmente
    socket.on("alterarStatus", (novoStatus) => {
      const usuario = usuariosConectados.get(socket.id);
      if (usuario) {
        usuario.status = novoStatus;
        usuariosConectados.set(socket.id, usuario);
        io.emit("listaUsuarios", Array.from(usuariosConectados.values()));
        console.log(`🟡 ${usuario.usuario} alterou status para ${novoStatus}`);
      }
    });

    // Envio de mensagem privada
    socket.on("mensagemPrivada", ({ de, para, conteudo, horario }) => {
      const destino = [...usuariosConectados.entries()].find(
        ([, u]) => u.usuario === para
      );

      if (destino) {
        io.to(destino[0]).emit("mensagemPrivada", {
          de,
          conteudo,
          horario,
        });
        console.log(`📩 ${de} → ${para}: ${conteudo}`);
      }
    });

    // Quando desconecta
    socket.on("disconnect", () => {
      const usuario = usuariosConectados.get(socket.id);
      if (usuario) {
        console.log(`🔴 ${usuario.usuario} saiu`);
        usuariosConectados.delete(socket.id);
        io.emit("listaUsuarios", Array.from(usuariosConectados.values()));
      }
    });
  });

  // io.on("connection", (socket) => {
  //   console.log("Novo usuário conectado:", socket.id);

  //   // Quando o usuário se identifica
  //   socket.on("usuario", (usuario) => {
  //     // console.log("Olá,", usuario.usuario);

  //     // Evita duplicação se o mesmo usuário reconectar
  //     usuarios = usuarios.filter((u) => u.usuario !== usuario.usuario);
  //     usuarios.push({
  //       id_usuario: usuario.id,
  //       usuario: usuario.usuario,
  //       RE: usuario.RE,
  //       id_socket: socket.id,
  //     });

  //     status.push({
  //       usuario: socket.id,
  //       status: "online"
  //     })

  //     // Envia lista atualizada a todos
  //     io.emit("listaUsuarios", usuarios);
  //     io.emit("status_usuarios", status);
  //   });

  //   // Recebe mensagem privada
  //   socket.on("mensagemPrivada", ({ de, para, conteudo, horario }) => {

  //     const usuarioDestino = usuarios.find((u) => u.id === para);
  //     console.log("chegou mensagem pra você: ", usuarioDestino)
  //     if (usuarioDestino) {
  //       io.to(usuarioDestino.id).emit("mensagemPrivada", { de, conteudo, horario });
  //       console.log(`${de} → ${para}: ${conteudo} horário: ${horario}`);
  //     }
  //   });

  //   // Quando o usuário desconecta
  //   socket.on("disconnect", () => {
  //     const usuarioDesconectado = usuarios.find((u) => u.id === socket.id);
  //     if (usuarioDesconectado) {
  //       console.log(`${usuarioDesconectado.usuario} saiu`);
  //     }

  //     // Remove da lista
  //     usuarios = usuarios.filter((u) => u.id_socket !== socket.id);
  //     status = status.filter((s) => s.usuario !== socket.id)

  //     // Atualiza a lista em todos os clientes
  //     io.emit("listaUsuarios", usuarios);
  //     io.emit("status_usuarios", status)
  //   });
  // });
}

export default startChat;
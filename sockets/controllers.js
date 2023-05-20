const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();

const socketController = async (socket = Socket(), io) => {
    const usuario = await comprobarJWT(socket.handshake.headers["x-token"]);
    if (!usuario) {
        return socket.disconnect();
    }

    // Agregar el usuario conectado
    chatMensajes.agregarUsuario(usuario);
    io.emit("usuarios-activos", chatMensajes.usuariosArr);
    socket.emit("recibir-mensajes", chatMensajes.ultimos10);

    // Conectar a una sala especial
    socket.join(usuario.id);

    // Limpiar cuando alguien se desconecta
    socket.on("disconnect", () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit("usuarios-activos", chatMensajes.usuariosArr);
    });

    socket.on("enviar-mensaje", ({ mensaje, uid }) => {
        if (uid) {
            socket.to(uid).emit("mensaje-privado", { de: usuario.nombre, mensaje });
        }
        chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
        io.emit("recibir-mensajes", chatMensajes.ultimos10);
    });
}


module.exports = {
    socketController,
}
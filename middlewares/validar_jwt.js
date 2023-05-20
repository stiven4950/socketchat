const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario")

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header("x-token");
    if (!token) {
        return res.status(403).json({
            msg: "No hay un token en la petición"
        });
    }
    try {
        const { uid } = jwt.verify(token, process.env.PRIVATE_KEY);
        
        const usuario = await Usuario.findById(uid);
        if(!usuario) {
            return res.status(401).json({
                msg: "Usuario no encontrado"
            });
        }
        if(!usuario.estado) {
            return res.status(401).json({
                msg: "Usuario inactivo"
            });
        }
        req.usuario = usuario;
        
    } catch (error) {
        return res.status(403).json({
            msg: "Token no válido"
        });
    }

    next();
}

module.exports = {
    validarJWT,
}
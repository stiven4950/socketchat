const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar_jwt");
const { googleVerify } = require("../helpers/google_verify");

const login = async (req, res = response) => {
    const { correo, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ correo, estado: true });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / contraseña incorrectos'
            });
        }

        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / contraseña incorrectos'
            });
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token,
        });
    } catch (error) {
        res.status(500).json({
            msg: "Hable con el administrador",
        });
    }
}

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ":P",
                img,
                rol: "USER_ROLE",
                google: true,
            }

            usuario = new Usuario(data)
            await usuario.save()
        }

        // si el usuario en DB
        if (!usuario.estado) {
            return res.status(401).json({
                msg: "Hable con el administrador, usuario bloqueado",
            });
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token,
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: "El Token no se pudo verificar" + error
        })
    }

}

const renovarToken = async (req, res = response) => {
    const { usuario } = req;

    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token,
    });
}

module.exports = {
    login,
    googleSignIn,
    renovarToken,
}
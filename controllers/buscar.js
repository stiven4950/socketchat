const { response } = require('express');
const { Usuario, Categoria, Producto } = require('../models');
const { ObjectId } = require("mongoose").Types;

const coleccionesPermitidas = [
    "usuarios",
    "categorias",
    "productos",
    "roles",
]

const buscarUsuarios = async (termino = "", res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : [],
        });
    }

    const regex = new RegExp(termino, "i");
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }],
    });
    return res.json({
        results: usuarios,
    });
}

const buscarCategorias = async (termino = "", res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : [],
        });
    }

    const regex = new RegExp(termino, "i");
    const categorias = await Categoria.find({ nombre: regex, estado: true });
    return res.json({
        results: categorias,
    });
}

const buscarProductos = async (termino = "", res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const producto = await Producto.findById(termino).populate("categoria", "nombre");
        return res.json({
            results: (producto) ? [producto] : [],
        });
    }

    const regex = new RegExp(termino, "i");
    const productos = await Producto.find({ nombre: regex, estado: true }).populate("categoria", "nombre");
    return res.json({
        results: productos,
    });

    // Si se desea buscar por aquellos productos donde su categoría sea un ObjectID
    // entonces iría Producto.find({categoria: ObjectId(termino)})...
}

const buscar = async (req, res = response) => {
    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case "usuarios":
            return await buscarUsuarios(termino, res);
        case "categorias":
            return await buscarCategorias(termino, res);
        case "productos":
            return await buscarProductos(termino, res);
        case "roles":
            break;
        default:
            res.status(500).json({
                msg: "Se le olvidó hacer esta búsqueda"
            });
    }
}

module.exports = {
    buscar
}
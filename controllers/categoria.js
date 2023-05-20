const { response, request } = require('express');

const { Categoria } = require("../models");

const categoriasGet = async (req = request, res = response) => {
    const query = { estado: true };

    const { limite = 5, desde = 0 } = req.query;
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate("usuario"),
    ]);

    res.json({
        total,
        categorias
    });
}

const crearCategoria = async (req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre} ya existe`,
        });
    }

    const categoria = await Categoria({ nombre, usuario: req.usuario._id });
    await categoria.save();
    res.status(201).json(categoria);
}


const categoriasPut = async (req = request, res = response) => {
    const id = req.params.id;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json(categoria);
}

const categoriaGetId = async (req = request, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findById(id)
        .populate("usuario");

    res.json(categoria);
}

const categoriaDelete = async (req = request, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false });

    res.json(categoria);
}

module.exports = {
    crearCategoria,
    categoriasGet,
    categoriasPut,
    categoriaGetId,
    categoriaDelete,
}
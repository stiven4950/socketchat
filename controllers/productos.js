const { response, request } = require('express');

const { Producto } = require("../models");

const productoGet = async (req = request, res = response) => {
    const query = { estado: true };

    const { limite = 5, desde = 0 } = req.query;
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate("usuario"),
    ]);

    res.json({
        total,
        productos
    });
}

const productoPost = async (req = request, res = response) => {
    let { state, usuario, nombre, ...body } = req.body

    const productoDB = await Producto.findOne({ nombre: nombre.toUpperCase() });
    if (productoDB) {
        return res.status(400).json({
            msg: `el producto ${productoDB.nombre} ya existe`,
        });
    }

    const data = {
        ...body,
        nombre: nombre.toUpperCase(),
        usuario: req.usuario._id,
    }

    const producto = await Producto(data);
    await producto.save();
    res.status(201).json(producto);
}

const productoPut = async (req = request, res = response) => {
    const id = req.params.id;
    const { state, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json(producto);
}

const productoGetId = async (req = request, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate("usuario");

    res.json(producto);
}

const productoDelete = async (req = request, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado: false });

    res.json(producto);
}

module.exports = {
    productoPost,
    productoGet,
    productoPut,
    productoGetId,
    productoDelete,
}
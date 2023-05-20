const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models")

const cargarArchivo = async (req, res = response) => {
    try {
        // const nombre = await subirArchivo(req.files, ['txt', 'md']);
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        return res.json({ nombre });
    } catch (error) {
        return res.status(400).json({ error });
    }
}

const actualizarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case "usuarios":
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`,
                })
            }

            break;

        case "productos":
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`,
                })
            }

            break;

        default:
            return res.status(500).json({ msg: "Se me olvidó validar esto" })
    }

    // Se comprueba si existe un path en la instancia del modelo
    if (modelo.img) {
        const pathImage = path.join(__dirname, "../uploads", coleccion, modelo.img);
        if (fs.existsSync(pathImage)) {
            // Si el path existe se elimina el archivo especificado
            fs.unlinkSync(pathImage);
        }
    }

    modelo.img = await subirArchivo(req.files, undefined, coleccion);
    modelo.save();

    res.json(modelo);
}

const actualizarImagenCloudinary = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case "usuarios":
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`,
                })
            }

            break;

        case "productos":
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`,
                })
            }

            break;

        default:
            return res.status(500).json({ msg: "Se me olvidó validar esto" })
    }

    // Se comprueba si existe un path en la instancia del modelo
    if (modelo.img) {
        const nomArr = modelo.img.split("/");
        const nombre = nomArr.pop();
        const [public_id] = nombre.split(".");
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;
    modelo.save();

    res.json(modelo);
}

const mostrarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case "usuarios":
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`,
                })
            }

            break;

        case "productos":
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`,
                })
            }

            break;

        default:
            return res.status(500).json({ msg: "Se me olvidó validar esto" })
    }

    // Se comprueba si existe un path en la instancia del modelo
    if (modelo.img) {
        const pathImage = path.join(__dirname, "../uploads", coleccion, modelo.img);
        if (fs.existsSync(pathImage)) {
            return res.sendFile(pathImage);
        }
    }

    const pathImage = path.join(__dirname, "../assets/no-image.jpg");
    return res.sendFile(pathImage);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}
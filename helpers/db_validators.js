const Role = require("../models/role");
const { Usuario, Categoria, Producto } = require("../models");

const esRoleValido = async (rol = "") => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

const emailExiste = async (correo = "") => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya existe en la DB`)
    }
}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El ID: ${id} no existe`)
    }
}

const existeCategoriaPorId = async (id) => {
    const existe = await Categoria.findById(id);
    if (!existe) {
        throw new Error(`El ID: ${id} no existe`)
    }
}

const existeProductoPorId = async (id) => {
    const existe = await Producto.findById(id);
    if (!existe) {
        throw new Error(`El ID: ${id} no existe`)
    }
}

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La colección ${coleccion} no es permitida, ${colecciones}`)
    }
    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas,
}
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT } = require('../middlewares');

const { crearCategoria, categoriasGet, categoriasPut, categoriaDelete, categoriaGetId } = require('../controllers/categoria');
const { existeCategoriaPorId } = require('../helpers/db_validators');

const router = Router();

router.get("/", [
    validarJWT,
], categoriasGet);

router.get("/:id", [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
], categoriaGetId);

router.post("/", [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
], crearCategoria);

router.put("/:id", [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
], categoriasPut);

router.delete("/:id", [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
], categoriaDelete);

module.exports = router;
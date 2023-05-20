const { Router } = require('express');
const { check } = require('express-validator');
const { productoGet, productoPost, productoPut, productoDelete, productoGetId } = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db_validators');

const { validarCampos, validarJWT } = require('../middlewares');

const router = Router();

router.get("/", [
    validarJWT,
], productoGet);

router.get("/:id", [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProductoPorId),
], productoGetId);

router.post("/", [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("precio", "El precio es obligatorio").not().isEmpty(),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("categoria", "No es un ID de categoría válido").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    validarCampos,
], productoPost);

router.put("/:id", [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProductoPorId),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("precio", "El precio es obligatorio").not().isEmpty(),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("categoria", "No es un ID de categoría válido").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    validarCampos,
], productoPut);

router.delete("/:id", [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProductoPorId),
], productoDelete);

module.exports = router;
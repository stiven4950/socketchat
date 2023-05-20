const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete, usuariosPatch } = require('../controllers/user');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db_validators');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole } = require('../middlewares');

const router = Router();

router.get('/', usuariosGet);
router.post('/', [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio y más de seis caracteres").isLength({ min: 6 }),
    check("correo", "El correo no es válido").isEmail(),
    check("correo").custom(emailExiste),
    check("rol").custom(esRoleValido),
    validarCampos
], usuariosPost);
router.put('/:id', [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRoleValido),
    validarCampos,
], usuariosPut);
router.patch('/', usuariosPatch);
router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole("VENTAS_ROLE", "ADMIN_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
], usuariosDelete);

module.exports = router;
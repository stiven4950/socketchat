const validarCampos = require('../middlewares/validar_campos');
const validarJWT = require('../middlewares/validar_jwt');
const validaRoles = require('../middlewares/validar_roles');
const validarArchivo = require('./validar_archivo');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivo,
}
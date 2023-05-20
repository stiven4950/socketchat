const { response } = require("express");

const esAdminRole = (req, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            "msg": "Se quiere verificar el rol sin validar el token primero",
        })
    }

    const { rol, nombre } = req.usuario;
    if (rol !== "ADMIN_ROLE") {
        return res.status(401).json({
            msg: `${nombre} no es administrador`
        });
    }

    next();
}

const tieneRole = (...roles) => {
    return (req, res = response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                "msg": "Se quiere verificar el rol sin validar el token primero",
            })
        }
        const { rol } = req.usuario;
        if (!roles.includes(rol)) {
            return res.status(401).json({
                msg: `El servicio requiere alguno de estos roles: ${roles}`
            });
        }
        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole,
}
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const subirArchivo = (files, extensionesValidas = ["png", "jpg", "jpeg", "gif"], carpeta = "") => {
    return new Promise((resolve, reject) => {
        const { archivo } = files;
        const extension = archivo.name.split(".").pop();
        const nombre = uuidv4() + "." + extension;

        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es permitida, ${extensionesValidas}`);
        }

        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombre);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            return resolve(nombre);
        });
    });
}

module.exports = {
    subirArchivo,
}
const express = require('express');
const cors = require('cors');
const { createServer } = require("http");

const { dbConnection } = require("../database/config");
const fileUpload = require('express-fileupload');
const { socketController } = require('../sockets/controllers');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);
        this.io = require("socket.io")(this.server);

        this.paths = {
            auth: "/api/auth",
            buscar: "/api/buscar",
            categorias: "/api/categorias",
            productos: "/api/productos",
            usuarios: "/api/usuarios",
            uploads: "/api/uploads",
        }

        this.conectarDB();
        this.middlewares();

        this.routes();

        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(express.static("public"));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: "/tmp/",
            createParentPath: true,
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require("../routes/auth"));
        this.app.use(this.paths.buscar, require("../routes/buscar"));
        this.app.use(this.paths.categorias, require("../routes/category"));
        this.app.use(this.paths.productos, require("../routes/productos"));
        this.app.use(this.paths.usuarios, require("../routes/user"));
        this.app.use(this.paths.uploads, require("../routes/uploads"));
    }

    sockets() {
        this.io.on("connection", (socket) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log("Servidor corriendo en el puerto ", this.port);
        });
    }
}


module.exports = Server;
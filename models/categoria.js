const { Schema, model } = require("mongoose");

const CategoriaShema = Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        unique: true,
    },
    estado: {
        type: Boolean,
        default: true,
        required: true,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
});

CategoriaShema.methods.toJSON = function () {
    const { __v, ...data } = this.toObject();
    return data;
}

module.exports = model("Categoria", CategoriaShema);
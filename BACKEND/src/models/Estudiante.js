import { Schema, model } from 'mongoose';
import bcrypt from "bcryptjs";

const estudianteSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        trim: true,
        default: null
    },
    curso: {
        type: String,
        trim: true,
        required: true
    },
    celular: {
        type: String,
        trim: true,
        default: null
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    estatus: {
        type: Boolean,
        default: true
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    rol: {
        type: String,
        default: 'estudiante'
    }
}, {
    timestamps: true
});

// Método para verificar si el password ingresado es el mismo de la BDD
estudianteSchema.methods.matchPassword = async function (password) {
    const response = await bcrypt.compare(password, this.password)
    return response
}

export default model('Estudiante', estudianteSchema);

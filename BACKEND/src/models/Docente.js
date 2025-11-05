import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

const docenteSchema = new Schema({
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
    materias: [{
        type: String,
        trim: true,
    }],
    status: {
        type: Boolean,
        default: true
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    rol: {
        type: String,
        default: 'docente'
    }
}, {
    timestamps: true
});

// Método para verificar si el password ingresado es el mismo de la BDD
docenteSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}

export default model('Docente', docenteSchema);

import mongoose, { Schema, model } from 'mongoose'

const calificacionSchema = new Schema({
    estudiante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estudiante',
        required: true
    },
    docente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Docente',
        required: true
    },
    materia: {
        type: String,
        required: true,
    },
    parcial1: {
        deberes: {
            type: Number,
            default: 0
        },
        examenes: {
            type: Number,
            default: 0
        },
        trabajosClase: {
            type: Number,
            default: 0
        },
        proyectos: {
            type: Number,
            default: 0
        },
        promedio: {
            type: Number,
            default: 0
        }
    },
    parcial2: {
        deberes: {
            type: Number,
            default: 0
        },
        examenes: {
            type: Number,
            default: 0
        },
        trabajosClase: {
            type: Number,
            default: 0
        },
        proyectos: {
            type: Number,
            default: 0
        },
        promedio: {
            type: Number,
            default: 0
        }
    },
    parcial3: {
        deberes: {
            type: Number,
            default: 0
        },
        examenes: {
            type: Number,
            default: 0
        },
        trabajosClase: {
            type: Number,
            default: 0
        },
        proyectos: {
            type: Number,
            default: 0
        },
        promedio: {
            type: Number,
            default: 0
        }
    },
    promedioFinal: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

//Calculo del promedio final 
calificacionSchema.pre('save', function (next) {
    const calcularPromedio = (p) => {
        const deberes = p.deberes || 0;
        const examenes = p.examenes || 0;
        const trabajosClase = p.trabajosClase || 0;
        const proyectos = p.proyectos || 0;
        const total = deberes + examenes + trabajosClase + proyectos;
        const Suma = [deberes, examenes, trabajosClase, proyectos].filter(score => score > 0).length;
        if (Suma === 0) return 0;
        const count = 4; 
        return Number((total / count).toFixed(2));
    };

    //Calculo del promedio en caso de que haya notas en cada trimestre
    this.parcial1.promedio = calcularPromedio(this.parcial1);
    this.parcial2.promedio = calcularPromedio(this.parcial2);
    this.parcial3.promedio = calcularPromedio(this.parcial3);

    // Promedio final con las notas de cada trimestre
    const parciales = [this.parcial1.promedio, this.parcial2.promedio, this.parcial3.promedio].filter(p => p > 0);
    
    if (parciales.length === 0) {
        this.promedioFinal = 0;
    }else{
        const sumaPromedios = parciales.reduce((acc, curr) => acc + curr, 0);
        this.promedioFinal = (sumaPromedios / parciales.length).toFixed(2);
    }
    
    next();
});

export default mongoose.model('Calificacion', calificacionSchema);
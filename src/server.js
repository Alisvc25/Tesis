import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routerAdministrador from './routers/administrador_routes.js';

//Estudiante
import routerEstudiante from './routers/estudiante_routes.js';

//Docente
import routerDocente from './routers/docente_routes.js';

//Calificaciones
import routerCalificacion from './routers/calificacion_routes.js';
import session from 'express-session';

dotenv.config();

// Inicializaciones
const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || process.env.URL_FRONTEND || 'http://localhost:5173';
console.log('FRONTEND_URL:', FRONTEND_URL);

// Configurar sesiones
app.use(cors({
    //origin: FRONTEND_URL,
    origin: true,
    credentials: true,
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

//module.exports = app;

// Configuraciones 
//app.use(cors()); // Permitir solicitudes desde cualquier origen

// Middlewares 
app.use(express.json());
// Para poder recibir datos en formato JSON y URL-encoded
app.use(express.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);
/*
// Configuración de Cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads',
    limits: { fileSize: 10 * 1024 * 1024 }, // hasta 10MB
}))
*/
// Variables globales

// Rutas para administradores
app.use('/administrador', routerAdministrador);

// Rutas para Estudiantes
app.use('/apiE', routerEstudiante);

// Rutas para docentes
app.use('/apiD', routerDocente);

//Ruta para calificaciones
app.use('/apiC', routerCalificacion);

// Rutas 
app.get('/', (req, res) => {
    res.send("Server on");
});

// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));


// Exportar la instancia de express por medio de app
export default app;

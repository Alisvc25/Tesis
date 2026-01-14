import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';

import routerAdministrador from './routers/administrador_routes.js';
import routerEstudiante from './routers/estudiante_routes.js';
import routerDocente from './routers/docente_routes.js';
import routerCalificacion from './routers/calificacion_routes.js';

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

// Middlewares 
app.use(express.json());
// Para poder recibir datos en formato JSON y URL-encoded
app.use(express.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

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

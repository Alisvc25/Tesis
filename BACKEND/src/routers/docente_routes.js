import { Router } from 'express'
import { loginDocente, perfilDocente /*actualizarPerfil*/, actualizarPassword, eliminarCalificaciones,
    crearCalificacion, actualizarCalificacion, listarCalificaciones } from '../controllers/docentes_controller.js'

import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()

router.post("/login", loginDocente);

router.get("/perfil", verificarTokenJWT, perfilDocente);
router.put("/actualizarpassword/:id", verificarTokenJWT, actualizarPassword);

router.post("/calificacion", verificarTokenJWT, crearCalificacion);
router.put("/calificacion/:id", verificarTokenJWT, actualizarCalificacion);
router.delete("/calificacion/:id", verificarTokenJWT, eliminarCalificaciones);
router.get("/calificaciones/:id", verificarTokenJWT, listarCalificaciones);


export default router
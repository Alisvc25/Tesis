import { Router } from 'express'
import { loginDocente, perfil, recuperarPassword, eliminarCalificaciones, comprobarTokenPasword,
    crearCalificacion, actualizarCalificacion, listarCalificaciones, crearNuevoPassword } from '../controllers/docentes_controller.js'

import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()

router.post("/login", loginDocente);

router.get("/perfil", verificarTokenJWT, perfil);
router.put("/recuperarpassword", recuperarPassword);
router.get('/recuperarpassword/:token',comprobarTokenPasword)
router.post('/recuperarpassword/:token',crearNuevoPassword)


router.post("/calificacion", verificarTokenJWT, crearCalificacion);
router.put("/calificacion/:id", verificarTokenJWT, actualizarCalificacion);
router.delete("/calificacion/:id", verificarTokenJWT, eliminarCalificaciones);
router.get("/calificaciones/:id", verificarTokenJWT, listarCalificaciones);


export default router
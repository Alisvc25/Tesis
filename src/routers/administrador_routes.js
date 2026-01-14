import e, {Router} from 'express'
import {comprobarTokenPasword, confirmarMail, login, recuperarPassword, crearNuevoPassword,
    registro, registrarDocente, listarDocentes, visualizarDocente, actualizarDocente, eliminarDocente,
    registrarEstudiante, listarEstudiantes, visualizarEstudiante, 
    actualizarEstudiante, eliminarEstudiante } from '../controllers/administrador_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()

router.post('/registro',registro)
router.get('/confirmar/:token',confirmarMail)

router.post('/recuperarpassword',recuperarPassword)
router.get('/recuperarpassword/:token',comprobarTokenPasword)
router.post('/recuperarpassword/:token',crearNuevoPassword)


router.post('/login',login)

router.post('/registroDocente',verificarTokenJWT,registrarDocente)
router.get('/listarDocentes',verificarTokenJWT,listarDocentes)
router.get('/visualizarDocente/:id',verificarTokenJWT,visualizarDocente)
router.put('/actualizarDocente/:id',verificarTokenJWT,actualizarDocente)
router.delete('/eliminarDocente/:id',verificarTokenJWT,eliminarDocente)

router.post('/registroEstudiante',verificarTokenJWT,registrarEstudiante)
router.get('/listarEstudiantes',verificarTokenJWT,listarEstudiantes)
router.get('/visualizarEstudiante/:id',verificarTokenJWT,visualizarEstudiante)
router.put('/actualizarEstudiante/:id',verificarTokenJWT,actualizarEstudiante)
router.delete('/eliminarEstudiante/:id',verificarTokenJWT,eliminarEstudiante)

export default router

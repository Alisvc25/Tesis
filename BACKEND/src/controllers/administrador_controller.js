import Administrador from "../models/Administrador.js"
import Docente from "../models/Docente.js"
import Estudiante from "../models/Estudiante.js"
import { sendMailToOwner, sendMailToRegister, sendMailToRecoveryPassword } from "../helpers/email.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const registro = async (req, res) => {
    const { email, password } = req.body
    console.log('req.body:', req.body);
    //2
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    const administradorEmailBDD = await Administrador.findOne({ email })
    if (administradorEmailBDD) return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" })
    //3    
    const nuevoAdministrador = await Administrador(req.body)

    nuevoAdministrador.password = await nuevoAdministrador.encrypPassword(password)

    const token = nuevoAdministrador.crearToken()
    await sendMailToRegister(email, token)

    await nuevoAdministrador.save()
    //4
    res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" })
}

const registrarDocente = async (req, res) => {
    const { nombre, apellido, direccion, cedula, celular,
        email, materias } = req.body;

    if (Object.values(req.body).includes(""))
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    const docenteExiste = await Docente.findOne({ email });
    if (docenteExiste)
        return res.status(400).json({ msg: "El email ya se encuentra registrado para un docente" });

    const passwordGenerada = Math.random().toString(36).slice(-8);
    const passwordEncriptado = await bcrypt.hash(passwordGenerada, 10);

    const nuevoDocente = new Docente({
        nombre,
        apellido,
        direccion,
        cedula,
        celular,
        email,
        materias,
        password: passwordEncriptado,
        rol: "docente",
        confirmEmail: true
    });

    const saved = await nuevoDocente.save();

    res.status(201).json({ msg: "Docente registrado correctamente. Revise su correo electrónico." });

    (async () => {
        try {
            await sendMailToOwner(email, passwordGenerada);
            console.log(`Email enviado a ${email}`);
        } catch (mailErr) {
            console.error(`Error enviando email a ${email}:`, mailErr);
        }
    })();
};

const listarDocentes = async (req, res) => {
    const docentes = await Docente.find().select("-password -token -__v -createdAt -updatedAt");
    res.status(200).json(docentes);
};

const visualizarDocente = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({ msg: "ID no válido" })

    const docente = await Docente.findById(id).select("-password -__v")

    if (!docente)
        return res.status(404).json({ msg: "Docente no encontrado" })

    res.status(200).json(docente)
}

const actualizarDocente = async (req, res) => {
    const { id } = req.params

    const docente = await Docente.findById(id)
    if (!docente)
        return res.status(404).json({ msg: "Docente no encontrado" })

    Object.assign(docente, req.body)
    await docente.save()

    res.status(200).json({ msg: "Docente actualizado correctamente" })
}

const eliminarDocente = async (req, res) => {
    const { id } = req.params

    const docente = await Docente.findById(id)
    if (!docente)
        return res.status(404).json({ msg: "Docente no encontrado" })

    await docente.deleteOne()
    res.status(200).json({ msg: "Docente eliminado correctamente" })
}

const registrarEstudiante = async (req, res) => {
    const { nombre, apellido, cedula, fechaNacimiento, nacionalidad, cultura, direccion,
        celular, email, curso } = req.body;

    if (Object.values(req.body).includes(""))
        return res.status(400).json({ msg: "Lo sentimos, debes completar todos los campos" });

    const estudianteExiste = await Estudiante.findOne({ email });
    if (estudianteExiste)
        return res.status(400).json({ msg: "El email ya se encuentra registrado para un estudiante" });

    const passwordGenerada = Math.random().toString(36).slice(-8);
    const passwordEncriptado = await bcrypt.hash(passwordGenerada, 10);

    const nuevoEstudiante = new Estudiante({
        nombre,
        apellido,
        cedula,
        fechaNacimiento,
        nacionalidad,
        cultura,
        direccion,
        celular,
        email,
        curso,
        password: passwordEncriptado,
        rol: "estudiante",
        confirmEmail: true
    });

    const saved = await nuevoEstudiante.save();

    res.status(201).json({ msg: "Estudiante registrado correctamente. Revise su correo electrónico." });

    (async () => {
        try {
            await sendMailToOwner(email, passwordGenerada);
            console.log(`Email enviado a ${email}`);
        } catch (mailErr) {
            console.error(`Error enviando email a ${email}:`, mailErr);
        }
    })();
};

const listarEstudiantes = async (req, res) => {
    const estudiantes = await Estudiante.find().select("-password -__v")
    res.status(200).json(estudiantes)
}

const visualizarEstudiante = async (req, res) => {
    const { id } = req.params

    const estudiante = await Estudiante.findById(id).select("-password -__v")
    if (!estudiante)
        return res.status(404).json({ msg: "Estudiante no encontrado" })

    res.status(200).json(estudiante)
}

const actualizarEstudiante = async (req, res) => {
    const { id } = req.params

    const estudiante = await Estudiante.findById(id)
    if (!estudiante)
        return res.status(404).json({ msg: "Estudiante no encontrado" })

    Object.assign(estudiante, req.body)
    await estudiante.save()

    res.status(200).json({ msg: "Estudiante actualizado correctamente" })
}

const eliminarEstudiante = async (req, res) => {
    const { id } = req.params

    const estudiante = await Estudiante.findById(id)
    if (!estudiante)
        return res.status(404).json({ msg: "Estudiante no encontrado" })

    await estudiante.deleteOne()
    res.status(200).json({ msg: "Estudiante eliminado correctamente" })
}

const confirmarMail = async (req, res) => {
    //1
    if (!(req.params.token)) return res.status(400).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
    //2
    const administradorBDD = await Administrador.findOne({ token: req.params.token })

    if (!administradorBDD?.token) return res.status(404).json({ msg: "La cuenta ya ha sido confirmada" })
    //3
    administradorBDD.token = null
    administradorBDD.confirmEmail = true
    await administradorBDD.save()
    //4
    res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" })
}

const recuperarPassword = async (req, res) => {
    const { email } = req.body
    if (Object.values(req.body).includes(""))
        return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    const administradorBDD = await Administrador.findOne({ email })
    if (!administradorBDD)
        return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" })

    const token = administradorBDD.crearToken()
    administradorBDD.token = token
    await sendMailToRecoveryPassword(email, token)
    await administradorBDD.save()

    res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" })
}

const comprobarTokenPasword = async (req, res) => {
    const { token } = req.params
    const administradorBDD = await Administrador.findOne({ token })
    if (administradorBDD?.token !== req.params.token) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
    await administradorBDD.save()
    res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nuevo password" })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (Object.values(req.body).includes(""))
        return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    const administradorBDD = await Administrador.findOne({ email }).select("-status -__v -token -updatedAt -createdAt")

    if (administradorBDD?.confirmEmail === false)
        return res.status(403).json({ msg: "Lo sentimos, debe verificar su cuenta" })

    if (!administradorBDD)
        return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" })

    const verificarPassword = await administradorBDD.matchPassword(password)

    if (!verificarPassword)
        return res.status(401).json({ msg: "Lo sentimos, el password no es el correcto" })

    const { nombre, apellido, celular, _id, rol } = administradorBDD

    const token = crearTokenJWT(administradorBDD._id, administradorBDD.rol)

    res.status(200).json({
        token,
        nombre,
        apellido,
        celular,
        _id,
        rol
    })
}

export {
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPasword,
    login,
    registrarDocente,
    listarDocentes,
    visualizarDocente,
    actualizarDocente,
    eliminarDocente,
    registrarEstudiante,
    listarEstudiantes,
    visualizarEstudiante,
    actualizarEstudiante,
    eliminarEstudiante
}
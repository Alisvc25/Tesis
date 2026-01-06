import Docente from "../models/Docente.js"
import Calificacion from "../models/Calificacion.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"

/*
const registrarDocente = async (req, res) => {
    const { email, password } = req.body;
    if (Object.values(req.body).includes(""))
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    const docenteExist = await Docente.findOne({ email });
    if (docenteExist) return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });

    const nuevoDocente = new Docente(req.body);
    nuevoDocente.password = await nuevoDocente.encrypPassword(password);
    await nuevoDocente.save();

    res.status(200).json({ msg: "Docente registrado correctamente" });
};
*/

const loginDocente = async (req, res) => {
    const { email, password } = req.body;
    if (Object.values(req.body).includes(""))
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    const docenteBDD = await Docente.findOne({ email }).select("-status -__v -token -updatedAt -createdAt");
    if (!docenteBDD) return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });

    if (docenteBDD?.confirmEmail === false) return res.status(403).json({ msg: "Lo sentimos, debe verificar su cuenta" });

    const verificarPassword = await docenteBDD.matchPassword(password);
    if (!verificarPassword) return res.status(401).json({ msg: "Lo sentimos, el password no es el correcto" });

    const token = crearTokenJWT(docenteBDD._id, docenteBDD.rol);

    res.status(200).json({
        token,
        nombre: docenteBDD.nombre,
        apellido: docenteBDD.apellido,
        materias: docenteBDD.materias,
        _id: docenteBDD._id,
        rol: docenteBDD.rol
    });
};

const perfilDocente = (req, res) => {
    const { token, confirmEmail, createdAt, updatedAt, __v, ...datosPerfil } = req.docenteBDD;
    res.status(200).json(datosPerfil);
};

/*
const actualizarPerfil = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, direccion, celular, email, materias } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Lo sentimos, debe ser un id válido" });

    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    const docenteBDD = await Docente.findById(id);
    if (!docenteBDD) return res.status(404).json({ msg: `Lo sentimos, no existe el docente ${id}` });

    if (docenteBDD.email != email) {
        const docenteBDDMail = await Docente.findOne({ email });
        if (docenteBDDMail) return res.status(404).json({ msg: `Lo sentimos, el email ya se encuentra registrado` });
    }

    docenteBDD.nombre = nombre ?? docenteBDD.nombre;
    docenteBDD.apellido = apellido ?? docenteBDD.apellido;
    docenteBDD.direccion = direccion ?? docenteBDD.direccion;
    docenteBDD.celular = celular ?? docenteBDD.celular;
    docenteBDD.email = email ?? docenteBDD.email;
    docenteBDD.materias = materias ?? docenteBDD.materias;

    await docenteBDD.save();
    res.status(200).json(docenteBDD);
};
*/

const actualizarPassword = async (req, res) => {
    const docenteBDD = await Docente.findById(req.docenteBDD._id);
    if (!docenteBDD) return res.status(404).json({ msg: "Lo sentimos, no existe el docente" });

    const verificarPassword = await docenteBDD.matchPassword(req.body.passwordactual);
    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, el password actual no es el correcto" });

    docenteBDD.password = await docenteBDD.encrypPassword(req.body.passwordnuevo);
    await docenteBDD.save();
    res.status(200).json({ msg: "Password actualizado correctamente" });
};

const crearCalificacion = async (req, res) => {
    try {
        const { estudiante, materia, parcial1, parcial2, parcial3 } = req.body;
        const docente = req.docenteBDD._id;

        const docenteBDD = await Docente.findById(docente);

        if (!docenteBDD.materias.includes(materia)) {
            return res.status(403).json({ msg: "Materia no asignada al docente" });
        }

        if (!estudiante || !docente || !materia)
            return res.status(400).json({ msg: "Todos los campos son obligatorios" });

        if (!parcial1 && !parcial2 && !parcial3)
            return res.status(400).json({ msg: "Debe enviar al menos un parcial" });

        const nueva = new Calificacion({
            estudiante,
            docente,
            materia,
            parcial1: parcial1 ?? undefined,
            parcial2: parcial2 ?? undefined,
            parcial3: parcial3 ?? undefined
        });

        await nueva.save();
        res.status(201).json({ msg: "Calificación registrada", nueva });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al crear calificación" });
    }
};

const actualizarCalificacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { parcial1, parcial2, parcial3 } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "ID inválido" });

        const calificacion = await Calificacion.findById(id);
        if (!calificacion) return res.status(404).json({ msg: "Calificación no encontrada" });

        // reasignar solo los parciales enviados
        calificacion.parcial1 = parcial1 ? { ...calificacion.parcial1.toObject?.(), ...parcial1 } : calificacion.parcial1;
        calificacion.parcial2 = parcial2 ? { ...calificacion.parcial2.toObject?.(), ...parcial2 } : calificacion.parcial2;
        calificacion.parcial3 = parcial3 ? { ...calificacion.parcial3.toObject?.(), ...parcial3 } : calificacion.parcial3;

        await calificacion.save();
        res.status(200).json({ msg: "Calificación actualizada", calificacion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar calificación" });
    }
};

const listarCalificaciones = async (req, res) => {
    const { id } = req.params; // el id del docente
    const calificaciones = await Calificacion.find({ docente: id })
        .populate("estudiante", "nombre apellido curso")
        .populate("docente", "nombre apellido materias");
    res.status(200).json(calificaciones);
};


export {
    //registrarDocente,
    loginDocente,
    perfilDocente,
    //actualizarPerfil,
    actualizarPassword,
    crearCalificacion,
    actualizarCalificacion,
    listarCalificaciones
};
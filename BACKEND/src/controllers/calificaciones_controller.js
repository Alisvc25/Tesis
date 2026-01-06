import Calificacion from "../models/Calificacion.js"
import mongoose from "mongoose";

const crearCalificaciones = async (req, res) => {
    const calificacion = new Calificacion(req.body);
    await calificacion.save();
    res.status(201).json({ msg: "La calificación se registro correctamente", calificacion });
};

const actualizarCalificaciones = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "ID inválido" });

    const calificacion = await Calificacion.findById(id);
    if (!calificacion) return res.status(404).json({ msg: "Calificación no encontrada" });

    Object.assign(calificacion, req.body);
    await calificacion.save();

    res.status(200).json({ msg: "La calificación se actualizo correctamente", calificacion });
};

const obtenerCalificaciones = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "El ID no es correcto" });

    const calificaciones = await Calificacion.findById(id)
        .populate("estudiante", "nombre apellido curso")
        .populate("docente", "nombre apellido materias");

    if (!calificaciones) return res.status(404).json({ msg: "No se encontraron las calificaciones" });

    res.status(200).json(calificaciones);
};

const listarCalificaciones = async (req, res) => {
    const { id } = req.params;
    const calificaciones = await Calificacion.find({ docente: id })
        .populate("estudiante", "nombre apellido curso")
        .populate("docente", "nombre apellido materias");
    res.status(200).json(calificaciones);
};

const eliminarCalificaciones = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "ID inválido" });

    await Calificacion.findByIdAndDelete(id);
    res.status(200).json({ msg: "Calificación eliminada correctamente" });
};

export {
    crearCalificaciones,
    actualizarCalificaciones,
    obtenerCalificaciones,
    listarCalificaciones,
    eliminarCalificaciones
}
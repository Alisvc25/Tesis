import Estudiante from "../models/Estudiante.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import Calificacion from "../models/Calificacion.js"

const loginEstudiante = async (req, res) => {
    const { email, password } = req.body;
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    const estudianteBDD = await Estudiante.findOne({ email }).select("-status -__v -token -updatedAt -createdAt");
    if (!estudianteBDD) return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });

    if (estudianteBDD?.confirmEmail === false) return res.status(403).json({ msg: "Lo sentimos, debe verificar su cuenta" });

    const verificarPassword = await estudianteBDD.matchPassword(password);
    if (!verificarPassword) return res.status(401).json({ msg: "Lo sentimos, el password no es el correcto" });

    const token = crearTokenJWT(estudianteBDD._id, estudianteBDD.rol);
    res.status(200).json({
        token,
        nombre: estudianteBDD.nombre,
        apellido: estudianteBDD.apellido,
        curso: estudianteBDD.curso,
        _id: estudianteBDD._id,
        rol: estudianteBDD.rol
    });
};

const listarCalificaciones = async (req, res) => {
    try {
        const { id } = req.params;
        const calificaciones = await Calificacion.find({ estudiante: id })
            .populate("docente", "nombre apellido materias");

        // calculo del promedio general
        if (calificaciones.length === 0) return res.status(200).json({ calificaciones: [], promedioGeneral: 0 });

        const sumaPromedios = calificaciones.reduce((s, c) => s + (c.promedioFinal || 0), 0);
        const promedioGeneral = Number((sumaPromedios / calificaciones.length).toFixed(2));

        res.status(200).json({ calificaciones, promedioGeneral });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener calificaciones" });
    }
};

export {
    loginEstudiante,
    listarCalificaciones
}

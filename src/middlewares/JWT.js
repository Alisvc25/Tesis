import jwt from "jsonwebtoken"
import Administrador from "../models/Administrador.js"
import Estudiante from "../models/Estudiante.js"
import Docente from "../models/Docente.js"


const crearTokenJWT = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

const verificarTokenJWT = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization)
    return res.status(401).json({ msg: "Acceso denegado: token no proporcionado o inválido" })

  const token = authorization.split(" ")[1]

  try {
    const { id, rol } = jwt.verify(token, process.env.JWT_SECRET)

    if (rol === "administrador") {
      req.administradorBDD = await Administrador.findById(id).lean().select("-password")
    } else if (rol === "estudiante") {
      req.estudianteBDD = await Estudiante.findById(id).lean().select("-password")
    } else if (rol === "docente") {
      req.docenteBDD = await Docente.findById(id).lean().select("-password")
    } else {
      return res.status(401).json({ msg: "Rol de usuario no válido" })
    }
    return next()

  } catch (error) {
    return res.status(401).json({ msg: "Token inválido o expirado" })
  }
}


export {
  crearTokenJWT,
  verificarTokenJWT,
}

import Administrador from "../models/Administrador.js"
import Docente from "../models/Docente.js"
import Estudiante from "../models/Estudiante.js"
import { sendMailToOwner, sendMailToRegister, sendMailToRecoveryPassword } from "../config/nodemailler.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const registro = async (req,res)=>{
    const {email,password} = req.body
    console.log('req.body:', req.body); 
    //2
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    
    const administradorEmailBDD = await Administrador.findOne({email})
    if(administradorEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    //3    
    const nuevoAdministrador = await Administrador(req.body)
    
    nuevoAdministrador.password = await nuevoAdministrador.encrypPassword(password)

    const token = nuevoAdministrador.crearToken()
    await sendMailToRegister(email,token)

    await nuevoAdministrador.save()
    //4
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}

const registrarDocente = async (req, res) => {
    const { nombre, apellido, direccion, cedula, celular, 
        email, materias } = req.body;

    if (Object.values(req.body).includes("")) 
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    const docenteExiste = await Docente.findOne({ email });
    if (docenteExiste)
        return res.status(400).json({ msg: "El email ya se encuentra registrado para un docente" });

    const passwordTemporal = Math.random().toString(36).slice(-8);
    const passwordEncriptado = await bcrypt.hash(passwordTemporal, 10);

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

    await nuevoDocente.save();
    await sendMailToOwner(email, passwordTemporal);

    res.status(201).json({ msg: "Docente registrado correctamente y revise su correo electronico " });
};

const registrarEstudiante = async (req, res) => {
    const { nombre, apellido, cedula, fechaNacimiento, nacionalidad, direccion,
        celular, email, curso } = req.body;

    if (Object.values(req.body).includes("")) 
        return res.status(400).json({ msg: "Lo sentimos, debes completar todos los campos" });

    const estudianteExiste = await Estudiante.findOne({ email });
    if (estudianteExiste)
        return res.status(400).json({ msg: "El email ya se encuentra registrado para un estudiante" });

    const passwordTemporal = Math.random().toString(36).slice(-8);
    const passwordEncriptado = await bcrypt.hash(passwordTemporal, 10);

    const nuevoEstudiante = new Estudiante({
        nombre,
        apellido,
        cedula,
        fechaNacimiento,
        nacionalidad,
        direccion,
        celular,
        email,
        curso,
        password: passwordEncriptado,
        rol: "estudiante",
        confirmEmail: true
    });

    await nuevoEstudiante.save();
    await sendMailToOwner(email, passwordTemporal);

    res.status(201).json({ msg: "Estudiante registrado correctamente y correo enviado" });
};

const confirmarMail = async (req,res)=>{
    //1
    if (!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    //2
    const administradorBDD = await Administrador.findOne({token:req.params.token})

    if(!administradorBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
    //3
    administradorBDD.token = null
    administradorBDD.confirmEmail=true
    await administradorBDD.save()
    //4
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"})
}

// RECUPERAR CONTRASEÑA

const recuperarPassword = async(req,res)=>{
    const {email} = req.body
    if (Object.values(req.body).includes("")) 
        return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})

    const administradorBDD = await Administrador.findOne({email})
    if(!administradorBDD) 
        return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})

    const token = administradorBDD.crearToken()
    administradorBDD.token=token
    await sendMailToRecoveryPassword(email,token)
    await administradorBDD.save()

    res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu cuenta"})
}


const comprobarTokenPasword = async (req,res)=>{
    const {token} = req.params
    const administradorBDD = await Administrador.findOne({token})
    if(administradorBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    await administradorBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}


const crearNuevoPassword = async (req,res)=>{
    //1
    const {password, confirmpassword} = req.body;
    const { token } = req.params;
    
    //2
    if(Object.values(req.body).includes("")) 
        return res.status(404).json({msg: "Lo sentimos,debes llenar todos los campos"})

    if(password !== confirmpassword) 
        return res.status(404).json({msg: "Lo sentimos,los password no cinciden"})

    const administradorBDD = await Administrador.findOne({token:req.params.token})

    //if(administradorBDD.token !== req.params.token) return res.status(404).json({msg: "Lo sentimos, no se puede validar la cuenta"})
    if(!administradorBDD) 
        return res.status(404).json({msg: "Lo sentimos, no se puede validar la cuenta"})

    //3 logica - dejando token nulo y encriptacion de contraseña
    administradorBDD.token = null
    administradorBDD.password = await administradorBDD.encrypPassword(password)

    await administradorBDD.save()

    //4
    res.status(200).json({msg: "Felicitaciones, ya puedes iniciar sesion con tu nuevo password"})
}

const login = async(req,res)=>{
    const {email,password} = req.body;
    if (Object.values(req.body).includes("")) 
        return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
        
    const administradorBDD = await Administrador.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
    
    if(administradorBDD?.confirmEmail===false) 
        return res.status(403).json({msg:"Lo sentimos, debe verificar su cuenta"})
    
    if(!administradorBDD) 
        return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    
    const verificarPassword = await administradorBDD.matchPassword(password)

    if(!verificarPassword) 
        return res.status(401).json({msg:"Lo sentimos, el password no es el correcto"})
    
    const {nombre,apellido,celular,_id,rol} = administradorBDD
    
    const token = crearTokenJWT(administradorBDD._id,administradorBDD.rol)

    res.status(200).json({
        token,
        nombre,
        apellido,
        celular,
        _id,
        rol
    })
}

const perfil =(req,res)=>{
		const {token,confirmEmail,createdAt,updatedAt,__v,...datosPerfil} = req.administradorBDD
    res.status(200).json(datosPerfil)
}

/*const actualizarPerfil = async (req,res)=>{
    const {id} = req.params
    const {nombre,apellido,direccion,celular,email} = req.body
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const administradorBDD = await Administrador.findById(id)
    if(!administradorBDD) return res.status(404).json({msg:`Lo sentimos, no existe el administrador ${id}`})
    if (administradorBDD.email != email)
    {
        const administradorBDDMail = await Administrador.findOne({email})
        if (administradorBDDMail)
        {
            return res.status(404).json({msg:`Lo sentimos, el email existe ya se encuentra registrado`})  
        }
    }
    administradorBDD.nombre = nombre ?? administradorBDD.nombre
    administradorBDD.apellido = apellido ?? administradorBDD.apellido
    administradorBDD.direccion = direccion ?? administradorBDD.direccion
    administradorBDD.celular = celular ?? administradorBDD.celular
    administradorBDD.email = email ?? administradorBDD.email
    await administradorBDD.save()
    console.log(administradorBDD)
    res.status(200).json(administradorBDD)
}
*/


const actualizarPassword = async (req,res)=>{
    const administradorBDD = await Administrador.findById(req.administradorBDD._id)
    if(!administradorBDD) 
        return res.status(404).json({msg:`Lo sentimos, no existe el administrador ${id}`})

    const verificarPassword = await administradorBDD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) 
        return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})

    administradorBDD.password = await administradorBDD.encrypPassword(req.body.passwordnuevo)
    await administradorBDD.save()

    res.status(200).json({msg:"Password actualizado correctamente"})
}



export {
    registro,
    registrarDocente,
    registrarEstudiante,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPasword,
    crearNuevoPassword,
    login,
    perfil,
    actualizarPassword
}
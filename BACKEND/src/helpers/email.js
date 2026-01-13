import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMailToRegister = async (userMail, token) => {
    await resend.emails.send({
        from: "Unidad Educativa <onboarding@resend.dev>",
        to: userMail,
        subject: "Unidad Educativa Tránsito Amaguaña 🎓 - Registro de cuenta",
        html: `
            <h2>¡Registro exitoso! 🎓</h2>
            <p>Su cuenta ha sido creada correctamente.</p>
            <a href="${process.env.FRONTEND_URL}confirm/${token}">
                Activar cuenta
            </a>
            <hr />
            <footer>No responder este correo</footer>
        `
    });
};

const sendMailToRecoveryPassword = async (userMail, token) => {
    await resend.emails.send({
        from: "Unidad Educativa <onboarding@resend.dev>",
        to: userMail,
        subject: "Restablecer contraseña - Unidad Educativa 🎓",
        html: `
            <h2>Restablecer contraseña</h2>
            <a href="${process.env.FRONTEND_URL}reset/${token}">
                Crear nueva contraseña
            </a>
        `
    });
};

const sendMailToOwner = async (userMail, password) => {
    await resend.emails.send({
        from: "Unidad Educativa <onboarding@resend.dev>",
        to: userMail,
        subject: "Acceso al Sistema Académico 🎓",
        html: `
            <h1>Bienvenido/a</h1>
            <p><b>Usuario:</b> ${userMail}</p>
            <p><b>Contraseña:</b> ${password}</p>
            <a href="${process.env.FRONTEND_URL}login">Iniciar sesión</a>
        `
    });
};

export {
    sendMailToRegister,
    sendMailToRecoveryPassword,
    sendMailToOwner
};

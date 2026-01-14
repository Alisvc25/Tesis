import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const FRONTEND = process.env.FRONTEND_URL;

const sendMailToRegister = async (userMail, token) => {
    const link = `${FRONTEND}/confirm/${token}`;

    await resend.emails.send({
        from: "UEIB Tránsito Amaguaña <onboarding@resend.dev>",
        to: userMail,
        subject: "Activación de cuenta – UEIB Tránsito Amaguaña 🎓",
        html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Bienvenido a la Unidad Educativa Tránsito Amaguaña 🎓</h2>
            <p>Hemos creado tu cuenta correctamente.</p>
            <p>Para activarla, haz clic en el siguiente botón:</p>

        <a href="${link}" 
            style="display:inline-block; background:#1e3a8a; color:white; padding:12px 20px; text-decoration:none; border-radius:6px;">
            Activar cuenta
        </a>

        <p style="margin-top:20px;">Si no solicitaste esta cuenta, puedes ignorar este correo.</p>

        <hr>
        <small>Este mensaje fue enviado automáticamente. No responder.</small>
    </div>
    `
    });
};

const sendMailToRecoveryPassword = async (userMail, token) => {
    const link = `${FRONTEND}/recuperar-password/${token}`;

    await resend.emails.send({
        from: "UEIB Tránsito Amaguaña <onboarding@resend.dev>",
        to: userMail,
        subject: "Restablecer contraseña – UEIB Tránsito Amaguaña 🔐",
        html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Solicitud de cambio de contraseña</h2>
        <p>Hemos recibido una solicitud para cambiar tu contraseña.</p>
        <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>

        <a href="${link}" 
            style="display:inline-block; background:#dc2626; color:white; padding:12px 20px; text-decoration:none; border-radius:6px;">
            Crear nueva contraseña
        </a>

        <p style="margin-top:20px;">Si no solicitaste este cambio, ignora este correo.</p>

        <hr>
        <small>Este enlace es personal y expira por seguridad.</small>
    </div>
    `
    });
};

const sendMailToOwner = async (userMail, password) => {
    const link = `${FRONTEND}/login`;

    await resend.emails.send({
        from: "UEIB Tránsito Amaguaña <onboarding@resend.dev>",
        to: userMail,
        subject: "Credenciales de acceso – Sistema Académico 🎓",
        html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Acceso al Sistema Académico</h2>

        <p>Tu cuenta ha sido creada exitosamente.</p>

        <p><b>Usuario:</b> ${userMail}</p>
        <p><b>Contraseña:</b> ${password}</p>

        <a href="${link}" 
            style="display:inline-block; background:#1e3a8a; color:white; padding:12px 20px; text-decoration:none; border-radius:6px;">
            Iniciar sesión
        </a>

        <p style="margin-top:20px;">Por seguridad, cambia tu contraseña después de iniciar sesión.</p>
    </div>
    `
    });
};

export {
    sendMailToRegister,
    sendMailToRecoveryPassword,
    sendMailToOwner
};

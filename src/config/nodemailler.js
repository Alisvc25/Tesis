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
        <div style="font-family: Arial, sans-serif; background:#f6f7fb; padding:24px;">
            <div style="max-width:600px; margin:auto; background:#fff; padding:22px; border-radius:10px; border:1px solid #e5e7eb;">
            
            <h2 style="margin:0 0 8px; color:#111827; font-size:20px;">
                Bienvenido/a a la UEIB Tránsito Amaguaña 🎓
            </h2>

            <p style="margin:0 0 14px; color:#374151; font-size:15px; line-height:1.6;">
                Tu cuenta fue creada correctamente. Para empezar a usar el sistema, activa tu cuenta aquí:
            </p>

            <a href="${link}" 
                style="display:inline-block; background:#1e3a8a; color:#fff; padding:12px 16px; text-decoration:none; border-radius:8px; font-weight:bold; font-size:15px;">
                Activar cuenta
            </a>

            <p style="margin:16px 0 0; color:#6b7280; font-size:13px; line-height:1.6;">
                Si tú no solicitaste este registro, puedes ignorar este mensaje.
            </p>

            <hr style="border:none; border-top:1px solid #e5e7eb; margin:18px 0;">

            <p style="margin:0; color:#6b7280; font-size:12px;">
                Este correo fue enviado automáticamente. No responder.
            </p>
            </div>
        </div>
    `,
    });
};

const sendMailToRecoveryPassword = async (userMail, token) => {
    const link = `${FRONTEND}/recuperar-password/${token}`;

    await resend.emails.send({
        from: "UEIB Tránsito Amaguaña <onboarding@resend.dev>",
        to: userMail,
        subject: "Restablecer contraseña – UEIB Tránsito Amaguaña 🔐",
        html: `
        <div style="font-family: Arial, sans-serif; background:#f6f7fb; padding:24px;">
            <div style="max-width:600px; margin:auto; background:#fff; padding:22px; border-radius:10px; border:1px solid #e5e7eb;">
            
            <h2 style="margin:0 0 8px; color:#111827; font-size:20px;">
                Restablecer contraseña 🔐
            </h2>

            <p style="margin:0 0 14px; color:#374151; font-size:15px; line-height:1.6;">
                Recibimos una solicitud para cambiar tu contraseña. Si fuiste tú, continúa aquí:
            </p>

            <a href="${link}" 
                style="display:inline-block; background:#2563eb; color:#fff; padding:12px 16px; text-decoration:none; border-radius:8px; font-weight:bold; font-size:15px;">
                Crear nueva contraseña
            </a>

            <p style="margin:16px 0 0; color:#6b7280; font-size:13px; line-height:1.6;">
                Si tú no solicitaste este cambio, ignora este correo.
            </p>

            <hr style="border:none; border-top:1px solid #e5e7eb; margin:18px 0;">

            <p style="margin:0; color:#6b7280; font-size:12px;">
                Este correo fue enviado automáticamente. No responder.
            </p>
            </div>
        </div>
    `,
    });
};

const sendMailToOwner = async (userMail, password) => {
    const link = `${FRONTEND}/login`;

    await resend.emails.send({
        from: "UEIB Tránsito Amaguaña <onboarding@resend.dev>",
        to: userMail,
        subject: "Credenciales de acceso – Sistema Académico 🎓",
        html: `
        <div style="font-family: Arial, sans-serif; background:#f6f7fb; padding:24px;">
            <div style="max-width:600px; margin:auto; background:#fff; padding:22px; border-radius:10px; border:1px solid #e5e7eb;">
            
            <h2 style="margin:0 0 8px; color:#111827; font-size:20px;">
                Credenciales de acceso 🎓
            </h2>

            <p style="margin:0 0 14px; color:#374151; font-size:15px; line-height:1.6;">
                Tu cuenta fue creada. Puedes iniciar sesión con:
            </p>

            <div style="background:#f9fafb; border:1px solid #e5e7eb; padding:12px; border-radius:8px; font-size:14px; color:#111827;">
                <p style="margin:0 0 6px;"><b>Usuario:</b> ${userMail}</p>
                <p style="margin:0;"><b>Contraseña:</b> ${password}</p>
            </div>

            <a href="${link}" 
                style="display:inline-block; margin-top:14px; background:#1e3a8a; color:#fff; padding:12px 16px; text-decoration:none; border-radius:8px; font-weight:bold; font-size:15px;">
                Iniciar sesión
            </a>

            <p style="margin:16px 0 0; color:#6b7280; font-size:13px; line-height:1.6;">
                Por seguridad, cambia tu contraseña después de iniciar sesión.
            </p>

            <hr style="border:none; border-top:1px solid #e5e7eb; margin:18px 0;">

            <p style="margin:0; color:#6b7280; font-size:12px;">
                Este correo fue enviado automáticamente. No responder.
            </p>
            </div>
        </div>
        `,
    });
};

export { sendMailToRegister, sendMailToRecoveryPassword, sendMailToOwner };


jest.mock('../../src/config/nodemailler.js', () => ({
    sendMailToRegister: jest.fn(() => Promise.resolve(true)),
    sendMailToOwner: jest.fn(() => Promise.resolve(true)),
    sendMailToRecoveryPassword: jest.fn(() => Promise.resolve(true)),
}));
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,   
    auth: {
        user: process.env.USER_SMTP,
        pass: process.env.PASS_SMTP, 
    },
});

    const FROM = `UEIB Tránsito Amaguaña <${process.env.FROM_EMAIL}>`;

    const FRONTEND = (process.env.FRONTEND_URL || "").replace(/\/$/, "");

    export const verifyMailer = async () => {
    try {
        await transporter.verify();
        console.log("✅ Mailer listo (Gmail SMTP OK)");
    } catch (e) {
        console.error("❌ Error mailer:", e.message);
    }
    };

    export const sendMailToRegister = async (userMail, token) => {
    const link = `${FRONTEND}/confirm/${token}`;

    await transporter.sendMail({
        from: FROM,
        to: userMail,
        subject: "Activación de cuenta – UEIB Tránsito Amaguaña 🎓",
        html: `
        <div style="font-family:Inter,Arial,sans-serif;background:#f6f8fb;padding:24px">
            <div style="max-width:560px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
            <div style="background:#1e3a8a;padding:18px 22px;color:#fff">
                <h2 style="margin:0;font-size:18px">Unidad Educativa Tránsito Amaguaña</h2>
                <p style="margin:6px 0 0;opacity:.9">Activación de cuenta</p>
            </div>

            <div style="padding:22px">
                <p style="margin:0 0 12px">Hola 👋, tu cuenta fue creada correctamente.</p>
                <p style="margin:0 0 18px">Para activarla, haz clic en el botón:</p>

                <a href="${link}"
                style="display:inline-block;background:#1e3a8a;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:600">
                Activar cuenta
                </a>

                <p style="margin:18px 0 0;font-size:13px;color:#6b7280">
                Si no solicitaste esta cuenta, ignora este correo.
                </p>

                <p style="margin:14px 0 0;font-size:12px;color:#9ca3af">
                Enlace alternativo: <span style="word-break:break-all">${link}</span>
                </p>
            </div>

            <div style="padding:14px 22px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280">
                Este mensaje fue enviado automáticamente. No responder.
            </div>
            </div>
        </div>
        `,
    });
    };

    export const sendMailToRecoveryPassword = async (userMail, token) => {
    const link = `${FRONTEND}/recuperar-password/${token}`;

    await transporter.sendMail({
        from: FROM,
        to: userMail,
        subject: "Restablecer contraseña – UEIB Tránsito Amaguaña 🔐",
        html: `
        <div style="font-family:Inter,Arial,sans-serif;background:#f6f8fb;padding:24px">
            <div style="max-width:560px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
            <div style="background:#dc2626;padding:18px 22px;color:#fff">
                <h2 style="margin:0;font-size:18px">Restablecer contraseña</h2>
                <p style="margin:6px 0 0;opacity:.9">Solicitud de cambio</p>
            </div>

            <div style="padding:22px">
                <p style="margin:0 0 12px">Recibimos una solicitud para cambiar tu contraseña.</p>
                <p style="margin:0 0 18px">Crea una nueva contraseña aquí:</p>

                <a href="${link}"
                style="display:inline-block;background:#dc2626;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:600">
                Crear nueva contraseña
                </a>

                <p style="margin:18px 0 0;font-size:13px;color:#6b7280">
                Si no solicitaste esto, ignora este correo.
                </p>

                <p style="margin:14px 0 0;font-size:12px;color:#9ca3af">
                Enlace alternativo: <span style="word-break:break-all">${link}</span>
                </p>
            </div>

            <div style="padding:14px 22px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280">
                Por seguridad, este enlace es personal.
            </div>
            </div>
        </div>
        `,
    });
    };

    export const sendMailToOwner = async (userMail, password) => {
    const link = `${FRONTEND}/login`;

    await transporter.sendMail({
        from: FROM,
        to: userMail,
        subject: "Credenciales de acceso – Sistema Académico 🎓",
        html: `
        <div style="font-family:Inter,Arial,sans-serif;background:#f6f8fb;padding:24px">
            <div style="max-width:560px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
            <div style="background:#1e3a8a;padding:18px 22px;color:#fff">
                <h2 style="margin:0;font-size:18px">Sistema Académico</h2>
                <p style="margin:6px 0 0;opacity:.9">Credenciales de acceso</p>
            </div>

            <div style="padding:22px">
                <p style="margin:0 0 12px">Tu cuenta ha sido creada exitosamente.</p>

                <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:14px">
                <p style="margin:0 0 8px"><b>Usuario:</b> ${userMail}</p>
                <p style="margin:0"><b>Contraseña:</b> ${password}</p>
                </div>

                <a href="${link}"
                style="display:inline-block;margin-top:16px;background:#1e3a8a;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:600">
                Iniciar sesión
                </a>

                <p style="margin:18px 0 0;font-size:13px;color:#6b7280">
                Por seguridad, cambia tu contraseña después de iniciar sesión.
                </p>
            </div>

            <div style="padding:14px 22px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280">
                No responder este correo.
            </div>
            </div>
        </div>
        `,
    });
};

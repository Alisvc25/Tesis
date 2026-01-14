import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

console.log("Resend key", process.env.RESEND_API_KEY);
console.log("Frontend URL", process.env.FRONTEND_URL);

const resend = new Resend(process.env.RESEND_API_KEY);
const FRONTEND = process.env.FRONTEND_URL;

const baseEmail = ({ title, subtitle, badgeText, accentColor, buttonText, buttonLink, bodyHtml, footerNote }) => `
    <div style="margin:0; padding:0; background:#f3f6fb;">
        <div style="max-width:620px; margin:0 auto; padding:24px 14px;">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg, ${accentColor} 0%, #0b1220 100%); border-radius:18px; padding:18px 18px; color:#fff; box-shadow:0 8px 24px rgba(0,0,0,.12);">
            <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:46px; height:46px; border-radius:14px; background:rgba(255,255,255,.16); display:flex; align-items:center; justify-content:center; font-size:22px;">
                🎓
            </div>
            <div style="line-height:1.2;">
                <div style="font-size:18px; font-weight:800; letter-spacing:.2px;">UEIB Tránsito Amaguaña</div>
                <div style="font-size:13px; opacity:.9;">Sistema Académico • Comunicación oficial</div>
            </div>
            </div>

            <div style="margin-top:14px;">
            <span style="display:inline-block; font-size:12px; font-weight:700; padding:6px 10px; border-radius:999px; background:rgba(255,255,255,.16);">
                ${badgeText}
            </span>
            </div>

            <h1 style="margin:12px 0 4px; font-size:24px; line-height:1.25; font-weight:900;">
            ${title}
            </h1>
            <p style="margin:0; font-size:14px; opacity:.92;">
            ${subtitle}
            </p>
        </div>

        <!-- Card -->
        <div style="background:#ffffff; border-radius:18px; padding:18px; margin-top:14px; box-shadow:0 10px 26px rgba(15,23,42,.08); border:1px solid #e8eefc;">
            
            ${bodyHtml}

            <div style="margin-top:18px; text-align:center;">
            <a href="${buttonLink}"
                style="display:inline-block; background:${accentColor}; color:#fff; font-weight:800; font-size:15px; padding:14px 18px; text-decoration:none; border-radius:12px; box-shadow:0 10px 18px rgba(2,6,23,.16);">
                ${buttonText} ✅
            </a>
            <div style="margin-top:10px; font-size:12.5px; color:#64748b;">
                Si no solicitaste este correo, puedes ignorarlo con tranquilidad.
            </div>
            </div>

            <div style="margin-top:18px; padding:14px; border-radius:14px; background:#f8fafc; border:1px dashed #dbeafe;">
            <div style="font-size:13.5px; color:#0f172a; font-weight:800; margin-bottom:6px;">💡 Consejo rápido</div>
            <div style="font-size:13px; color:#334155; line-height:1.6;">
                ${footerNote}
            </div>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align:center; margin-top:14px; color:#64748b; font-size:12px; line-height:1.6;">
            <div>Este mensaje fue enviado automáticamente. Por favor, no respondas a este correo.</div>
            <div style="margin-top:4px; opacity:.9;">© ${new Date().getFullYear()} UEIB Tránsito Amaguaña</div>
        </div>
        </div>
    </div>
`;

const sendMailToRegister = async (userMail, token) => {
    const link = `${FRONTEND}/confirm/${token}`;

    await resend.emails.send({
        from: "UEIB Tránsito Amaguaña <onboarding@resend.dev>",
        to: userMail,
        subject: "Activación de cuenta – UEIB Tránsito Amaguaña 🎓",
        html: baseEmail({
            title: "¡Bienvenida/o al Sistema Académico! 🎉",
            subtitle: "Tu cuenta ya está casi lista. Solo falta activarla para comenzar.",
            badgeText: "Activación de cuenta",
            accentColor: "#1e3a8a",
            buttonText: "Activar mi cuenta",
            buttonLink: link,
            bodyHtml: `
            <div style="font-size:14.5px; color:#0f172a; line-height:1.75;">
            <p style="margin:0 0 10px;">
                Hola 👋, nos alegra tenerte en la <b>Unidad Educativa Intercultural Bilingüe “Tránsito Amaguaña”</b>.
            </p>
            <p style="margin:0 0 10px;">
                Desde aquí podrás acceder a información académica, procesos institucionales y herramientas educativas.
            </p>

            <div style="margin:14px 0; padding:14px; border-radius:14px; background:#eff6ff; border:1px solid #dbeafe;">
                <div style="font-weight:900; color:#1e3a8a; margin-bottom:6px;">📌 Importante</div>
                <div style="color:#0f172a;">
                Para activar tu cuenta, presiona el botón de abajo. Esto confirma que el correo te pertenece.
                </div>
            </div>
            </div>
        `,
            footerNote:
                "Guarda este correo por si necesitas volver a activar tu cuenta. Si tu enlace expirara por seguridad, solicita uno nuevo desde el sistema."
        })
    });
};

const sendMailToRecoveryPassword = async (userMail, token) => {
    const link = `${FRONTEND}/recuperar-password/${token}`;

    await resend.emails.send({
        from: "UEIB Tránsito Amaguaña <onboarding@resend.dev>",
        to: userMail,
        subject: "Restablecer contraseña – UEIB Tránsito Amaguaña 🔐",
        html: baseEmail({
            title: "Restablecimiento de contraseña 🔐",
            subtitle: "Recibimos una solicitud para crear una nueva contraseña de tu cuenta.",
            badgeText: "Seguridad de cuenta",
            accentColor: "#2563eb", 
            buttonText: "Crear nueva contraseña",
            buttonLink: link,
            bodyHtml: `
            <div style="font-size:14.5px; color:#0f172a; line-height:1.75;">
            <p style="margin:0 0 10px;">
                Hola 👋, si solicitaste cambiar tu contraseña, puedes hacerlo de forma segura aquí.
            </p>

            <div style="margin:14px 0; padding:14px; border-radius:14px; background:#eef2ff; border:1px solid #c7d2fe;">
                <div style="font-weight:900; color:#1d4ed8; margin-bottom:6px;">🛡️ Seguridad</div>
                <div style="color:#0f172a;">
                Este enlace es personal y expira por seguridad. Si no fuiste tú, ignora este correo.
                </div>
            </div>

            <p style="margin:0;">
                Te recomendamos usar una contraseña con letras, números y un símbolo (por ejemplo: <b>!</b> o <b>#</b>).
            </p>
            </div>
        `,
            footerNote:
                "Después de cambiar tu contraseña, intenta no compartirla. Si sospechas actividad extraña, cambia tu contraseña nuevamente y avisa a la institución."
        })
    });
};

const sendMailToOwner = async (userMail, password) => {
    const link = `${FRONTEND}/login`;

    await resend.emails.send({
        from: "UEIB Tránsito Amaguaña <onboarding@resend.dev>",
        to: userMail,
        subject: "Credenciales de acceso – Sistema Académico 🎓",
        html: baseEmail({
            title: "Tus credenciales de acceso ✅",
            subtitle: "Ya puedes ingresar al Sistema Académico con los datos asignados.",
            badgeText: "Acceso al sistema",
            accentColor: "#0f766e",
            buttonText: "Iniciar sesión",
            buttonLink: link,
            bodyHtml: `
            <div style="font-size:14.5px; color:#0f172a; line-height:1.75;">
            <p style="margin:0 0 12px;">
                Hola 👋, tu cuenta fue creada exitosamente. Aquí están tus credenciales:
            </p>

            <div style="margin:14px 0; padding:14px; border-radius:14px; background:#ecfeff; border:1px solid #a5f3fc;">
                <div style="display:flex; gap:10px; align-items:flex-start;">
                <div style="font-size:18px;">📚</div>
                <div style="flex:1;">
                    <div style="font-weight:900; color:#0f766e; margin-bottom:6px;">Datos de acceso</div>
                    <div style="font-size:14px; color:#0f172a;">
                    <div style="margin-bottom:6px;"><b>Usuario:</b> ${userMail}</div>
                    <div><b>Contraseña:</b> ${password}</div>
                    </div>
                </div>
                </div>
            </div>

            <div style="margin-top:10px; padding:12px; border-radius:14px; background:#f8fafc; border:1px solid #e2e8f0;">
                <div style="font-weight:900; margin-bottom:6px;">✅ Recomendación</div>
                <div style="color:#334155; font-size:13.5px;">
                Por seguridad, cambia tu contraseña después del primer ingreso.
                </div>
            </div>
            </div>
        `,
            footerNote:
                "Si eres administrador/a, procura crear contraseñas únicas para cada usuario y mantener la información protegida."
        })
    });
};

export {
    sendMailToRegister,
    sendMailToRecoveryPassword,
    sendMailToOwner
};

jest.mock('../../src/config/nodemailler.js', () => ({
    sendMailToRegister: jest.fn(() => Promise.resolve(true)),
    sendMailToOwner: jest.fn(() => Promise.resolve(true)),
    sendMailToRecoveryPassword: jest.fn(() => Promise.resolve(true)),
}));
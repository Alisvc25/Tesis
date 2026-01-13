/*
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// TRANSPORTER CONFIGURADO PARA MAILTRAP
const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendMailToRegister = async (userMail, token) => {
    let info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: userMail,
        subject: "Unidad Educativa Tránsito Amaguaña 🎓 - Registro de cuenta",
        html: `
            <h2>¡Registro exitoso! 🎓</h2>
            <p>Su cuenta ha sido creada correctamente por la administración de la Unidad Educativa Intercultural Bilingüe “Tránsito Amaguaña”.</p>
            <p>Haga clic en el siguiente enlace para activar su cuenta e iniciar sesión:</p>
            <a href="${process.env.FRONTEND_URL}confirm/${token}">Activar cuenta</a>
            <hr>
            <footer>Este mensaje fue generado automáticamente. No responda a este correo.</footer>
        `
    });

    console.log("Correo enviado (registro):", info.messageId);
};

const sendMailToRecoveryPassword = async (userMail, token) => {
    let info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: userMail,
        subject: "Restablecer contraseña - Unidad Educativa Tránsito Amaguaña 🎓",
        html: `
            <h2>Restablecimiento de contraseña</h2>
            <p>Haga clic en el siguiente enlace para crear una nueva contraseña:</p>
            <a href="${process.env.FRONTEND_URL}reset/${token}">Restablecer contraseña</a>
            <hr>
            <footer>Este mensaje fue generado automáticamente. No responda a este correo.</footer>
        `
    });

    console.log("Correo enviado (recuperación):", info.messageId);
};

const sendMailToOwner = async (userMail, password) => {
    let info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: userMail,
        subject: "Credenciales de acceso - Unidad Educativa Tránsito Amaguaña 🎓",
        html: `
            <h1>Bienvenido/a al Sistema Académico</h1>
            <p>Su cuenta ha sido creada por la dirección de la institución.</p>
            <p><b>Usuario:</b> ${userMail}</p>
            <p><b>Contraseña definitiva:</b> ${password}</p>
            <p>Puede iniciar sesión usando el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}login">Iniciar sesión</a>
            <hr>
            <footer>Unidad Educativa Intercultural Bilingüe “Tránsito Amaguaña”</footer>
        `
    });

    console.log("Correo enviado (credenciales):", info.messageId);
};


export {
    sendMailToRegister,
    sendMailToRecoveryPassword,
    sendMailToOwner
};
*/
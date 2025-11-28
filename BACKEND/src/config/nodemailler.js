import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    },
});

//Correo para el registro de cuentas
const sendMailToRegister = (userMail, token) => {
    let mailOptions = {
        from: process.env.USER_MAILTRAP,
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
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        else console.log("Mensaje enviado:", info.messageId);
    });
};

//Correo para recuperar la contraseña
const sendMailToRecoveryPassword = async (userMail, token) => {
    let info = await transporter.sendMail({
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "Restablecer contraseña - Unidad Educativa Tránsito Amaguaña 🎓",
        html: `

        <h2>Restablecimiento de contraseña </h2>
        <p>Haga clic en el siguiente enlace para crear una nueva contraseña:</p>
        <a href=${process.env.FRONTEND_URL}reset/${token}>Restablecer contraseña</a>
        <hr>
        <footer>Este mensaje fue generado automáticamente. No responda a este correo.</footer>
    `
    });
    console.log("Correo de recuperación enviado:", info.messageId);
};

//Correo de credenciales (Administrador crea cuenta)
const sendMailToOwner = async (userMail, password) => {
    let info = await transporter.sendMail({
        from: process.env.FRONTEND_URL,
        to: userMail,
        subject: "Unidad Educativa Intercultural Bilingüe Tránsito Amaguaña 🎓 - Sistema de Registro",
        html: `
            <h1>Bienvenido/a al Sistema Académico</h1>
            <p>Tu cuenta ha sido creada por la dirección de la institución.</p>
            <p><b>Usuario:</b> ${userMail}</p>
            <p><b>Contraseña temporal:</b> ${password}</p>
            <a href="${process.env.FRONTEND_URL}login">Iniciar sesión</a>
            <hr>
            <footer>Unidad Educativa Intercultural Bilingüe “Tránsito Amaguaña”</footer>
        `
    });
    console.log("Correo de bienvenida enviado:", info.messageId);
};

export {
    sendMailToRegister,
    sendMailToRecoveryPassword,
    sendMailToOwner
};

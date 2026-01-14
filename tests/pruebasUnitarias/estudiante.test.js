import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../src/server.js";

import Estudiante from "../../src/models/Estudiante.js";

describe("ESTUDIANTE (BDD real)", () => {
    test("1) POST /apiE/login devuelve token", async () => {
        const passHash = await bcrypt.hash("123456", 10);

        await Estudiante.create({
            nombre: "Est",
            apellido: "Login",
            cedula: "5555555555",
            fechaNacimiento: "2004-01-01",
            curso: "3ro BGU",
            email: "est@login.com",
            password: passHash,
            confirmEmail: true,
        });

        const res = await request(app)
            .post("/apiE/login")
            .send({ email: "est@login.com", password: "123456" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

    test("2) POST /apiE/login con password incorrecta falla", async () => {
        const passHash = await bcrypt.hash("123456", 10);

        await Estudiante.create({
            nombre: "Est",
            apellido: "Fail",
            cedula: "6666666666",
            fechaNacimiento: "2004-01-01",
            curso: "2do BGU",
            email: "est@fail.com",
            password: passHash,
            confirmEmail: true,
        });

        const res = await request(app)
            .post("/apiE/login")
            .send({ email: "est@fail.com", password: "MAL" });

        expect([400, 401]).toContain(res.statusCode);
    });

    test("3) GET /apiE/perfil requiere token (debe ser 401 si no envío)", async () => {
        const res = await request(app).get("/apiE/perfil");
        expect(res.statusCode).toBe(401);
    });

    test("4) GET /apiE/calificaciones/:id requiere token (debe ser 401 si no envío)", async () => {
        const res = await request(app).get("/apiE/calificaciones/123");
        expect(res.statusCode).toBe(401);
    });
});

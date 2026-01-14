import request from "supertest";
import app from "../../src/server.js";

import Estudiante from "../../src/models/Estudiante.js";

describe("ESTUDIANTE (BDD)", () => {
    test("1) POST /apiE/login devuelve token", async () => {
        await Estudiante.create({
            nombre: "Est",
            apellido: "Login",
            cedula: "5555555555",
            fechaNacimiento: "2004-01-01",
            curso: "3ro BGU",
            email: "est@login.com",
            password: "123456",
            confirmEmail: true,
        });

        const res = await request(app)
            .post("/apiE/login")
            .send({ email: "est@login.com", password: "123456" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

    test("2) GET /apiE/perfil devuelve perfil (requiere token)", async () => {
        await Estudiante.create({
            nombre: "Est",
            apellido: "Perfil",
            cedula: "6666666666",
            fechaNacimiento: "2004-01-01",
            curso: "2do BGU",
            email: "est@perfil.com",
            password: "123456",
            confirmEmail: true,
        });

        const login = await request(app)
            .post("/apiE/login")
            .send({ email: "est@perfil.com", password: "123456" });

        const token = login.body.token;

        const res = await request(app)
            .get("/apiE/perfil")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });

    test("3) GET /apiE/calificaciones/:id devuelve calificaciones (requiere token)", async () => {
        const est = await Estudiante.create({
            nombre: "Est",
            apellido: "Notas",
            cedula: "7777777777",
            fechaNacimiento: "2004-01-01",
            curso: "1ro BGU",
            email: "est@notas.com",
            password: "123456",
            confirmEmail: true,
        });

        const login = await request(app)
            .post("/apiE/login")
            .send({ email: "est@notas.com", password: "123456" });

        const token = login.body.token;

        const res = await request(app)
            .get(`/apiE/calificaciones/${est._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });

    test("4) Login con credenciales incorrectas debe fallar", async () => {
        await Estudiante.create({
            nombre: "Est",
            apellido: "Fail",
            cedula: "8888888888",
            fechaNacimiento: "2004-01-01",
            curso: "3ro BGU",
            email: "est@fail.com",
            password: "123456",
            confirmEmail: true,
        });

        const res = await request(app)
            .post("/apiE/login")
            .send({ email: "est@fail.com", password: "MAL" });

        expect([400, 401]).toContain(res.statusCode);
    });
});

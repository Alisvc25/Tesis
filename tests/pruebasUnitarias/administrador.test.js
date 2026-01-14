import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../src/server.js";

import Administrador from "../../src/models/Administrador.js";

describe("ADMINISTRADOR (BDD real)", () => {
    test("1) POST /administrador/registro crea administrador", async () => {
        const res = await request(app)
            .post("/administrador/registro")
            .send({
                nombre: "Alisson",
                apellido: "Test",
                email: "admin@test.com",
                password: "123456",
            });

        expect([200, 201]).toContain(res.statusCode);

        const adminBD = await Administrador.findOne({ email: "admin@test.com" });
        expect(adminBD).not.toBeNull();
    });

    test("2) GET /administrador/confirmar/:token confirma email", async () => {
        const passHash = await bcrypt.hash("123456", 10);

        const admin = await Administrador.create({
            nombre: "Admin",
            apellido: "Confirm",
            email: "confirm@test.com",
            password: passHash,
            token: "TOKEN_TEST_123",
            confirmEmail: false,
        });

        const res = await request(app).get(`/administrador/confirmar/${admin.token}`);
        expect([200, 201]).toContain(res.statusCode);

        const actualizado = await Administrador.findById(admin._id);
        expect(actualizado.confirmEmail).toBe(true);
    });

    test("3) POST /administrador/login devuelve token (password hasheada)", async () => {
        const passHash = await bcrypt.hash("123456", 10);

        await Administrador.create({
            nombre: "Admin",
            apellido: "Login",
            email: "login@test.com",
            password: passHash,
            confirmEmail: true,
        });

        const res = await request(app)
            .post("/administrador/login")
            .send({ email: "login@test.com", password: "123456" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

    test("4) POST /administrador/registroDocente requiere token (solo verificamos que NO sea 401 por credenciales)", async () => {
        const passHash = await bcrypt.hash("123456", 10);

        await Administrador.create({
            nombre: "Admin",
            apellido: "Auth",
            email: "auth@test.com",
            password: passHash,
            confirmEmail: true,
        });

        const login = await request(app)
            .post("/administrador/login")
            .send({ email: "auth@test.com", password: "123456" });

        expect(login.statusCode).toBe(200);
        const token = login.body.token;
        expect(token).toBeTruthy();

        const res = await request(app)
            .post("/administrador/registroDocente")
            .set("Authorization", `Bearer ${token}`)
            .send({
                nombre: "Doc",
                apellido: "Test",
                cedula: "0102030405",
                email: "docente@test.com",
                password: "123456",
                materias: ["Matemáticas"],
            });

        expect(res.statusCode).not.toBe(401);
    });
});

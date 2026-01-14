import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../src/server.js";

import Docente from "../../src/models/Docente.js";

describe("DOCENTE (BDD real)", () => {
    test("1) POST /apiD/login devuelve token", async () => {
        const passHash = await bcrypt.hash("123456", 10);

        await Docente.create({
            nombre: "Doc",
            apellido: "Login",
            cedula: "1111111111",
            email: "doc@login.com",
            password: passHash,
            materias: ["Lengua"],
            confirmEmail: true,
        });

        const res = await request(app)
            .post("/apiD/login")
            .send({ email: "doc@login.com", password: "123456" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

    test("2) POST /apiD/login con password incorrecta falla", async () => {
        const passHash = await bcrypt.hash("123456", 10);

        await Docente.create({
            nombre: "Doc",
            apellido: "Fail",
            cedula: "2222222222",
            email: "doc@fail.com",
            password: passHash,
            materias: ["Ciencias"],
            confirmEmail: true,
        });

        const res = await request(app)
            .post("/apiD/login")
            .send({ email: "doc@fail.com", password: "MAL" });

        expect([400, 401]).toContain(res.statusCode);
    });

    test("3) POST /apiD/calificacion sin token debe dar 401", async () => {
        const res = await request(app)
            .post("/apiD/calificacion")
            .send({ estudianteId: "1", materia: "Lengua" });

        expect(res.statusCode).toBe(401);
    });

    test("4) POST /apiD/calificacion con token NO debe ser 401", async () => {
        const passHash = await bcrypt.hash("123456", 10);

        await Docente.create({
            nombre: "Doc",
            apellido: "Auth",
            cedula: "3333333333",
            email: "doc@auth.com",
            password: passHash,
            materias: ["Historia"],
            confirmEmail: true,
        });

        const login = await request(app)
            .post("/apiD/login")
            .send({ email: "doc@auth.com", password: "123456" });

        expect(login.statusCode).toBe(200);
        const token = login.body.token;
        expect(token).toBeTruthy();

        const res = await request(app)
            .post("/apiD/calificacion")
            .set("Authorization", `Bearer ${token}`)
            .send({
                // el controller decidirá qué campos exactos necesita
                estudianteId: "000000000000000000000000",
                materia: "Historia",
                parcial1: { deberes: 8, examenes: 9, trabajosClase: 10, proyectos: 10 },
            });

        expect(res.statusCode).not.toBe(401);
    });
});

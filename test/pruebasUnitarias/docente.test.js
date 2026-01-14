import request from "supertest";
import app from "../../src/server.js";

import Docente from "../../src/models/Docente.js";

describe("DOCENTE (BDD)", () => {
    test("1) POST /apiD/login devuelve token (si el docente existe)", async () => {
        await Docente.create({
            nombre: "Doc",
            apellido: "Login",
            cedula: "1111111111",
            email: "doc@login.com",
            password: "123456",
            materias: ["Lengua"],
            confirmEmail: true,
        });

        const res = await request(app)
            .post("/apiD/login")
            .send({ email: "doc@login.com", password: "123456" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

    test("2) GET /apiD/perfil retorna perfil (requiere token)", async () => {
        await Docente.create({
            nombre: "Doc",
            apellido: "Perfil",
            cedula: "2222222222",
            email: "doc@perfil.com",
            password: "123456",
            materias: ["Ciencias"],
            confirmEmail: true,
        });

        const login = await request(app)
            .post("/apiD/login")
            .send({ email: "doc@perfil.com", password: "123456" });

        const token = login.body.token;
        expect(token).toBeTruthy();

        const res = await request(app)
            .get("/apiD/perfil")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });

    test("3) POST /apiD/calificacion crea calificación (requiere token)", async () => {
        await Docente.create({
            nombre: "Doc",
            apellido: "Calif",
            cedula: "3333333333",
            email: "doc@calif.com",
            password: "123456",
            materias: ["Historia"],
            confirmEmail: true,
        });

        const login = await request(app)
            .post("/apiD/login")
            .send({ email: "doc@calif.com", password: "123456" });

        const token = login.body.token;

        const res = await request(app)
            .post("/apiD/calificacion")
            .set("Authorization", `Bearer ${token}`)
            .send({
                estudianteId: "000000000000000000000000",
                materia: "Historia",
                parcial1: { deberes: 8, examenes: 9, trabajosClase: 10, proyectos: 10 },
            });

        expect([200, 201]).toContain(res.statusCode);
    });

    test("4) GET /apiD/listarCalificaciones devuelve lista (requiere token)", async () => {
        await Docente.create({
            nombre: "Doc",
            apellido: "Listar",
            cedula: "4444444444",
            email: "doc@listar.com",
            password: "123456",
            materias: ["Arte"],
            confirmEmail: true,
        });

        const login = await request(app)
            .post("/apiD/login")
            .send({ email: "doc@listar.com", password: "123456" });

        const token = login.body.token;

        const res = await request(app)
            .get("/apiD/listarCalificaciones")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });
});

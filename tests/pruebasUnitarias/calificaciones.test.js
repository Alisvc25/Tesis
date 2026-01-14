import request from "supertest";
import app from "../../src/server.js";

describe("CALIFICACIONES (BDD real)", () => {
    test("1) GET /apiC/listar responde (200 esperado)", async () => {
        const res = await request(app).get("/apiC/listar");
        expect(res.statusCode).toBe(200);
    });

    test("2) GET /apiC/obtener/:id con id inválido debería fallar (400/404)", async () => {
        const res = await request(app).get("/apiC/obtener/123");
        expect([400, 404]).toContain(res.statusCode);
    });

    test("3) POST /apiC/crear con body incompleto debe fallar (400/500 según tu controller)", async () => {
        const res = await request(app).post("/apiC/crear").send({ materia: "Mate" });
        expect([400, 500]).toContain(res.statusCode);
    });

    test("4) DELETE /apiC/eliminar/:id con id inválido debería fallar (400/404)", async () => {
        const res = await request(app).delete("/apiC/eliminar/123");
        expect([400, 404]).toContain(res.statusCode);
    });
});

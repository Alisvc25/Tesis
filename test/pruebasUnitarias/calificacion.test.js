import request from "supertest";
import app from "../../src/server.js";

import Estudiante from "../../src/models/Estudiante.js";
import Docente from "../../src/models/Docente.js";
import Calificacion from "../../src/models/Calificacion.js";

describe("CALIFICACIONES (BDD)", () => {
  test("1) POST /apiC/crear crea calificación", async () => {
    const est = await Estudiante.create({
      nombre: "Est",
      apellido: "Cali",
      cedula: "9999999999",
      fechaNacimiento: "2004-01-01",
      curso: "1ro BGU",
      email: "est@cali.com",
      password: "123456",
      confirmEmail: true,
    });

    const doc = await Docente.create({
      nombre: "Doc",
      apellido: "Cali",
      cedula: "1212121212",
      email: "doc@cali.com",
      password: "123456",
      materias: ["Matemáticas"],
      confirmEmail: true,
    });

    const res = await request(app)
      .post("/apiC/crear")
      .send({
        estudiante: est._id,
        docente: doc._id,
        materia: "Matemáticas",
      });

    expect([200, 201]).toContain(res.statusCode);
  });

  test("2) GET /apiC/listar devuelve lista", async () => {
    const res = await request(app).get("/apiC/listar");
    expect(res.statusCode).toBe(200);
  });

  test("3) GET /apiC/obtener/:id devuelve una calificación", async () => {
    const est = await Estudiante.create({
      nombre: "Est",
      apellido: "Get",
      cedula: "1313131313",
      fechaNacimiento: "2004-01-01",
      curso: "2do BGU",
      email: "est@get.com",
      password: "123456",
      confirmEmail: true,
    });

    const doc = await Docente.create({
      nombre: "Doc",
      apellido: "Get",
      cedula: "1414141414",
      email: "doc@get.com",
      password: "123456",
      materias: ["Lengua"],
      confirmEmail: true,
    });

    const cali = await Calificacion.create({
      estudiante: est._id,
      docente: doc._id,
      materia: "Lengua",
    });

    const res = await request(app).get(`/apiC/obtener/${cali._id}`);
    expect(res.statusCode).toBe(200);
  });

  test("4) DELETE /apiC/eliminar/:id elimina", async () => {
    const est = await Estudiante.create({
      nombre: "Est",
      apellido: "Del",
      cedula: "1515151515",
      fechaNacimiento: "2004-01-01",
      curso: "3ro BGU",
      email: "est@del.com",
      password: "123456",
      confirmEmail: true,
    });

    const doc = await Docente.create({
      nombre: "Doc",
      apellido: "Del",
      cedula: "1616161616",
      email: "doc@del.com",
      password: "123456",
      materias: ["Ciencias"],
      confirmEmail: true,
    });

    const cali = await Calificacion.create({
      estudiante: est._id,
      docente: doc._id,
      materia: "Ciencias",
    });

    const res = await request(app).delete(`/apiC/eliminar/${cali._id}`);
    expect([200, 204]).toContain(res.statusCode);

    const enBD = await Calificacion.findById(cali._id);
    expect(enBD).toBeNull();
  });
});

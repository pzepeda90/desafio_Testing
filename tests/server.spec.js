const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {
  // 1. Testea que la ruta GET /cafes devuelve un status code 200 y el tipo de dato recibido es un arreglo con por lo menos 1 objeto
  it("GET /cafes devuelve status 200 y un arreglo con al menos 1 objeto", async () => {
    const response = await request(server).get("/cafes");
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // 2. Comprueba que se obtiene un código 404 al intentar eliminar un café con un id que no existe
  it("DELETE /cafes/:id devuelve código 404 si el id no existe", async () => {
    // Usamos un ID que probablemente no existe (999)
    const response = await request(server)
      .delete("/cafes/999")
      .set("Authorization", "token-de-prueba"); // La ruta requiere un token de autorización
    
    expect(response.statusCode).toBe(404);
  });

  // 3. Prueba que la ruta POST /cafes agrega un nuevo café y devuelve un código 201
  it("POST /cafes agrega un nuevo café y devuelve código 201", async () => {
    const nuevoCafe = {
      id: 5,
      nombre: "Latte"
    };
    
    const response = await request(server)
      .post("/cafes")
      .send(nuevoCafe);
    
    expect(response.statusCode).toBe(201);
    expect(response.body.some(cafe => cafe.id === nuevoCafe.id)).toBe(true);
  });

  // 4. Prueba que la ruta PUT /cafes devuelve un status code 400 si intentas actualizar un café enviando un id en los parámetros que sea diferente al id dentro del payload
  it("PUT /cafes/:id devuelve status 400 si el id del parámetro es diferente al del payload", async () => {
    // ID en la URL
    const idUrl = 1;
    // ID diferente en el payload
    const cafeActualizado = {
      id: 2,
      nombre: "Cortado Modificado"
    };
    
    const response = await request(server)
      .put(`/cafes/${idUrl}`)
      .send(cafeActualizado);
    
    expect(response.statusCode).toBe(400);
  });
});

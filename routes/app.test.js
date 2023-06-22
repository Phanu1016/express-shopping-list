process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

const popsicle = { name: "popsicle", price: 1.45 };
const cheerios = { name: "cheerios", price: 3.4 };

beforeEach(() => {
    items.push(popsicle);
    items.push(cheerios);
});

afterEach(() => {
    items.length = 0;
});

describe("GET /items", () => {
    test("Gets all items -> (list)", async () => {
        const response = await request(app).get("/items");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([popsicle, cheerios]);
    });
});

describe("POST /items", () => {
    test("Adds an item -> (object)", async () => {
        const response = await request(app)
            .post("/items")
            .send({ name: "oreo", price: 3.5 });
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({ name: "oreo", price: 3.5 });
    });

    test("Mising a name", async () => {
        const response = await request(app).post("/items");
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            error: {
                message: "Name not found",
                status: 404,
            },
        });
    });

    test("Mising a price", async () => {
        const response = await request(app).post("/items").send({name: "oreo"});
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            error: {
                message: "Price not found",
                status: 404,
            },
        });
    });
    
});

describe("GET /items/:name", () => {
    test("Gets an item -> (object)", async () => {
        const response = await request(app).get("/items/popsicle");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(popsicle);
    });

    test("Item not found", async () => {
        const response = await request(app).get("/items/asdasdad");
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            error: {
                message: "Item not found",
                status: 404,
            },
        });
    });
});

describe("PATCH /items/:name", () => {
    test("Updates an item -> (object)", async () => {
        const response = await request(app).patch("/items/popsicle").send({ name: "new popsicle", price: 10.50 });
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ name: "new popsicle", price: 10.50 });
    });

    
    test("Item not found", async () => {
        const response = await request(app).get("/items/asdasdad").send({ name: "new popsicle", price: 10.50 });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            error: {
                message: "Item not found",
                status: 404,
            },
        });
    });

    test("Mising a name", async () => {
        const response = await request(app).patch("/items/asdasdad");
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            error: {
                message: "Name not found",
                status: 404,
            },
        });
    });


    test("Mising a price", async () => {
        const response = await request(app).patch("/items/asdasdad").send({name: "new popsicle"});
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            error: {
                message: "Price not found",
                status: 404,
            },
        });
    });


});

describe("DELETE /items/:name", () => {
    test("Delete an item -> (object)", async () => {
        const response = await request(app).delete("/items/cheerios");
        console.log(popsicle)
        // expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Deleted" });
    });

    test("Item not found", async () => {
        const response = await request(app).delete("/items/asdasdad");
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            error: {
                message: "Item not found",
                status: 404,
            },
        });
    });
});

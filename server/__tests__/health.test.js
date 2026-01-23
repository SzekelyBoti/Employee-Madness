require("../jest.setup");
const request = require("supertest");
const { app } = require("../server");

describe("Server health", () => {
    it("health endpoint works", async () => {
        const res = await request(app).get("/health");
        expect(res.statusCode).toBe(200);
    });

    it("should respond with Prometheus metrics", async () => {
        const res = await request(app).get("/metrics").expect(200);
        expect(res.headers["content-type"]).toContain("text/plain");
    });
});
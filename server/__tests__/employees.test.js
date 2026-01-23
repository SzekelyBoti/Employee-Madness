const mongoose = require("mongoose");
const request = require("supertest");
const { app } = require("../server");
require("../jest.setup");
const Employee = require("../db/employee.model");
const FavoriteBrand = require("../db/favoriteBrands.model");
const WorkingGroup = require("../db/workingGroup.model");

describe("Employees API", () => {
    let brand;

    beforeAll(async () => {
        brand = await FavoriteBrand.create({ name: "Acer" });
    });

    it("should create and fetch an employee", async () => {
        const createRes = await request(app)
            .post("/api/employees")
            .send({
                name: "Test User",
                level: 2,
                position: "Protagonist",
                favoriteBrand: brand._id,
                present: true,
            })
            .expect(200);

        const employeeId = createRes.body._id;

        const getRes = await request(app)
            .get(`/api/employee/${employeeId}`)
            .expect(200);

        expect(getRes.body.name).toBe("Test User");
        expect(getRes.body.favoriteBrand.name).toBe("Acer");
    });

    it("should get all employees", async () => {
        await Employee.create({
            name: "Another User",
            level: 1,
            position: "Antagonist",
            favoriteBrand: brand._id,
            present: true,
        });

        const res = await request(app).get("/api/employees").expect(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it("should update an employee", async () => {
        const employee = await Employee.create({
            name: "Update User",
            level: 1,
            position: "Superhero",
            favoriteBrand: brand._id,
            present: true,
        });

        const res = await request(app)
            .patch(`/api/employees/${employee._id}`)
            .send({ level: 3 })
            .expect(200);

        expect(res.body.level).toBe("3");
    });

    it("should delete an employee", async () => {
        const employee = await Employee.create({
            name: "Delete User",
            level: 1,
            position: "Joker",
            favoriteBrand: brand._id,
            present: true,
        });

        await request(app).delete(`/api/employees/${employee._id}`).expect(200);
        const exists = await Employee.findById(employee._id);
        expect(exists).toBeNull();
    });
});

describe("Server edge cases & metrics", () => {

    it("should return null for non-existing employee ID", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/api/employee/${fakeId}`).expect(200);
        expect(res.body).toBeNull();
    });

    it("should handle PATCH with empty workingGroup", async () => {
        const brand = await FavoriteBrand.create({ name: "Razer" });
        const employee = await Employee.create({
            name: "Edge Case User",
            level: 1,
            position: "Main Actor",
            favoriteBrand: brand._id,
            present: true,
        });

        const res = await request(app)
            .patch(`/api/employees/${employee._id}`)
            .send({ workingGroup: "" })
            .expect(200);

        expect(res.body.workingGroup).toBeNull();
    });

    it("should handle PATCH with invalid ID", async () => {
        const res = await request(app)
            .patch("/api/employees/invalidId")
            .send({ level: 2 })
            .expect(400);

        expect(res.body.error).toBeDefined();
    });

    it("should handle DELETE with non-existing ID", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .delete(`/api/employees/${fakeId}`)
            .expect(200);
        expect(res.body).toBeNull();
    });

    it("should trigger error handling middleware", async () => {
        app.get("/error-test", (req, res, next) => next(new Error("Test error")));
        const res = await request(app).get("/error-test").expect(500);
        expect(res.body.error).toBe("Test error");
    });

    it("should get missing employees", async () => {
        const brand = await FavoriteBrand.create({ name: "BrandX" });
        const employee = await Employee.create({
            name: "Coverage User",
            level: 1,
            position: "Tester",
            favoriteBrand: brand._id,
            present: false,
        });

        const res = await request(app).get("/api/missing-employees").expect(200);
        expect(res.body.some(e => e._id === employee._id.toString())).toBe(true);
    });

    it("should get all favorite brands", async () => {
        await FavoriteBrand.create({ name: "BrandY" });

        const res = await request(app).get("/api/favoriteBrands").expect(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it("should get all working groups with populated employees", async () => {
        const brand = await FavoriteBrand.create({ name: "BrandZ" });
        const employee = await Employee.create({
            name: "WG Employee",
            level: 1,
            position: "Tester",
            favoriteBrand: brand._id,
            present: true,
        });

        const group = await WorkingGroup.create({
            name: "Team Alpha",
            employees: [employee._id],
        });

        const res = await request(app).get("/api/workingGroups").expect(200);
        expect(res.body.some(g => g._id === group._id.toString())).toBe(true);
        expect(res.body.find(g => g._id === group._id.toString()).employees.length).toBeGreaterThan(0);
    });

    it("should get a single working group by ID", async () => {
        const brand = await FavoriteBrand.create({ name: "BrandWG" });
        const employee = await Employee.create({
            name: "Single WG Employee",
            level: 1,
            position: "Tester",
            favoriteBrand: brand._id,
            present: true,
        });

        const group = await WorkingGroup.create({
            name: "Team Beta",
            employees: [employee._id],
        });

        const res = await request(app).get(`/api/workingGroup/${group._id}`).expect(200);
        expect(res.body._id).toBe(group._id.toString());
        expect(res.body.employees.length).toBeGreaterThan(0);
    });
});




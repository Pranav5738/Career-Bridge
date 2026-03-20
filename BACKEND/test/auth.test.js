import request from "supertest";
import app from "../src/app.js";

describe("Auth API", () => {
    it("should reject invalid login payload", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message");
    });
});
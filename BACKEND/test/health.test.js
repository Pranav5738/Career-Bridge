import request from "supertest";
import app from "../src/app.js";

describe("Health API", () => {
	it("should return service status", async () => {
		const res = await request(app).get("/");

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: "Carrier Bridge API running" });
	});
});

import request from "supertest";
import app from "../src/app.js";

describe("Resume API", () => {
	it("should handle resume route request", async () => {
		const res = await request(app).get("/api/resume");

		expect(res.statusCode).not.toBe(500);
	});
});

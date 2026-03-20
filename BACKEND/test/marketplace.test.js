import request from "supertest";
import app from "../src/app.js";

describe("Marketplace API", () => {
	it("should handle marketplace route request", async () => {
		const res = await request(app).get("/api/marketplace");

		expect(res.statusCode).not.toBe(500);
	});
});

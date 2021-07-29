import { Router, Request } from "itty-router";
import { Countries, CountriesCount } from "./handlers/countries";
import { Dates, Flights } from "./handlers/flight";

const router = Router();

router
	.get("/api/flights/:date", Flights)
	.get("/api/dates", Dates)
	.get("/api/countries", Countries)
	.get("/api/countries/:date", CountriesCount)
	.get(
		"*",
		() =>
			new Response("Not found", {
				status: 404,
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
			})
	);

export const handleRequest = (request: Request): Response => {
	return router.handle(request);
};

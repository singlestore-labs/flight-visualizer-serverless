import { Request } from "itty-router";
import { getFlightsForDate, getLoadDates } from "../data/flights_store";

export const Flights = async (request: Request): Promise<Response> => {
	let load_date;
	if (request.params) {
		load_date = request.params.date;
	}
	if (!load_date) {
		return new Response("Not found", { status: 404 });
	}

	const date = new Date(decodeURI(load_date));
	if (isNaN(date.getTime())) {
		return new Response("Not found", { status: 404 });
	}

	const body = JSON.stringify(await getFlightsForDate(date));
	const headers = {
		"Access-Control-Allow-Origin": "*",
		"Content-type": "application/json",
	};
	return new Response(body, { headers });
};

export const Dates = async (): Promise<Response> => {
	const body = JSON.stringify(await getLoadDates());
	const headers = {
		"Access-Control-Allow-Origin": "*",
		"Content-type": "application/json",
	};
	return new Response(body, { headers });
};

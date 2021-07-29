import { Request } from "itty-router";
import { getAll, getFlightCounts } from "../data/countries_store";

export const Countries = async (): Promise<Response> => {
	const countries = await getAll();
	console.log(countries);
	const body = JSON.stringify(countries);
	console.log(body);
	const headers = {
		"Access-Control-Allow-Origin": "*",
		"Content-type": "application/json",
	};

	const response = new Response(body, { headers });
	console.log(response);

	return response;
};

export const CountriesCount = async (request: Request): Promise<Response> => {
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

	const body = JSON.stringify(await getFlightCounts(date));
	const headers = {
		"Access-Control-Allow-Origin": "*",
		"Content-type": "application/json",
	};
	return new Response(body, { headers });
};

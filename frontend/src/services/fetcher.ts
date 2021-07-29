import axios, { Method } from "axios";
import { FetchError, Response } from "../types/response";

const API_BASE_URL = "https://singlestore-planes-app-api.lcustodio.workers.dev";
// const API_BASE_URL = 'https://singlestore-planes-app-api.davidgomes.workers.dev';

export default async function fetcher<TResult>(
	method: Method,
	url: string,
	data?: unknown
): Promise<Response<TResult>> {
	const res = await axios({
		method,
		url: `${API_BASE_URL}${url}`,
		data,
		validateStatus: () => true, // don't throw on non-200
	});

	const result = {
		ok: res.status >= 200 && res.status < 400,
		status: res.status,
		headers: res.headers,
		data: res.data ? (res.data as TResult) : undefined,
	} as Response<TResult>;

	if (!result.ok) {
		const ex = new Error(`Error from ${method} to ${url}`) as FetchError<
			TResult
		>;
		ex.response = result;
		ex.url = url;
		throw ex;
	}

	return result;
}

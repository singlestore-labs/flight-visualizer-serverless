import { Flight } from "../types/flight";
import { query } from "@singlestore/http-sdk";

declare let CLUSTER_USERNAME: string;
declare let CLUSTER_PASSWORD: string;
declare let CLUSTER_HOST: string;

export async function getLoadDates(): Promise<string[]> {
	const sql = `
		select distinct 
			(load_date) 
		from 
			flights 
		group by 
			load_date 
		order by 
			load_date desc 
		limit 20`;
	const database = "maps";

	const response = await query<{ load_date: string }>({
		host: CLUSTER_HOST,
		username: CLUSTER_USERNAME,
		password: CLUSTER_PASSWORD,
		sql,
		database,
	});

	const dates = response.results[0].rows.map((date) => date.load_date);

	return dates;
}

export async function getFlightsForDate(date: Date): Promise<Flight[]> {
	const sql = `
        select 
            f.load_date, f.ica024, f.callsign, f.origin_country, 
            f.time_position, f.last_contact, f.longitude, f.latitude, 
            f.baro_altitude, f.on_ground, f.velocity, f.true_track, 
            f.vertical_rate, f.altitude, f.squawk, f.spi, f.position_source, 
            c.name as current_country 
        from 
            flights f 
            left outer join 
            countries c 
            on GEOGRAPHY_CONTAINS(c.boundary, f.position) 
        where 
            f.load_date = ? 
        order by 
            callsign`;
	const database = "maps";
	const args = [date];

	const response = await query<Flight>({
		host: CLUSTER_HOST,
		username: CLUSTER_USERNAME,
		password: CLUSTER_PASSWORD,
		sql,
		args,
		database,
	});
	const flights = response.results[0].rows;

	return flights;
}

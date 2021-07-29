import { Country } from "../types/country";
import { CountryCount } from "../types/country_count";
import { query } from "@singlestore/http-sdk";

declare let CLUSTER_USERNAME: string;
declare let CLUSTER_PASSWORD: string;
declare let CLUSTER_HOST: string;

export async function getAll(): Promise<Country[]> {
	const sql = `
        select distinct 
            name 
        from 
            countries 
        group by 
            name 
        order by 
            name`;
	const database = "maps";

	const response = await query<Country>({
		host: CLUSTER_HOST,
		username: CLUSTER_USERNAME,
		password: CLUSTER_PASSWORD,
		sql,
		database,
	});
	const countries = response.results[0].rows;

	console.log(countries);
	return countries;
}

export async function getFlightCounts(date: Date): Promise<CountryCount[]> {
	const sql = `
        with flightcountries as (
            select 
                c.name
            from 
                flights f
                inner join 
                countries c 
                on GEOGRAPHY_CONTAINS(c.boundary, f.position)
            where f.load_date = ?
        ), 
        flightcounts as (
            select distinct
                (name), sum(1) as count
            from 
                flightcountries
            group by 
                name
        ), 
        countrynames as (
            select distinct 
                c.name
            from 
                countries c
            group by 
                c.name
        )
        select 
            c.name, coalesce(f.count, 0) as count
        from 
            countrynames c
            left outer join 
            flightcounts f 
            on c.name = f.name
        order by 
            c.name;`;
	const database = "maps";
	const args = [date];

	const response = await query<CountryCount>({
		host: CLUSTER_HOST,
		username: CLUSTER_USERNAME,
		password: CLUSTER_PASSWORD,
		sql,
		args,
		database,
	});
	const countriesCount = response.results[0].rows;

	return countriesCount;
}

import { ActionContext, createStore } from "vuex";
import fetcher from "../services/fetcher";
import pruneToSize from "../services/prune-to-size";
import { Country } from "../types/country";
import { CountryCount } from "../types/country-count";
import { Flight } from "../types/flight";
import { DateInfo, StoreState } from "../types/store";
import { Marker } from "../types/marker";

const defaultState: StoreState = {
	datePicked: "latest",
	dates: [],
	flightDates: {},
	countries: [],
	countryDates: {},
	selectedFlight: undefined,
};

export default createStore({
	state: defaultState,

	actions: {
		async datesLoad(
			context: ActionContext<StoreState, StoreState>
		): Promise<DateInfo[]> {
			const res = await fetcher<string[]>("GET", "/api/dates");
			const dates: DateInfo[] = (res.data ?? []).map((d) => ({
				text: d,
				value: d,
			}));
			// reverse sort by date
			dates.sort((a: DateInfo, b: DateInfo) =>
				a.value > b.value ? 1 : -1
			);
			context.commit("dates", dates);
			return dates;
		},

		async flightDateLoad(
			context: ActionContext<StoreState, StoreState>,
			date: string
		): Promise<Flight[]> {
			const res = await fetcher<Flight[]>("GET", `/api/flights/${date}`);
			const flights = res.data ?? [];
			context.commit("flightDates", { date, flights });
			return flights;
		},

		async countriesLoad(
			context: ActionContext<StoreState, StoreState>
		): Promise<Country[]> {
			const res = await fetcher<Country[]>("GET", "/api/country");
			const countries = res.data ?? [];
			context.commit("countries", countries);
			return countries;
		},

		async countryDatesLoad(
			context: ActionContext<StoreState, StoreState>,
			date: string
		): Promise<CountryCount[]> {
			const res = await fetcher<CountryCount[]>(
				"GET",
				`/api/country/${date}`
			);
			const countries = res.data ?? [];
			context.commit("countryDates", { date, countries });
			return countries;
		},
	},

	mutations: {
		datePicked: (state: StoreState, datePicked: string) => {
			state.datePicked = datePicked;
		},

		dates: (state: StoreState, dates: DateInfo[]) => {
			dates.sort().reverse(); // latest on top
			state.dates = dates;
		},

		flightDates: (
			state: StoreState,
			{ date, flights }: { date: string; flights: Flight[] }
		) => {
			pruneToSize(state.flightDates, 20);
			state.flightDates[date] = flights;
		},

		countries: (state: StoreState, countries: Country[]) => {
			state.countries = countries;
		},

		countryDates: (
			state: StoreState,
			{ date, countries }: { date: string; countries: CountryCount[] }
		) => {
			pruneToSize(state.countryDates, 20);
			state.countryDates[date] = countries;
		},

		selectedFlight(state: StoreState, flight: Flight | undefined) {
			state.selectedFlight = flight;
		},
	},

	getters: {
		datePicked: (state: StoreState) => {
			if (state.datePicked === "latest") {
				return state.dates[0]?.value; // ASSUME: latest is still on top
			} else {
				return state.datePicked;
			}
		},

		maxDate: (state: StoreState) => {
			return state.dates[0]?.value; // ASSUME: latest is still on top
		},

		flightDate: (state: StoreState) => (
			date: string
		): Flight[] | undefined => {
			return state.flightDates[date];
		},

		countryDate: (state: StoreState) => (
			date: string
		): CountryCount[] | undefined => {
			return state.countryDates[date];
		},
	},
});

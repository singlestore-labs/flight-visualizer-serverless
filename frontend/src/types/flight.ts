// docs: https://opensky-network.org/apidoc/rest.html
export interface Flight {
  load_date: string; // DateTime;
  ica024: string; // ASSUME: ica024 is unique to a plane and consistent across time
  callsign?: string;
  origin_country?: string;
  time_position?: string; // DateTime;
  last_contact: string; // DateTime;
  // position?: string;
  longitude?: number;
  latitude?: number;
  baro_altitude?: number;
  on_ground: boolean;
  velocity?: number;
  true_track?: number; // clockwise rotation degrees from north
  vertical_rate?: number;
  // sensors?: number[];
  altitude?: number;
  squawk?: string;
  spi: boolean;
  position_source: number; // 0 = ADS-B, 1 = ASTERIX, 2 = MLAT
  current_country?: string; // from join with countries table
}

import { AwsClient } from "aws4fetch";
import { Flight } from "./flight";
import { OpenSkyResponse } from "./opensky";

declare let S3_FOLDER: string;
declare let S3_BUCKET: string;
declare let S3_REGION: string;
declare let S3_ACCESSKEY: string;
declare let S3_SECRETKEY: string;

export default async function loadData(): Promise<void> {
    const s3Client = getS3Client();

    try {
        const data = await getFlightData();

        // data.time is in seconds, but new Date expects milliseconds
        const load_date = new Date(data.time * 1000).toISOString();

        const flights = data.states
            .map((d: unknown[]) => pivotData(d, load_date))
            .filter((f: Flight) => f.callsign || f.position);

        // 1 line per object, no array wrapper around it, no comma between objects
        const content = flights
            .map((f: Flight) => JSON.stringify(f))
            .join("\n");

        const filename = `${
            S3_FOLDER ? S3_FOLDER + "/" : ""
        }${load_date}.json`.replace(/:/g, "-");

        const response = await uploadFileToS3(s3Client, filename, content);

        if (response.ok) {
            console.log(`uploaded ${filename}`);
        }
    } catch (err) {
        console.log("error loading", JSON.stringify(err), err.toString());
    }
}

export function getS3Client(): AwsClient {
    return new AwsClient({
        region: S3_REGION,
        accessKeyId: S3_ACCESSKEY || "",
        secretAccessKey: S3_SECRETKEY || "",
    });
}

export async function getFlightData(): Promise<OpenSkyResponse> {
    // docs: https://opensky-network.org/apidoc/rest.html
    const url = "https://opensky-network.org/api/states/all";
    const res = await fetch(url, { method: "GET" });
    const data = await res.json();
    return data;
}

export function pivotData(f: any[], load_date: string): Flight {
    const [
        ica024,
        callsign,
        origin_country,
        time_position_num,
        last_contact_num,
        longitude,
        latitude,
        baro_altitude,
        on_ground,
        velocity,
        true_track,
        vertical_rate,
        altitude,
        squawk,
        spi,
        position_source,
    ] = f;

    const last_contact = new Date(
        (last_contact_num as number) * 1000,
    ).toISOString();
    const time_position = time_position_num
        ? new Date((time_position_num as number) * 1000).toISOString()
        : undefined;
    const position =
        latitude && longitude ? `POINT (${longitude} ${latitude})` : undefined;

    const flt: Flight = {
        load_date,
        ica024,
        callsign: (callsign || "").trim(),
        origin_country,
        time_position,
        last_contact,
        longitude,
        latitude,
        position,
        baro_altitude,
        on_ground,
        velocity,
        true_track,
        vertical_rate,
        altitude,
        squawk,
        spi,
        position_source,
    };
    return flt;
}

async function uploadFileToS3(
    s3Client: AwsClient,
    filename: string,
    data: string,
): Promise<Response> {
    const url = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${filename}`;

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    };

    return await s3Client.fetch(url, {
        method: "PUT",
        headers,
        body: data,
    });
}

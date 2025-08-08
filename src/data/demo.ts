import { LatLng } from "leaflet";
import type { HouseList } from "./data_types";
import houses from "@/data/houses.json";

export const source_name = "Demo Dataset";

export async function get(): Promise<HouseList | undefined> {
    return Promise.resolve(new Map(houses.features.map(x => {
        const loc = x.geometry.coordinates.reverse();
        
        return [x.id, {
            "properties": x.properties,
            "location": new LatLng(loc[0], loc[1])
        }];
    })));
} 
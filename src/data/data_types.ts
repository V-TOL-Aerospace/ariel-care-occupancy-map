import type { LatLngExpression, LatLngTuple } from "leaflet"

export interface EntityProperties {
    name: string
    address: string
    web?: string
    email?: string
    phone?: string
    capabilities?: string[]
}

export interface OccupationProperties {
    rooms:number,
    participants?:number,
    hospice?:number,
}

export type HouseStatus = "available" | "planned" | "construction";

export interface HouseProperties {
    name: string,
    address: string,
    status: HouseStatus | string,
    occupation: OccupationProperties,
    manager: string,
    features?: string[],
    operator?: string,
    reserve_url?: URL,
    image?: URL,
    floorplan?: URL,
}

export interface HouseEntry {
    location: LatLngExpression;
    properties: HouseProperties;
}

export type HouseList = Map<string, HouseEntry>;
export type ClickItemWithID = (id:string)=>void;

export const default_manager: EntityProperties = {
    name: "No manager",
    address: "Unknown"
}

export function isLatLngTuple(item: any): item is LatLngTuple {
    return item.length && item.length > 2;
}

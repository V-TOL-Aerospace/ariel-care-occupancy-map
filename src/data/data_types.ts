export interface EntityProperties {
    name: string
    address: string
    web?: string
    email?: string
    phone?: string
    reserve_api?: string
}

export interface OccupationProperties {
    rooms:number,
    participants?:number,
    hospice?:number,
}

export type HouseStatus = "ready" | "planned" | "construction";

export interface HouseProperties {
    name: string,
    address: string,
    status: HouseStatus | string,
    occupation: OccupationProperties,
    manager: string,
    features?: string[],
    operator?: string,
    reserve_id?: string,
}

export type HouseList = Map<string,HouseProperties>;
export type ClickItemWithID = (id:string)=>void;

export const default_manager: EntityProperties = {
    name: "No manager",
    address: "Unknown"
}

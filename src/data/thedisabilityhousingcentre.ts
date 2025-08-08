import type { HouseList, HouseProperties } from "./data_types";

export const source_name = "The Disabilty Housing Centre";

export async function get(): Promise<HouseList | undefined> {
    return Promise.reject(new Error("get() not implemented"));
} 
import type { HouseEntry, HouseList, HouseProperties } from "./data_types";
import { LatLng } from "leaflet";
import _cached from "./thedisabilityhousingcentre.json";

export const source_name = "The Disabilty Housing Centre";

const url = '/get/thedisabilityhousingcentre';
const idStartsWith = "post-"

function _clean_properties(v:any): HouseProperties {
    let h:HouseProperties = {
        name: v.name ?? "",
        address: v.address ?? "",
        status: v.status ?? "available",
        occupation: v.occupation ?? "",
        manager: v.manager ?? ""
    }

    if(v.features)
        h.features = v.features;
    if(v.operator)
        h.operator = v.operator;
    if(v.reserve_url)
        h.reserve_url = new URL(v.reserve_url);
    if(v.image)
        h.image = new URL(v.image);
    if(v.floorplan)
        h.floorplan = new URL(v.floorplan, location.toString()); //TODO: Probably not this for real one

    return h;
}

function _clean_location(v:any) {
    return new LatLng(v.lat, v.lng);
}

function _clean_entry(v:any): HouseEntry {
    return {
        location: _clean_location(v.location),
        properties: _clean_properties(v.properties)
    };
}

async function _get_cached(): Promise<HouseList | undefined> {
    console.log("Using cached data");
    const houses:HouseList = new Map(Object.entries(_cached).map(x => [x[0], _clean_entry(x[1])] ));
    return Promise.resolve(houses);
}

async function _get_real(): Promise<HouseList | undefined> {
    console.log("Attempting data scrape");

    const response = await fetch(url);
    if(!response) return;

    const html = await response.text();
    if(!html) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const map_node = doc.getElementsByClassName("es-map")[0];
    const locations_dirty = JSON.parse(map_node.getAttribute("data-listings") ?? "{}");
    // console.log(locations_dirty);
    const locations = new Map(Object.entries(locations_dirty).map(x => {
        const p:any = x[1];
        return [x[0], new LatLng(p.lat, p.lng)];
    }));
    // console.log(locations);

    const houses:HouseList = new Map();
    const items = doc.querySelectorAll(`.properties`);
    console.log(`Received ${items.length} results`);
    for(const i of items) {
        const id = i.id.replace(idStartsWith, '');
        const image = i.getElementsByClassName("es-listing__image")[0]?.getElementsByTagName("img")[0]?.getAttribute("data-lazy");
        const title_node = i.getElementsByClassName("es-listing__title")[0];
        const link = title_node.getElementsByTagName("a")[0]?.href;
        const title = title_node.textContent?.trim() ?? "New residence";
        const extras_nodes = i.getElementsByClassName("es-listing__meta")[0]?.children;
        const extras:string[] = [];
        let rooms = 0;
        for(const e of extras_nodes) {
            const extra = e.textContent?.trim();
            if(extra)
                extras.push(extra);

            if(extra?.includes("bed")) {
                rooms = Number(extra.split(" ")[0]);
            }
        }

        // console.log(i);
        // console.log(id);
        // console.log(title);
        // console.log(image);
        // console.log(link);
        // console.log(extras);

        const house:HouseEntry = {
            location: locations.get(id) ?? [0,0],
            properties: {
                name: title,
                address: "Address on request",
                status: "construction",
                occupation: {
                    rooms: rooms
                },
                manager: "entity/sda_smart_homes",
                image: image ? new URL(image) : undefined,
                reserve_url: link ? new URL(link) : undefined,
            }
        }

        houses.set(id, house);
    }

    console.log(Object.fromEntries(houses.entries()));

    return houses;
}

const use_dev_mode = false;
function _is_dev() {
    return (location.hostname === "localhost" || location.hostname === "127.0.0.1") && use_dev_mode;
}

export async function get(): Promise<HouseList | undefined> {
    return _is_dev() ? _get_real() : _get_cached();
}

import type { HouseEntry, HouseList, HouseProperties } from "./data_types";

export const source_name = "The Disabilty Housing Centre";

const url = false ? '/get/thedisabilityhousingcentre' : 'https://thedisabilityhousingcentre.com.au/search-results/';    //TODO: Check correct fix for dev
const idStartsWith = "post-"

export async function get(): Promise<HouseList | undefined> {
    const response = await fetch(url);
    if(!response) return;

    const html = await response.text();
    if(!html) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const map_node = doc.getElementsByClassName("es-map")[0];
    const locations = JSON.parse(map_node.getAttribute("data-listings") ?? "{}");
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
            location: locations[id] ?? [0,0],
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

    return houses;
}

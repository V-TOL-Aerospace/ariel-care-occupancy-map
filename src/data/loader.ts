import type { HouseList } from "./data_types";

import { get as get_remote, source_name as remote_name } from "@/data/thedisabilityhousingcentre";
import { get as get_demo, source_name as demo_name } from "@/data/demo";


const loaders = new Map([
  [remote_name, get_remote],
  [demo_name, get_demo],
])

export async function try_load(name:string) {
    const fn = loaders.get(name);
    if(!fn) {
        console.error(`No loader: ${name}`);
        return;
    }

    const results = await fn();
    if(!results) {
        console.log(`Failed to load from: ${name}`);
        return;
    }

  return results;
}

export async function load_first() {
    for(const [name, getter] of loaders) {
        try {
            const results = await getter();
            if(!results) {
                console.log(`Failed to load from: ${name}`);
                continue;
            }

            console.log(`Loaded: ${name}`);
            return results;
        } catch (error) {
            console.error((error as Error).message);
        }
    }

    return new Map() as HouseList;
}

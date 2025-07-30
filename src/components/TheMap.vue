<script setup lang="ts">
import HouseListComponent from "./HouseListComponent.vue";
import PopupComponent from "./PopupComponent.vue";
import { ref, useTemplateRef } from "vue";

import houses from "@/data/houses.json";
import entities from "@/data/entities.json";
import { default_manager } from "@/data/data_types";

import 'leaflet-geosearch/dist/geosearch.css';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LControl } from "@vue-leaflet/vue-leaflet";
import { GeoSearchControl, OpenStreetMapProvider} from 'leaflet-geosearch';
import type {SearchResult} from 'leaflet-geosearch/lib/providers/provider.d.ts'
import type {RawResult} from 'leaflet-geosearch/lib/providers/openStreetMapProvider.d.ts'

const zoom = ref<number>(4);
const center = ref<L.PointTuple>([-26.74561038219901, 135.45788264176022]);
const markers = useTemplateRef<typeof LMarker[]>('markers')
const fly_options = {
  animate: true,
  duration: 3
}

function onMapClick(e:L.LeafletMouseEvent) {
  console.log(`Click: [${e.latlng.lat}, ${e.latlng.lng}]`);
}

const provider = new OpenStreetMapProvider();
const searchControl = GeoSearchControl({
  provider: provider,
  retainZoomLevel: true,
});

function hotfix_set_search_bounds(map:L.Map, result:any) {
  if(!result.location) {
    console.warn("Invalid location provided");
    return;
  }

  map.flyToBounds(result.location?.bounds, fly_options);

  // searchControl.clearResults();
  console.log(`Result address: ${result.location.label}`);
  console.log(`Result geo: [${result.location.x}, ${result.location.y}]`);
}

let myMap:L.Map|null = null;
function mapReady(map:L.Map) {
  myMap = map;
  map.zoomControl.setPosition("topright")
  map.removeControl(map.attributionControl);

  searchControl.addTo(map);
  map.on('geosearch/showlocation', hotfix_set_search_bounds.bind(null, map));

  const valid_markers = markers.value?.filter(x => x != null);
  if(!valid_markers) {
    console.log("No valid markers")
    return;
  }

  let lat_min = Number.MAX_VALUE;
  let lat_max = -Number.MAX_VALUE;
  let lng_min = Number.MAX_VALUE;
  let lng_max = -Number.MAX_VALUE;
  for(const m of valid_markers) {
    // const rawObject = JSON.parse(JSON.stringify(m));
    const pos = m.latLng as L.LatLngTuple;
    if(pos[0] < lat_min) lat_min = pos[0];
    if(pos[0] > lat_max) lat_max = pos[0];
    if(pos[1] < lng_min) lng_min = pos[1];
    if(pos[1] > lng_max) lng_max = pos[1];
  }

  setTimeout(() => {
    map.flyToBounds([[lat_min, lng_min], [lat_max, lng_max]], fly_options),
    2000
  });
}

function get_entity_by_id(id?:string) {
  if(!id) return undefined;

  return entities.entities.find(x => x.id == id);
}

function listReady(context: typeof LControl) {
  context.setPosition("bottomleft");
}

function listItemClicked(id:string) {
  if(!myMap) return;

  // const m = markers.value?.find(x => x.name == id);
  // if(!m) return;

  // console.log(m.name);
  // console.log(m.getLatLng())
  myMap.eachLayer(layer => { 
    if (layer.options.attribution == id) {
        const m = layer as L.Marker;
        m.openPopup()
        setTimeout(() => {
          myMap?.flyTo(m.getLatLng(), 16, fly_options),
          2000
        });
    } 
  });
}
</script>

<template>
    <l-map :zoom="zoom" :zoomControl="false" :center="center" :use-global-leaflet="false" @click="onMapClick" @ready="mapReady">
    <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      layer-type="base"
      name="OpenStreetMap"
    ></l-tile-layer>
    <!-- <l-control>{{searchControl.getContainer() }}</l-control> -->
    <l-marker v-for="house of houses.features" ref="markers" :attribution="house.id" :lat-lng="house.geometry.coordinates.reverse() as L.PointTuple">
      <l-popup>
        <PopupComponent
          :id="house.id"
          :house="house.properties"
          :operator="get_entity_by_id(house.properties.operator)"
          :manager="get_entity_by_id(house.properties.manager) ?? default_manager"
        ></PopupComponent>
      </l-popup>
    </l-marker>
    <l-control id="house-list" class="leaflet-bar leaflet-touch" @ready="listReady" :disable-scroll-propagation="true">
      <HouseListComponent :houses="new Map(houses.features.map(x => [x.id, x.properties]))" @click="listItemClicked"/>
    </l-control>
  </l-map>
</template>

<style scoped>
#house-list {
  background-color: var(--color-background);
  max-height: 50vh;
  max-width: 25vw;
  overflow: scroll;
  padding: 1rem;
}
</style>

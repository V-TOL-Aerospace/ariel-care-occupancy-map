<script setup lang="ts">
import HouseListComponent from "./HouseListComponent.vue";
import HouseFilterComponent from "./HouseFilterComponent.vue"
import { ref, useTemplateRef, onBeforeMount, watch } from "vue";

import { isLatLngTuple, type HouseList } from "@/data/data_types";

import 'leaflet-geosearch/dist/geosearch.css';
import "leaflet/dist/leaflet.css";
import L, { icon } from "leaflet";
import { LMap, LTileLayer, LControl } from "@vue-leaflet/vue-leaflet";
import { GeoSearchControl, OpenStreetMapProvider} from 'leaflet-geosearch';
import { load_first } from "@/data/loader";
import MarkerComponent from "./MarkerComponent.vue";

const zoom = ref<number>(4);
const center = ref<L.PointTuple>([-26.74561038219901, 135.45788264176022]);
const markers = useTemplateRef<typeof MarkerComponent[]>('markers')
const fly_options = {
  animate: true,
  duration: 3
}

const houses = ref<HouseList>(new Map());

const provider = new OpenStreetMapProvider();
const searchControl = GeoSearchControl({
  provider: provider,
  retainZoomLevel: true,
  marker: {
    icon: new L.Icon.Default({ className: "l-marker-red"} )
  }
});

function onMapClick(e:L.LeafletMouseEvent) {
  console.log(`Click: [${e.latlng.lat}, ${e.latlng.lng}]`);
  searchControl.close();
}

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

function fit(group: L.LatLngExpression[]) {
  const valid_markers = group.filter(x => x != null);
  if(!valid_markers) {
    console.log("No valid markers")
    return;
  }

  let lat_min = Number.MAX_VALUE;
  let lat_max = -Number.MAX_VALUE;
  let lng_min = Number.MAX_VALUE;
  let lng_max = -Number.MAX_VALUE;
  for(const pos of valid_markers) {
    if(isLatLngTuple(pos)) {
      if(pos[0] < lat_min) lat_min = pos[0];
      if(pos[0] > lat_max) lat_max = pos[0];
      if(pos[1] < lng_min) lng_min = pos[1];
      if(pos[1] > lng_max) lng_max = pos[1];
    } else {
      if(pos.lat < lat_min) lat_min = pos.lat;
      if(pos.lat > lat_max) lat_max = pos.lat;
      if(pos.lng < lng_min) lng_min = pos.lng;
      if(pos.lng > lng_max) lng_max = pos.lng;
    }
  }

  setTimeout(() => {
    myMap?.flyToBounds([[lat_min, lng_min], [lat_max, lng_max]], fly_options),
    2000
  });
}

watch(markers, (value_new, _) => {
  if(value_new)
    fit(value_new.map(x => x.getLatLng()))
}, {deep: true});

function mapReady(map:L.Map) {
  myMap = map;

  searchControl.addTo(map);
  map.on('geosearch/showlocation', hotfix_set_search_bounds.bind(null, map));

  map.zoomControl.setPosition("topleft")
  map.attributionControl.setPrefix('<a href="https://leafletjs.com/">Leaflet</a>');

  const el = map.getContainer();
  for(const e of el.getElementsByClassName("leaflet-right")) {
    (e as HTMLElement).style.display = "flex";
    (e as HTMLElement).style.flexDirection = "column";
    (e as HTMLElement).style.maxHeight = "100%";
  }
}

async function get_data() {
  houses.value = await load_first();
}

onBeforeMount(() => {
  get_data();
})

function listReady(context: typeof LControl) {
  context.setPosition("topright");
}

function filterReady(context: typeof LControl) {
  context.setPosition("topright");
}

function listItemClicked(id:string) {
  if(!markers.value) return;

  for(const marker of markers.value) {
    if(marker.getID() == id) {
      myMap?.flyTo(marker.getLatLng(), 16, fly_options);
      setTimeout(() => {marker.openPopup();}, fly_options.duration*1000);
      return;
    }
  }
}

function filtersChanged(filters: any) {
  console.log(filters)
}
</script>

<template>
    <l-map :zoom="zoom" :zoomControl="false" :center="center" :use-global-leaflet="false" @click="onMapClick" @ready="mapReady">
    <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      layer-type="base"
      attribution='Data by &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, under <a href="https://opendatacommons.org/licenses/odbl/">ODbL.</a>'
      name="OpenStreetMap"
    ></l-tile-layer>
    <MarkerComponent v-for="[key, house] of houses" ref="markers" :house="house" :id="key"/>
    <l-control id="house-filter" class="leaflet-bar leaflet-touch" @ready="filterReady" :disable-scroll-propagation="true">
      <HouseFilterComponent @changed="filtersChanged"/>
    </l-control>
    <l-control id="house-list" class="leaflet-bar leaflet-touch" @ready="listReady" :disable-scroll-propagation="true">
      <HouseListComponent :houses="houses" @click="listItemClicked"/>
    </l-control>
  </l-map>
</template>

<style scoped>
#house-list {
  background-color: var(--color-background);
  /* Full size box, minus the room for #house-filter and the top, spacing, and bottom margins */
  max-height: 100%;
  width: 30vw;
  overflow: scroll;
  padding: 1rem;
  margin-bottom: 30px;
  flex: auto;
  flex-grow: 1;
}

#house-filter {
  background-color: var(--color-background);
  padding: 0.2rem;
  min-height: 30px;
  display: flex;
  flex: auto;
  flex-shrink: 0;
  align-items: center;
  width: 30vw;
}
</style>

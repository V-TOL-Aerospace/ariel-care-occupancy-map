<script setup lang="ts">
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
const markers = useTemplateRef<L.Marker[]>('markers')
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
  if(result.location?.bounds)
    map.flyToBounds(result.location?.bounds, fly_options);

  searchControl.clearResults();
}

function mapReady(map:L.Map) {
  map.zoomControl.setPosition("topright")

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
    const rawObject = JSON.parse(JSON.stringify(m));

    const pos = rawObject.latLng as L.LatLngTuple;
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
</script>

<template>
    <l-map :zoom="zoom" :zoomControl="false" :center="center" :use-global-leaflet="false" @click="onMapClick" @ready="mapReady">
    <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      layer-type="base"
      name="OpenStreetMap"
    ></l-tile-layer>
    <!-- <l-control>{{searchControl.getContainer() }}</l-control> -->
    <l-marker v-for="house of houses.features" ref="markers" :lat-lng="house.geometry.coordinates.reverse() as L.PointTuple">
      <l-popup>
        <PopupComponent
          :id="house.id"
          :house="house.properties"
          :operator="get_entity_by_id(house.properties.operator)"
          :manager="get_entity_by_id(house.properties.manager) ?? default_manager"
        ></PopupComponent>
      </l-popup>
    </l-marker>
  </l-map>
</template>

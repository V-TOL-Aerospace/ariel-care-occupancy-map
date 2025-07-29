<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import { ref, toRaw, useTemplateRef } from "vue";

import houses from "@/data/houses.json";

const zoom = ref<number>(4);
const center = ref<L.PointTuple>([-26.74561038219901, 135.45788264176022]);
// const map = useTemplateRef("map");
const markers = useTemplateRef<L.Marker[]>('markers')

function onMapClick(e:L.LeafletMouseEvent) {
  console.log(`Click: [${e.latlng.lat}, ${e.latlng.lng}]`);
}

function onReady(map:L.Map) {
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
    console.log(rawObject)
    const pos = rawObject.latLng as L.LatLngTuple
    if(pos[0] < lat_min) lat_min = pos[0];
    if(pos[0] > lat_max) lat_max = pos[0];
    if(pos[1] < lng_min) lng_min = pos[1];
    if(pos[1] > lng_max) lng_max = pos[1];
  }
  
  setTimeout(() => {
    map.flyToBounds([[lat_min, lng_min], [lat_max, lng_max]],  {
        animate: true,
        duration: 3});
    }, 2000);
}
</script>

<template>
    <l-map ref="map" v-model:zoom="zoom" :center="center" :use-global-leaflet="false" @click="onMapClick" @ready="onReady">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
    ></l-tile-layer>
    <l-marker v-for="house in houses.features" ref="markers" :lat-lng="house.geometry.coordinates.reverse() as L.PointTuple">
      <l-popup>Hello!</l-popup>
    </l-marker>
  </l-map>
</template>

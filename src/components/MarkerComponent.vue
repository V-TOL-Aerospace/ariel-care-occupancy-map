<script setup lang="ts">
import { default_manager, type HouseEntry } from '@/data/data_types';
import entities from "@/data/entities.json";
import PopupComponent from "./PopupComponent.vue";
import { LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import { useTemplateRef } from 'vue';
import L from "leaflet";

function get_entity_by_id(id?:string) {
  if(!id) return undefined;

  return entities.entities.find(x => x.id == id);
}

const marker = useTemplateRef<typeof LMarker>('marker');
const popup = useTemplateRef<typeof LPopup>('popup');

const props = defineProps<{
  id: string,
  house: HouseEntry,
}>();

function getID() {
  return props.id;
}

function openPopup() {
  marker.value?.leafletObject.openPopup();
}

function getLatLng() {
  return props.house.location;
}

defineExpose({
  getID,
  getLatLng,
  openPopup,
});
</script>

<template>
    <l-marker ref="marker" :lat-lng="house.location as L.PointTuple">
      <l-popup ref="popup">
        <PopupComponent
            :id="id"
            :house="house.properties"
            :operator="get_entity_by_id(house.properties.operator)"
            :manager="get_entity_by_id(house.properties.manager) ?? default_manager"
        ></PopupComponent>
      </l-popup>
    </l-marker>
</template>
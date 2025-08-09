<script setup lang="ts">
import HousePopupComponent from './HousePopupComponent.vue';
import EntityPopupComponent from './EntityPopupComponent.vue';
import type { EntityProperties, HouseProperties } from '@/data/data_types';

defineProps<{
  id: string,
  house: HouseProperties,
  manager: EntityProperties,
  operator?: EntityProperties,
}>()
</script>

<template>
  <img v-if="house.image" :src="house.image.href"/></img>
  <h1>{{ house.name }}</h1>
  <div>{{ house.address }}</div>
  <h2>Details</h2>
  <HousePopupComponent
  :status="house.status"
  :occupation="house.occupation"
  :features="house.features"
  />
  <h2>Manager</h2>
  <EntityPopupComponent
  :name="manager.name"
  :address="manager.address"
  :web="manager.web"
  :email="manager.email"
  :phone="manager.phone"
  />
  <h2 v-if="operator">Operator</h2>
  <EntityPopupComponent v-if="operator"
  :name="operator.name"
  :address="operator.address"
  :web="operator.web"
  :email="operator.email"
  :phone="operator.phone"
  />
  <div v-if="house.reserve_url" class="separate center" >
    <a :href="house.reserve_url.href" target="_blank" rel="noopener noreferrer"><button>Make reservation</button></a>
  </div>
</template>

<style scoped>
h2 {
  margin-top: 0.2em;
}

img {
  width: 100%;
  border-radius: 0.2rem;
  object-fit: contain;
}

.separate {
  margin: 1em;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  cursor: pointer;
}
</style>

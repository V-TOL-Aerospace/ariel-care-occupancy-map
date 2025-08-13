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
  <tabs :options="{ useUrlFragment: false }" class="inset">
    <tab name="Details">
      <HousePopupComponent
      :status="house.status"
      :occupation="house.occupation"
      :features="house.features"
      />
    </tab>
    <tab v-if="house.floorplan" name="Floorplan">
      <img :src="house.floorplan.href"/></img>
    </tab>
    <tab v-if="operator" name="Operator">
      <EntityPopupComponent
      :name="operator.name"
      :address="operator.address"
      :web="operator.web"
      :email="operator.email"
      :phone="operator.phone"
      :capbilities="operator.capabilities"
      />
    </tab>
    <tab name="Manager">
      <EntityPopupComponent
      :name="manager.name"
      :address="manager.address"
      :web="manager.web"
      :email="manager.email"
      :phone="manager.phone"
      :capbilities="manager.capabilities"
      />
    </tab>
  </tabs>
  <div class="hspan separate center large">
    <div v-if="house.reserve_url">
      <a :href="house.reserve_url.href" target="_blank" rel="noopener noreferrer"><button>Reserve now</button></a>
    </div>
    <div v-if="manager.email">
      <a :href="`mailto:${manager.email}`"><button>Enquire</button></a>
    </div>
  </div>
</template>

<style scoped>
h2 {
  margin-top: 0.2rem;
}

.hspan {
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-left: 0;
  gap: 1rem;
}

.hspan > * {
  flex: auto;
  flex-basis: 100%;
}

button {
  width: 100%;
  font-size: large;
}

a {
  padding: 0;
  width: 100%;
}

.inset {
  margin-top: 0.5rem;
  border: 2px solid var(--color-background-mute);
  border-radius: 0.4rem;
}

img {
  width: 100%;
  border-radius: 0.2rem;
  object-fit: contain;
}

.separate {
  margin-top: 1em;
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

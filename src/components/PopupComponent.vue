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
  <h1>{{ house.name }}</h1>
  <div>{{ house.address }}</div>
  <h2>Details</h2>
  <HousePopupComponent
  :status="house.status"
  :occupation="house.occupation"
  :features="house.features"
  ></HousePopupComponent>
  <h2>Manager</h2>
  <EntityPopupComponent
  :name="manager.name"
  :address="manager.address"
  :web="manager.web"
  :email="manager.email"
  :phone="manager.phone"></EntityPopupComponent>
  <h2 v-if="operator">Operator</h2>
  <EntityPopupComponent v-if="operator"
  :name="operator.name"
  :address="operator.address"
  :web="operator.web"
  :email="operator.email"
  :phone="operator.phone"
  :reserve_link="operator.reserve_api && house.reserve_id ? operator.reserve_api.replace('{}', house.reserve_id) : undefined"></EntityPopupComponent>
</template>

<style scoped>
h2 {
  margin-top: 0.2em;
}
</style>

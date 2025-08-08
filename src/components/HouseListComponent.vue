<script setup lang="ts">
import type { ClickItemWithID, HouseList } from '@/data/data_types';
import HoustListItemComponent from "./HouseListItemComponent.vue"

defineProps<{
  houses: HouseList,
}>();

const emit = defineEmits<{
  (e: 'click', id: string): void
}>();
</script>

<template>
  <section>
    <HoustListItemComponent v-for="[key, house] of houses.entries()" @click="emit('click', key)"
      :id="key"
      :name="house.properties.name"
      :address="house.properties.address"
      :status="house.properties.status"
      :occupation="house.properties.occupation"
      :features="house.properties.features"
    >
    </HoustListItemComponent>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
  overflow: scroll;
  gap: 1rem;
}

section > div {
  flex:auto;
  flex-grow: 1;
  width: 100%;
  background: var(--color-background-soft);
  padding: 0.5rem;
  border-radius: 0.3rem;
  cursor: pointer;
}

section > div:hover {
  background: var(--color-background-mute);
}
</style>

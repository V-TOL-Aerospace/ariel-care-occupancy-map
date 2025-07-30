<script setup lang="ts">
import type { HouseStatus, OccupationProperties } from '@/data/data_types';

defineProps<{
  status: HouseStatus | string,
  occupation: OccupationProperties,
  features?: string[],
}>()

function hospice_ratio(occupation: OccupationProperties) {
  if(!occupation.hospice) {
    return 0;
  }

  if(!occupation.participants) {
    return 1;
  }

  return occupation.hospice / (occupation.hospice + occupation.participants);
}

function availability(occupation: OccupationProperties) {
  return occupation.rooms - (occupation.hospice ? occupation.hospice : 0)  - (occupation.participants ? occupation.participants : 0);
}
</script>

<template>
  <div>Status: {{ status }}</div>
  <section>
    <!-- <header>
      <div class="col">Column A</div>
      <div class="col">Column B</div>
      <div class="col">Column C</div>
    </header> -->
    <div class="row">
      <div class="col">Rooms:</div>
      <div class="col">{{ occupation.rooms}}</div>
    </div>
    <div class="row">
      <div class="col">Available:</div>
      <div class="col">{{ availability(occupation) }}</div>
    </div>
    <div class="row">
      <div class="col">Hospice Ratio:</div>
      <div class="col">{{ (hospice_ratio(occupation) * 100).toFixed() }}%</div>
    </div>
  </section>
  <div v-if="features && features.length">Features:</div>
  <ul v-if="features && features.length">
    <li v-for="f of features">
      {{f}}
    </li>
  </ul>
</template>

<style scoped>
section {
  display: table;
  width: 100%;
}

section > * {
  display: table-row;
}

section .col {
  display: table-cell;
}
</style>

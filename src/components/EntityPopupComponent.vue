<script setup lang="ts">
// {
//   "id": "entity/sda_smart_homes",
//   "name": "SDA Smart Homes",
//   "address": "912 Stanley Street East, East Brisbane, Queensland 4169",
//   "web": "https://sdasmarthomes.com.au/",
//   "email": "info@sdasmarthomes.com.au/",
//   "phone": "+61738993873"
// },

import parsePhoneNumber from 'libphonenumber-js'

defineProps<{
  name: string,
  address: string,
  web?: string,
  email?: string,
  phone?: string,
  reserve_link?: URL,
  capbilities?: string[],
}>()

function pretty_print_phone(num:string) {
  const phoneNumber = parsePhoneNumber(num);
  return phoneNumber ? phoneNumber.formatInternational() : num;
}

function uri_phone(num:string) {
  const phoneNumber = parsePhoneNumber(num);
  return phoneNumber ? phoneNumber.getURI() : `tel:${num}`;
}
</script>

<template>
  <h2>{{ name }}</h2>
  <div>{{ address }}</div>
  <div v-if="capbilities && capbilities.length">Capabilities:</div>
  <ul v-if="capbilities && capbilities.length">
    <li v-for="c of capbilities">{{ c }}</li>
  </ul>
  <section>
    <!-- <header>
      <div class="col">Column A</div>
      <div class="col">Column B</div>
      <div class="col">Column C</div>
    </header> -->
    <div v-if="web" class="row">
      <div class="col">Web:</div>
      <div class="col">
        <a :href="web">{{ web }}</a>
      </div>
    </div>
    <div v-if="email" class="row">
      <div class="col">Email:</div>
      <div class="col">
        <a v-if="web" :href="`mailto:${email}`">{{ email }}</a>
      </div>
    </div>
    <div v-if="phone" class="row">
      <div class="col">Phone:</div>
      <div class="col">
        <a v-if="web" :href="uri_phone(phone)">{{ pretty_print_phone(phone) }}</a>
      </div>
    </div>
  </section>
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

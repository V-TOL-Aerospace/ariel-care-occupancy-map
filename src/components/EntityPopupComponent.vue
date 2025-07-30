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
  reserve_link?: string,
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
  <div>{{ name }}</div>
  <div>{{ address }}</div>
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
  <div v-if="reserve_link" class="separate center" >
    <a :href="reserve_link" target="_blank" rel="noopener noreferrer"><button>Make reservation</button></a>
  </div>
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

.separate {
  margin: 1em;
}
/*
.full-width {
  width: 100%;
} */

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

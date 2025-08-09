<script setup lang="ts">
const emit = defineEmits<{
  (e: 'changed', filters: Map<string,any>): void
}>();
</script>

<template>
  <section>
    <div>
      <label for="range">Range:</label>
      <select name="range" id="range">
        <option value="0" selected>All</option>
        <option value="100">100 km</option>
        <option value="50">50 km</option>
        <option value="20">20 km</option>
        <option value="10">10 km</option>
      </select>
    </div>
    <div>
      <label for="beds">Beds:</label>
      <select name="beds" id="beds">
        <option value="0" selected>All</option>
        <option value="3">3</option>
        <option value="2">2</option>
        <option value="1">1</option>
      </select>
    </div>
    <div>
      <input type="checkbox" class="clickable" name="robust" id="robust"></input>
      <label class="clickable" for="robust">Robust</label>
    </div>
    <div>
      <input type="checkbox" class="clickable" name="accessible" id="accessible"></input>
      <label class="clickable" for="accessible">Accessible</label>
    </div>
    <div>
      <input class="clickable" type="checkbox" name="ariel" id="ariel"></input>
      <label class="clickable" for="ariel">Ariel.Care</label>
    </div>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: 100%;
  gap: 1rem;
  align-items: center;
}

section > * {
  flex:auto;
  flex-grow: 0;
  align-items: center;
  display: flex;
  background: var(--color-background-soft);
  border-radius: 0.3rem;
}

label {
  padding-left: 0.2em;
  padding-right: 0.2em;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background: var(--color-background-mute);
}
</style>

<template>
  <div class="w-1/2 h-64 p-4 m-4 overflow-y-auto bg-white rounded-md">
    <div class="flex flex-col p-4 text-base text-haiti font-lora">
      <span class="text-lg font-semibold text-center">Number of facts: {{ list.length }}</span>
      <ol v-if="list.length">
        <li v-for="fact in list" :key="fact.id">
          <ul>
            <li>{{ fact.text }}</li>
            <span class="indented">Language: </span><li class="inline-block">{{ fact.language.toUpperCase() }}</li>
            <li class="italic indented"><a href="{{fact.permalink}}">Permalink</a></li>
          </ul>
        </li>
      </ol>
      <div class="text-center" v-else>Click on the blue card to start learning new facts!</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Fact } from "../App.vue";

export default defineComponent({
  name: "facts-board",
  props: {
    list: {
      required: true,
      type: Object as () => Array<Fact>,
    },
  },
});
</script>

<style scoped>
  .indented {
    padding-left: 1rem;
  }
</style>
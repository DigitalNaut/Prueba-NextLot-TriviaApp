<template>
  <div class="w-1/2 p-0 m-0 overflow-y-auto bg-white rounded-md">
    <div class="flex flex-col p-4 m-4 text-base text-haiti font-lora">
      <div v-if="list.length">
        <span
          class="flex flex-row justify-end pr-4 text-lg font-semibold text-center"
        >
          Number of facts:
          <span class="ml-3 rounded-full text-haiti w-7 h-7 bg-bombai">{{
            list.length
          }}</span></span
        >
        <ol>
          <li v-for="fact in list" :key="fact.id">
            <ul class="p-8 m-4 text-white rounded-md bg-haiti">
              <li>{{ fact.text }}</li>
              <li class="inline-block text-sm">
                <a href="{{fact.permalink}}" class="italic indented"
                  >Permalink</a
                >
                - {{ fact.language.toUpperCase() }}
              </li>
            </ul>
          </li>
        </ol>
      </div>
      <div
        class="flex items-center justify-center w-full h-full text-xl"
        v-else-if="loaded"
      >
        <p>{{ msg }}</p>
      </div>
      <span
        v-if="!loaded"
        class="flex justify-center p-16 m-4 text-xl text-white rounded-xl bg-bombai"
        >Loading...</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Fact } from "../App.vue";

export default defineComponent({
  name: "facts-board",
  props: {
    msg: {
      required: true,
      type: String,
    },
    list: {
      required: true,
      type: Object as () => Array<Fact>,
    },
    loaded: {
      required: true,
      type: Boolean,
    },
  },
});
</script>

<style scoped>
.indented {
  padding-left: 1rem;
}
</style>

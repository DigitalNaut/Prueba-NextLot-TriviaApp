<template>
  <div
    class="w-full p-0 m-0 overflow-y-auto bg-white rounded-md md:max-w-screen-md xl:max-w-screen-lg"
  >
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
              <li
                class="flex flex-row justify-between px-8 pt-4 text-sm text-havelockBlue"
              >
                Lang: {{ fact.language.toUpperCase() }}

                <span class="justify-self-end">
                  <a href="{{fact.source}}" class="italic"
                    >Src: {{ fact.source }}</a
                  >
                  <span class="px-4">|</span>
                  <a href="{{fact.permalink}}" class="italic"
                    >Permalink</a
                  >
                </span>
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

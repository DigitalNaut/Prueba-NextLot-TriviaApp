<template>
  <div
    class="w-full p-0 pt-12 m-0 overflow-y-auto rounded-md shadow-lg bg-gradient-to-b to-bombai from-white md:w-11/12 xl:max-w-screen-lg"
  >
    <div class="flex flex-col p-4 m-4 text-base font-lora">
      <div
        v-if="!loaded"
        class="flex justify-center p-16 m-4 text-xl text-white rounded-xl bg-bombai animate-pulse"
      >
        Loading...
      </div>
      <div v-if="list.length" class="flex-row text-right">
        <!-- Counter -->
        <span class="px-4 py-2 mr-4 text-white rounded-full lex bg-indigo">
          {{userLanguage === 'de' ? 'Anzahl der Fakten': 'Number of facts'}}:
          <!-- Number -->
          <span class="ml-3 w-7 h-7">
            {{ list.length }}
          </span></span
        >

        <!-- Children -->
        <component :is="children"></component>

        <!-- List of Fact Cards -->
        <ol>
          <li
            v-for="fact in list"
            :key="fact.id"
            class="transition transform opacity-90"
          >
            <!-- Fact card -->
            <ol
              class="px-4 py-12 m-8 text-xl text-center text-white rounded-md shadow-md md:px-8 lg:px-16 bg-haiti"
            >
              <!-- Fact text -->
              <li class="p-8">{{ fact.text }}</li>
              <li
                class="flex flex-row justify-around p-8 text-sm text-havelockBlue"
              >
                <!-- Language -->
                Lang: {{ fact.language.toUpperCase() }}

                <!-- Source & permalink -->
                <span class="justify-self-end">
                  <a
                    :href="fact.source_url"
                    class="italic"
                    target="_blank"
                    rel="”noreferrer"
                    >Src: {{ fact.source }}</a
                  >
                  <span class="px-4">|</span>
                  <a :href="fact.permalink" class="italic">Permalink</a>
                </span>
              </li>
            </ol>
          </li>
        </ol>
      </div>
      <div
        v-else-if="loaded"
        class="box-content flex items-center justify-center w-full h-full py-8 text-xl text-haiti"
      >
        <div
          class="flex justify-center p-16 m-4 text-xl text-haiti rounded-xl bg-bombai"
        >
          {{ msg }}
        </div>
      </div>
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
    userLanguage: {
      type: String,
      required: false,
    },
    list: {
      required: true,
      type: Object as () => Array<Fact>,
    },
    loaded: {
      required: true,
      type: Boolean,
    },
    children: {
      name: "children",
      type: [String, Object],
      default: "div",
      required: false,
    },
  },
});
</script>

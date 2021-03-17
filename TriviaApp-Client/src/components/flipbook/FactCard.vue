<template>
  <div
    v-if="fact"
    class="z-0 flex flex-col items-center justify-center p-8 overflow-y-auto text-xs text-center shadow-sm card sm:text-sm md:text-base lg:text-lg text-haiti font-lora"
  >
    <p
      :class="loaded ? 'hidden' : 'inline-flex'"
      class="box-content absolute p-1 m-4 text-xs italic text-white rounded-full bg-bombai animate-bounce"
    >
      Loading...
    </p>

    <!-- Display the fact if available -->
    <p
      :class="loaded ? 'opacity-100 duration-500' : 'opacity-0 duration-0'"
      class="flex flex-col items-center justify-center transform"
    >
      {{ fact.text }}
      <!-- Display the language -->
      <span
        class="box-content p-1 m-4 text-xs text-white rounded-full bg-indigo"
        :class="loaded && fact.language ? 'opacity-100' : 'opacity-0'"
      >
        {{ fact.language.toUpperCase() }}
      </span>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Fact } from "../../App.vue";

export default defineComponent({
  name: "FactCard",
  props: {
    fact: {
      type: Object as () => Fact || undefined,
      required: true,
    },
    loaded: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

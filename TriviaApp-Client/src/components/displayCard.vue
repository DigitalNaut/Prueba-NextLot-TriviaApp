<template>
  <div
    class="z-0 flex flex-col items-center justify-center overflow-y-auto transform card"
  >
    <span
      :opacity="{ msg }"
      :msg="() => 'changed'"
      class="p-8 text-xs italic text-center duration-300 sm:text-sm md:text-base lg:text-lg text-haiti font-lora"
    >
      <!-- Display the fact if available -->
      {{ msg }}
    </span>
    <span
      v-if="lang && msg"
      class="p-1 m-4 text-xs text-white rounded-full bg-indigo"
    >
      {{ lang }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "display-card",
  data() {
    return {
      theMsg: "...",
      lastMsg: "...",
    };
  },
  props: {
    msg: {
      type: String,
      required: true,
    },
    lang: {
      type: String,
    },
  },
});
</script>

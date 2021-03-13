<template>
  <div class="z-0 flex flex-col items-center justify-center overflow-y-auto transform card">
    <span class="p-8 text-xl italic text-center text-haiti font-lora">
      <!-- Display the fact if available -->
      {{ msg ? msg : "" }}
    </span>
    <span v-if="lang" class="m-4">
      {{ lang ? lang : "" }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "display-card",
  props: {
    msg: {
      type: String,
      required: true,
    },
    lang: {
      type: String,
    }
  },
});
</script>

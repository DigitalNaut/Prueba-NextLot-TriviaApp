<template>
  <div class="z-0 items-center justify-center overflow-y-auto transform card">
    <span class="p-8 text-xl italic text-center text-haiti font-lora">
      <!-- Display the fact if available -->
      {{ msg ? msg : "..." }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "fact-card",
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
});
</script>


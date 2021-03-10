<template>
  <div class="z-0 items-center justify-center transform cursor-pointer card">
    <span class="p-8 text-2xl italic text-center text-haiti font-lora">
      {{ msg }}
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


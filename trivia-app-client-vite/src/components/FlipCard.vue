<template>
  <div
    class="cursor-pointer card"
  >
    <span class="text-3xl italic text-center text-blue-700 font-rockSalt">
      {{ msg }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "FlipCard",
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
});
</script>

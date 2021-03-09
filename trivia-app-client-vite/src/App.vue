<template>
  <div class="app">
    <FlipCard msg="Did you know?"></FlipCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FlipCard from "./components/FlipCard.vue";

export default defineComponent({
  name: "App",
  components: {
    FlipCard,
  },
});
</script>

<template>
  <div
    class="flex p-0 m-0 -mb-12 transition duration-300 transform shadow-lg cursor-pointer"
    @click="
      isNewFactLoaded && $emit('flip-card-click');
      isNewFactLoaded && onClick();
    "
  >
    <FlipCard
      msg="Did you know...?"
      :flipped="isCardFlipped"
      :loaded="loaded"
    />
    <FactCard
      :fact="facts[0]"
      class="rounded-l-xl"
      :loaded="isNewFactLoaded || !isCardFlipped"
    />
    <FactCard :fact="facts[1]" 
      class="rounded-r-xl"
    :loaded="isNewFactLoaded || isCardFlipped" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import FlipCard from "./FlipCard.vue";
import FactCard from "./FactCard.vue";
import { Fact } from "../../App.vue";

export default defineComponent({
  name: "FlipbookDisplay",
  data() {
    return {
      // Data
      facts: [] as Fact[],

      // Presets
      blankFact: {
        id: "",
        text: "It's a fact!",
        language: "",
        source: "",
        source_url: "",
        permalink: "",
        error: "",
      } as Fact,

      // Flags
      isCardFlipped: false,
      isNewFactLoaded: false,
      loaded: false,
    };
  },
  watch: {
    newFact(newFact) {
      if (this.isCardFlipped) this.facts[0] = newFact;
      else this.facts[1] = newFact;

      this.isNewFactLoaded = true;
    },
  },
  components: {
    FlipCard,
    FactCard,
  },
  props: {
    newFact: {
      type: Object as () => Fact,
      required: true,
    },
  },

  mounted() {
    // Add two blank cards on load
    this.facts.push(this.blankFact, this.blankFact);

    // Flags
    this.isNewFactLoaded = true;
    this.loaded = true;
  },
  methods: {
    onClick() {
      this.isNewFactLoaded = false;
      this.isCardFlipped = !this.isCardFlipped;
      console.log(
        "[Flipbook] Flipping flags for isnewFactLoaded & isCardFlipped."
      );
    },
    trace() {
      console.log("<-TRACE->");
    },
  },
});
</script>

<style lang="postcss" scoped></style>

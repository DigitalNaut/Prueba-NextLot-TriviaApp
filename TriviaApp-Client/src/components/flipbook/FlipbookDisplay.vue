<template>
  <div
    class="p-0 m-0 -mb-12 perspective"
    :class="isNewFactLoaded ? 'cursor-pointer' : 'cursor-default'"
    @mouseover="isHovering = true"
    @mouseout="isHovering = false"
    @blur="isHovering = false"
    @click="
      isNewFactLoaded && $emit('flip-card-click');
      isNewFactLoaded && onClick();
    "
  >
    <div
      class="flex transition duration-300 transform shadow-lg"
      :class="isHovering ? 'rotateOnHover' : ''"
    >
      <FlipCard
        :msg="userLanguage === 'de' ? 'Usstest du...?' : 'Did you know...?'"
        :flipped="isCardFlipped"
        :loaded="loaded"
        :hovered="isNewFactLoaded && isHovering"
      />
      <FactCard
        :fact="facts[0]"
        class="rounded-l-xl"
        :loaded="isNewFactLoaded || !isCardFlipped"
      />
      <FactCard
        :fact="facts[1]"
        class="rounded-r-xl"
        :loaded="isNewFactLoaded || isCardFlipped"
      />
    </div>
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
      isHovering: false,
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
    userLanguage: {
      type: String,
      required: false,
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

<style lang="postcss" scoped>
.perspective {
  perspective: 1500px;
}
.rotateOnHover {
  transform: rotateX(10deg);
  @apply shadow-2xl;
}
</style>

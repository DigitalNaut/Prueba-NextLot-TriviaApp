<template>
  <div
    class="absolute z-10 items-center justify-center cursor-pointer card flip-card"
  >
    <div class="flip-card-inner" :class="{ flipped: isFlipped }" @click="toggleState">
      <div class="align-middle cardFace flip-card-front">{{ msg }}</div>
      <div class="align-middle cardFace flip-card-back">{{ msg }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "flip-card",
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isFlipped: false,
    };
  },
  methods: {
    toggleState: function () {
      this.isFlipped = !this.isFlipped;
    },
  },
});
</script>

<style scoped>
/* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
.flip-card {
  background-color: transparent;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.3s;
  transform-style: preserve-3d;
  transform-origin: 50%;
}

/* Do an horizontal flip when you move the mouse over the flip box container */
.flipped {
  transform: rotateY(180deg) translateX(-100%);
}

/* Position the front and back side */
.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
  background-color: #bbb;
  color: black;
}

/* Style the back side */
.flip-card-back {
  background-color: dodgerblue;
  color: white;
  transform: rotateY(180deg);
}
</style>

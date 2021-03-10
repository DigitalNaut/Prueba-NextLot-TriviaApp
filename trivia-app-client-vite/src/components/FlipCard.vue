<template>
  <div class="absolute z-10 origin-right cursor-pointer card flip-card">
    <div
      class="relative flex flex-col w-full h-full align-middle flip-card-inner"
      :class="{ flipped: flippedState }"
      
    >
      <div class="cardFace flip-card-front rounded-2xl">{{ msg }}</div>
      <div class="cardFace flip-card-back rounded-2xl">{{ msg }}</div>
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
    flippedState: {
      type: Boolean,
      required: true
    }
  },
});
</script>

<style scoped>
/* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
.flip-card {
  background-color: transparent;
  perspective: 2000px; /* Remove this if you don't want the 3D effect */
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  transition: transform 0.3s;
  transform-style: preserve-3d;
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
  background-color: #454ebb;
  color: #b2b5c0;
}

/* Style the back side */
.flip-card-back {
  background-color: #b2b5c0;
  color: #454ebb;
  transform: rotateY(180deg);
}
</style>

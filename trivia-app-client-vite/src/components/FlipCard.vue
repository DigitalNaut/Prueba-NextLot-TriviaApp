<template>
  <div class="absolute z-10 origin-right cursor-pointer card flip-card">
    <div
      class="relative flex flex-col w-full h-full flip-card-inner"
      :class="{ flipped: flippedState }"
      
    >
      <div class="text-white cardFace flip-card-front rounded-l-xl bg-indigo">{{ msg }}</div>
      <div class="cardFace flip-card-back rounded-r-xl bg-bombai text-haiti">{{ msg }}</div>
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
/* The flip card container. */
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

/* Style the front side */
.flip-card-front {
}

/* Style the back side */
.flip-card-back {
  transform: rotateY(180deg);
}
</style>

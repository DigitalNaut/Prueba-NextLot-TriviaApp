<template>
  <div class="absolute z-10 card flip-card">
    <div
      class="relative flex flex-col w-full h-full flip-card-inner hover:onHover"
      :class="{
        flipAnimation: flipped,
        hoverL: loaded && hovered && !flipped,
        hoverR: loaded && hovered && flipped,
      }"
    >
      <!-- Card Front -->
      <div class="text-white cardFace flip-card-front rounded-l-xl bg-indigo">
        <!-- Message -->
        <div class="flex flex-row justify-around">
          <span :class="{ 'animate-bounce': loaded && hovered && !flipped }">
            {{ msg }}
          </span>
        </div>
      </div>
      <!-- Card Back -->
      <div class="cardFace flip-card-back rounded-r-xl bg-bombai text-haiti">
        <!-- Message -->

        <div class="flex flex-row justify-around">
          <span :class="{ 'animate-bounce': loaded && hovered && flipped }">
            {{ msg }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FlipCard",
  props: {
    hovered: {
      type: Boolean,
      required: true,
    },
    loaded: {
      type: Boolean,
      required: true,
    },
    msg: {
      type: String,
      required: true,
    },
    flipped: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<style scoped>
/* The flip card container. */
.flip-card {
  background-color: transparent;
  perspective: 1500px; /* 3D effect */
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  transition: transform 0.5s;
  transform-style: preserve-3d;
  transform-origin: right 0;
}

/* Do an horizontal flip when you move the mouse over the flip box container */
.flipAnimation {
  transform: rotateY(180deg);
}
/* Hover */
.onHover {
  transition: transform 0.1s ease-out;
}
.hoverL {
  transform: rotateY(10deg);
}
.hoverR {
  transform: rotateY(170deg);
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

/* Style the back side */
.flip-card-back {
  transform: rotateY(180deg);
}
</style>

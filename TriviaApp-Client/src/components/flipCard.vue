<template>
  <div class="absolute z-10 card flip-card">
    <div
      class="relative flex flex-col w-full h-full flip-card-inner"
      @mouseover="isHovering = true"
      @mouseout="isHovering = false"
      @blur="isHovering = false"
      :class="{
        flipAnimation: flipped,
        'hoverL onHover': loaded && isHovering && !flipped,
        'hoverR onHover': loaded && isHovering && flipped,
      }"
    >
      <!-- Front Card -->
      <div
        class="text-white cardFace flip-card-front rounded-l-xl bg-indigo"
        :class="{ pointer: !flipped }"
      >
        <!-- Message -->
        <div class="flex flex-row justify-around">
          <span :class="{ 'animate-bounce ': isHovering && !flipped && loaded }">
            {{ msg }}
          </span>
        </div>
      </div>
      <!-- Back Card -->
      <div
        class="cardFace flip-card-back rounded-r-xl bg-bombai text-haiti"
        :class="{ pointer: flipped }"
      >
        <div class="flex flex-row justify-around">
          <span :class="{ 'animate-bounce': isHovering && flipped && loaded }">
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
  name: "flip-card",
  data() {
    return {
      isHovering: false,
    };
  },
  props: {
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
.pointer {
  cursor: pointer;
}

/* The flip card container. */
.flip-card {
  background-color: transparent;
  perspective: 1000px; /* 3D effect */
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
  position: relative;
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

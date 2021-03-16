<template>
  <div class="absolute z-50 flex flex-row items-center justify-end w-full px-4 pt-2 md:pr-8 sm:pr-4 lg:pr-16 xl:pr-32">
    <div
      v-if="error"
      class="p-2 my-4 text-xs rounded-lg text-haiti bg-errorRed"
    >
      {{ error }}
    </div>
    <button
      class="p-2 m-2 rounded-lg text-bombai bg-haiti hover:bg-havelockBlue hover:text-haiti border-haiti"
      @click="clearUserId()"
      @v-on:submit.prevent
      :disabled="clearing === true"
    >
      Clear User ID
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { storageAvailable, StorageTypes } from "../utilities/utility";

export default defineComponent({
  name: "HeaderSection",
  data() {
    return {
      clearing: false,
      error: "",
    };
  },
  methods: {
    clearUserId() {
      if (storageAvailable(StorageTypes.localStorage)) {
        window.localStorage.setItem("userId", "");
        location.reload();
      }
    },
  },
});
</script>

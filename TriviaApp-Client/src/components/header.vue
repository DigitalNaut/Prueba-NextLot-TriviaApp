<template>
  <div class="flex flex-row items-center justify-end w-full">
    <div
      v-if="this.error"
      class="p-2 mt-4 mb-4 text-xs rounded-lg text-haiti bg-errorRed"
    >
      {{ this.error }}
    </div>
    <button
      class="p-2 m-4 rounded-lg text-bombai bg-haiti"
      @click="clearUserId()"
      @submit="prevent"
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
  name: "Header",
  data() {
    return {
      clear: false,
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

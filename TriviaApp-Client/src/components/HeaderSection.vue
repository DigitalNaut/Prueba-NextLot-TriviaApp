<template>
  <div
    class="absolute z-50 flex flex-row items-center justify-end w-full px-4 pt-2 md:pr-8 sm:pr-4 lg:pr-16 xl:pr-32"
  >
    <div
      v-if="error"
      class="p-2 my-4 text-xs rounded-lg text-haiti bg-errorRed"
    >
      {{ error }}
    </div>
    <button
      class="p-2 m-2 rounded-lg text-bombai bg-haiti hover:bg-havelockBlue hover:text-haiti border-haiti"
      @click="clearUserId()"
      @submit.prevent
      :disabled="clearing === true"
    >
      Clear User ID
    </button>
    <button
      class="box-content flex flex-row rounded-lg justify-items-start place-items-center text-haiti bg-haiti hover:bg-bombai hover:text-haiti border-haiti"
      @click="$emit('cycle-language')"
      @submit.prevent
      :disabled="clearing === true"
    >
      <div
        v-for="language in languages.slice(1)"
        :key="language"
        class="z-10 p-2"
      >
        {{ language.toUpperCase() }}
      </div>
      <div
        class="absolute z-0 h-8 transform rounded-md w-9 bg-havelockBlue"
        :class="
          Object.values(languages).indexOf(userLanguage)-1 === 1
            ? 'translate-x-full'
            : ''
        "
      ></div>
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
  props: {
    languages: {
      type: Object as () => String[],
      required: true,
    },
    userLanguage: {
      type: String,
      required: true,
    },
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

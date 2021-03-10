<template>
  <div class="cursor-pointer card">
    <span class="text-3xl italic text-center text-blue-700 font-rockSalt">
      {{ msg }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FlipCard",
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  methods: {
    async getFact() {
      const apiCall = await fetch("http://localhost:3000/user/1/facts/new");
      const data: JSON = await apiCall.json();

      console.log("Api data:", data)
    },
    onClick() {
      
    }
  },
  async mounted() {
    await this.getFact();
  },
});
</script>

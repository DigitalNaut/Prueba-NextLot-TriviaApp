<template>
  <div class="app">
    <div class="flex flex-row h-52">
      <FlipCard msg="Did you know?" @click="this.flipCard()"></FlipCard>
      <FactCard :msg="fact1"></FactCard>
      <FactCard :msg="fact2"></FactCard>
    </div>
    <FactsBoard :list="this.factsList"></FactsBoard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FlipCard from "./components/flipCard.vue";
import FactsBoard from "./components/factsBoard.vue";
import FactCard from "./components/factCard.vue";

export interface Fact {
  id: string;
  text: string;
  language: string;
  source: string;
  source_url: string;
  permalink: string;
}

export default defineComponent({
  name: "app",
  data: function () {
    return {
      factsList: new Array<Fact>(),
      fact1: "",
      fact2: "",
    };
  },
  components: {
    FlipCard,
    FactsBoard,
    FactCard,
  },
  methods: {
    handleError(error: string) {
      console.error(error);
    },
    updateFact() {
      //
    },
    displayFact(text: string) {
      // Flip between card displays
      if (this.fact1 === "") {
        this.fact1 = text;
        this.fact2 = "";
      } else {
        this.fact2 = text;
        this.fact1 = "";
      }
    },
    async flipCard() {
      let fact: Fact = await this.fetchFact();

      // Safeguard
      if (!fact) return this.handleError("No fact received.");

      // Update table list
      this.factsList.push(fact);
      console.log(this.factsList.length);

      // Display the fact
      this.displayFact(fact.text);
    },
    fetchFact(): Promise<Fact> {
      return new Promise(async (resolve, reject) => {
        try {
          // Call local Trivia API
          const apiCall = await fetch("http://localhost:3000/user/1/facts/new");
          const json = await apiCall.json();

          // Log results
          console.log("Api call:", apiCall);
          // If server error, throw error
          if (json.error) {
            console.log("Server error:", json.error);
            this.handleError("External server error");
            reject(null);
          } else console.log("Response:", json.fact);

          // Resolve
          resolve(json.fact);

          // Handle errors
        } catch (error) {
          console.log("Error ocurred fetching data:", error);
          reject(null);
        }
      });
    },
  },
});
</script>

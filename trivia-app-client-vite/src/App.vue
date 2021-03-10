<template>
  <div class="app">
    <div class="flex flex-row h-52">
      <FlipCard
        msg="Did you know?"
        :flippedState="isFlipped"
        @click="this.flipCard()"
      ></FlipCard>
      <FactCard :msg="fact1" class="rounded-l-xl"></FactCard>
      <FactCard :msg="fact2" class="rounded-r-xl"></FactCard>
    </div>
    <FactsBoard
      msg="Click on the blue card to start learning new facts!"
      :list="this.factsList"
    ></FactsBoard>
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
  error?: string;
}

export default defineComponent({
  name: "app",
  data: function () {
    return {
      factsList: new Array<Fact>(),
      fact1: "",
      fact2: "It's a fact!", // Start message
      isFlipped: false,
    };
  },
  components: {
    FlipCard,
    FactsBoard,
    FactCard,
  },
  methods: {
    // Log errors
    handleError(error: string) {
      console.error(error);
    },
    displayFact(text: string) {
      // Flip between card displays
      if (this.fact1 === "") {
        this.fact1 = text;
        this.fact2 = "";
        this.isFlipped = true;
      } else {
        this.fact2 = text;
        this.fact1 = "";
        this.isFlipped = false;
      }
    },
    async flipCard() {
      // Get a new fact
      let fact: Fact = await this.fetchFact();

      // Safeguard
      if (!fact) return this.handleError("No fact received.");

      // Update table list
      this.factsList.unshift(fact);
      console.log(this.factsList.length);

      // Display the fact
      this.displayFact(fact.text);
    },
    fetchFact(): Promise<Fact> {
      return new Promise<Fact>(async (resolve, reject) => {
        try {
          // Log activity
          console.log("Fetching fact from server...");

          // Call local Trivia API
          const apiCall:Response = await fetch("http://localhost:3000/user/1/facts/new");
          console.log(`Repsonse type: ${typeof apiCall.json}`);

          console.log("Response text: ")

          const json = await apiCall.json();

          // Log results
          console.log("JSON parsed:", json);

          // If server error, throw error
          if (json.error) {
            console.log(`Server error: ${json.error}`);
            this.handleError("External server error");
            reject(null);
          } else {
            // Log & resolve fact
            console.log(`Response: ${json.fact}`);
            resolve(json.fact);
          }

          // Handle errors & reject
        } catch (error) {
          this.handleError(`Error ocurred fetching data: ${error}`);
          reject(null);
        }
      });
    },
  },
});
</script>

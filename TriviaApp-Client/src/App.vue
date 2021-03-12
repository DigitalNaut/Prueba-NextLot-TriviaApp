<template>
  <div class="app">
    <div class="flex p-0 m-0 place-items-center h-half">
      <FlipCard
        msg="Did you know...?"
        :flippedState="isFlipped"
        @click="this.flipCard()"
      ></FlipCard>
      <FactCard :msg="fact1" :lang="factLang" class="rounded-l-xl"></FactCard>
      <FactCard :msg="fact2" :lang="factLang" class="rounded-r-xl"></FactCard>
    </div>
    <FactsBoard
      class="h-half"
      msg="Click on the blue card to get the facts!"
      :list="this.factsList"
    ></FactsBoard>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";

import { storageAvailable, StorageTypes } from "./utilities/utility";

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
      fact2: "It's a fact!", // Start message,
      factlang: "",
      isFlipped: false,
      userId: "",
    };
  },
  components: {
    FlipCard,
    FactsBoard,
    FactCard,
  },
  methods: {
    // Log errors
    handleError(error: Error) {
      console.error(error);
    },
    displayFact(text: string, language: string) {
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

      this.factlang = language;
    },
    async flipCard() {
      // Get a new fact
      let fact: Fact = await this.fetchFact();

      // Safeguard
      if (!fact) return this.handleError(new Error("No fact received."));

      // Update table list
      this.factsList.unshift(fact);

      // Display the fact
      console.log(fact.language);
      this.displayFact(fact.text, fact.language.toUpperCase());
    },
    async fetchUserId() {
      // Retrieve userId from memory
      if (storageAvailable(StorageTypes.localStorage)) {
        let storedUserId = window.localStorage.getItem("userId");
        console.log(`Stored user ID: ${storedUserId}`);
        if (storedUserId) {
          this.userId = storedUserId;
        } else {
          // Otherwise, call API for new userId
          console.log("Fetching user Id...");
          const apiCall = await axios.get("http://localhost:3000/user/new");
          this.userId = apiCall.data.userId;
          console.log(`New user ID: ${this.userId}`);

          // Store the new ID
          window.localStorage.setItem("userId", this.userId);
        }

        // Errors
      } else {
        this.handleError(new Error("Local storage is not available."));
      }
    },
    async fetchPreviousFacts(userId: string): Promise<[]> {
      try {
        const apiCall = await axios.get(
          `http://localhost:3000/user/${userId}/facts/all`
        );
        let data = apiCall?.data?.facts;
        console.log("Fetched previous User Facts:", data);

        return data;
      } catch (error) {
        this.handleError(new Error("Could not fetch previous User Facts."));
        return [];
      }
    },

    fetchFact(): Promise<Fact> {
      return new Promise<Fact>(async (resolve, reject) => {
        try {
          // Log activity
          console.log("Fetching fact from server...");

          if (!this.userId) {
            console.log("UserId is not valid.");
            reject(null);
          }

          // Call local Trivia API
          const apiCall = await axios.get(
            `http://localhost:3000/user/${this.userId}/facts/new`
          );
          const data = apiCall.data;

          // Log results
          console.log(`Repsonse type: ${apiCall.data} Data: ${data}`);

          // If server error, throw error
          if (!data) {
            console.log(`Server response not a JSON.`);
            this.handleError(new Error("External server error"));
            reject(null);
          } else {
            // Log & resolve fact
            console.log(`Response: ${data.fact}`);
            resolve(data.fact);
          }

          // Handle errors & reject
        } catch (error) {
          this.handleError(new Error(`Error ocurred fetching data: ${error}`));
          reject(null);
        }
      });
    },
  },

  async mounted() {
    await this.fetchUserId();
    await this.fetchPreviousFacts(this.userId);
  },
});
</script>

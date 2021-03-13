<template>
  <div class="flex flex-col app">
    <div
      class="flex flex-col justify-around w-full p-0 m-0 align-middle place-items-center h-half"
    >
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
        >
          Clear User ID
        </button>
      </div>
      <div class="flex p-0 m-0">
        <FlipCard
          msg="Did you know...?"
          :flippedState="isFlipped"
          @click="this.flipCard()"
        ></FlipCard>
        <DisplayCard :msg="fact1" :lang="factLang" class="rounded-l-xl"></DisplayCard>
        <DisplayCard :msg="fact2" :lang="factLang" class="rounded-r-xl"></DisplayCard>
      </div>
    </div>
    <FactsBoard
      class="h-half"
      msg="Click on the blue card to get the facts!"
      :list="this.factsList"
      :loaded="loadedFacts"
    ></FactsBoard>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";

import { storageAvailable, StorageTypes } from "./utilities/utility";

import FlipCard from "./components/flipCard.vue";
import FactsBoard from "./components/factsBoard.vue";
import DisplayCard from "./components/displayCard.vue";

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
      loadedFacts: false,
      factsList: new Array<Fact>(),
      fact1: "",
      fact2: "It's a fact!", // Start message,
      factlang: "",
      isFlipped: false,
      userId: "",
      error: "",
    };
  },
  components: {
    FlipCard,
    FactsBoard,
    DisplayCard,
  },
  methods: {
    // Log errors
    handleError(error: Error, msg?: string) {
      this.error = `${msg ? msg + ": " : ""}` + `${error ? error.message : ""}`;
    },
    clearUserId() {
      if (storageAvailable(StorageTypes.localStorage)) {
        window.localStorage.setItem("userId", "");
        location.reload();
      }
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
      let fact: Fact = await this.fetchNewFact();

      // Safeguard
      if (!fact) return this.handleError(new Error("No fact received."));

      // Update table list
      this.factsList.unshift(fact);

      // Display the fact
      console.log(fact.language);
      this.displayFact(fact.text, fact.language.toUpperCase());
    },
    async fetchUserId(): Promise<void> {
      return new Promise<void>(async (resolve, reject) => {
        try {
          // Retrieve userId from memory
          if (storageAvailable(StorageTypes.localStorage)) {
            let storedUserId = window.localStorage.getItem("userId");
            console.log(`Stored user ID: ${storedUserId}`);
            if (storedUserId) {
              this.userId = storedUserId;
            } else {
              // Otherwise, call API for new userId
              console.log("Fetching user Id...");
              const newUser = await axios
                .get("http://localhost:3000/user/new")
                .then((value) => value.data)
                .catch((reason) =>
                  this.handleError(
                    new Error(reason),
                    "Could not fetch new user ID."
                  )
                );

              if (!newUser)
                throw new Error(`Could not get new user ID from server.`);
              else if (!newUser.userId)
                throw new Error(
                  `Invalid user ID (${newUser ? newUser.userId : newUser})`
                );

              this.userId = newUser.userId;
              console.log(`New user ID: ${this.userId}`);

              // Store the new ID
              window.localStorage.setItem("userId", this.userId);
            }

            resolve();
            // Errors
          } else {
            throw new Error("Local storage is not available.");
          }
        } catch (error) {
          this.handleError(error);
          reject();
        }
      });
    },
    async fetchPreviousFacts(userId: string): Promise<Fact[]> {
      return new Promise<Fact[]>(async (resolve, reject) => {
        try {
          console.log(`Calling http://localhost:3000/user/${userId}/facts/all`);
          const previousFacts: Fact[] = await axios
            .get(`user/${userId}/facts/all`, {
              method: "GET",
              baseURL: "http://localhost:3000",
              timeout: 3000,
            })
            .then((value) => {
              return value.data.facts;
            })
            .catch((reason) => {
              this.handleError(reason, "Could not connect to API");
              resolve([]);
            });

          console.log(`Prev facts:`, previousFacts);
          resolve(previousFacts);
        } catch (error) {
          this.handleError(new Error("Could not retrieve fact history"));
          reject([]);
        }
      });
    },
    async fetchNewFact(): Promise<Fact> {
      return new Promise<Fact>(async (resolve, reject) => {
        try {
          // Log activity
          console.log("Fetching fact from server...");

          if (!this.userId) {
            console.log("UserId is not valid.");
            reject(null);
          }

          // Call local Trivia API
          const apiCall = await axios.get(`/user/${this.userId}/facts/new`, {
            method: "GET",
            baseURL: "http://localhost:3000",
            timeout: 3000,
          });
          const data = apiCall.data;

          // Log results
          console.log(`New factoid:`, data);

          // If server error, throw error
          if (!data) {
            console.log(`Server response not a JSON.`);
            this.handleError(
              new Error("External server error: unknown format received.")
            );
            reject(null);
          } else {
            // Resolve fact
            resolve(data.fact);
          }

          // Handle errors & reject
        } catch (error) {
          this.handleError(new Error(`Could not connect to API.`));
          reject(null);
        }
      });
    },
  },

  async mounted() {
    await this.fetchUserId();
    this.factsList = await this.fetchPreviousFacts(this.userId);
    this.loadedFacts = true;
  },
});
</script>

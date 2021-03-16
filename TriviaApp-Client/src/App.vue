<template>
  <div class="flex flex-col app">
    <div
      class="flex flex-col w-full h-full min-h-screen p-0 m-0 mt-12 align-middle place-items-center"
    >
      <Header />
      <FlipbookDisplay
        @flip-card-click="addNewFactToFlipbook()"
        :newFact="newestFact"
      />
      <FactsBoard
        msg="Click on the blue card to get the facts!"
        :list="factsList"
        :loaded="areFactsLoaded"
      />
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";

import { storageAvailable, StorageTypes } from "./utilities/utility";

import FactsBoard from "/@/components/FactsBoard.vue";
import FlipbookDisplay from "/@/components/flipbook/FlipbookDisplay.vue";
import Header from "/@/components/HeaderSection.vue";

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
  data() {
    return {
      // Flags
      areFactsLoaded: false,

      // State
      newestFact: {} as Fact,
      factsList: new Array<Fact>(),
      userId: "",
      error: "",
    };
  },
  components: {
    Header,
    FlipbookDisplay,
    FactsBoard,
  },
  methods: {
    // Log errors
    handleError(error: Error, msg?: string) {
      this.error = `${msg ? msg + ": " : ""}` + `${error ? error.message : ""}`;
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
                .get("http://192.168.100.7:3000/user/new")
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
          console.log(
            `Calling http://192.168.100.7:3000/user/${userId}/facts/all`
          );
          const previousFacts: Fact[] = await axios
            .get(`user/${userId}/facts/all`, {
              method: "GET",
              baseURL: "http://192.168.100.7:3000",
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

          if (!this.userId) throw new Error("UserId is not valid.");

          let baseURL = "http://192.168.100.7:3000";

          console.log(`Calling: GET ${baseURL}`);
          // Call local Trivia API
          const apiCall = await axios.get(`/user/${this.userId}/facts/new`, {
            method: "GET",
            baseURL,
            timeout: 3000,
          });
          const factoid = apiCall.data;

          // Log results
          console.log(`New factoid:`, factoid);

          // If server error, throw error
          if (!factoid)
            this.handleError(
              new Error("External server error: Server response not a JSON.")
            );
          // Resolve fact
          else resolve(factoid.fact);

          // Handle errors & reject
        } catch (error) {
          this.handleError(new Error(`Could not connect to API.`));
          reject(null);
        }
      });
    },
    async addNewFactToFlipbook() {
      try {
        // Fetch new fact from server & add it first on stack
        let aNewFact: Fact = await this.fetchNewFact();
        this.factsList.unshift(aNewFact);
        console.log("Added a new NewFact to Flipbook:", aNewFact.id);

        // Update state
        this.newestFact = aNewFact;
        
        // Error Handling
      } catch (error) {
        this.handleError(error, `Could not add new fact to Flipbook: ${error}`);
      }
    },
  },

  async mounted() {
    // Get user's ID
    await this.fetchUserId();
    this.factsList = await this.fetchPreviousFacts(this.userId);

    // Set flags
    this.areFactsLoaded = true;
  },
});
</script>

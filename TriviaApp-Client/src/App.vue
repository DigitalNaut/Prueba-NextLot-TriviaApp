<template>
  <div class="flex flex-col app">
    <div
      class="flex flex-col w-full h-full min-h-screen p-0 m-0 mt-12 align-middle place-items-center"
    >
      <HeaderSection
        @cycle-language="changeLanguage()"
        :languages="languages"
        :userLanguage="userLanguage"
      />
      <FlipbookDisplay
        @flip-card-click="addNewFactToFlipbook()"
        :newFact="newestFact"
        :userLanguage="userLanguage"
      />
      <FactsBoard
        msg="Click on the blue card to get the facts!"
        :list="factsList"
        :loaded="areFactsLoaded"
        :userLanguage="userLanguage"
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
import HeaderSection from "/@/components/HeaderSection.vue";

export interface Fact {
  id: string;
  text: string;
  language: string;
  source: string;
  source_url: string;
  permalink: string;
  error?: string;
}

export enum Language {
  NONE = "none",
  EN = "en",
  DE = "de",
}

const languages: Language[] = Object.values(Language);

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
      languages,
      userLanguage: Language.EN,
    };
  },
  components: {
    HeaderSection,
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

          if (!this.userId) throw new Error("UserId is not valid.");

          let customUrl = "http://localhost:3000";
          customUrl += `/user/${this.userId}/facts/new`;
          customUrl += `${
            this.userLanguage ? `/lang/${this.userLanguage}` : ""
          }`;
          let baseURL = customUrl;

          console.log(`Calling: GET ${baseURL}`);
          // Call local Trivia API
          const apiCall = await axios.get(customUrl, {
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
    changeLanguage() {
      if (languages.length <= 0)
        this.handleError(new Error(`Languages not defined: ${languages}`));

      let langs = languages.slice(1);
      let index = langs.indexOf(this.userLanguage);
      this.userLanguage = langs[(index + 1) % langs.length];

      console.log(`User pref. language: ${this.userLanguage.toUpperCase()}`);
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

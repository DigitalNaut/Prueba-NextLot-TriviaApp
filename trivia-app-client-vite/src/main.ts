import { createApp } from "vue";
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueRouter from "vue-router";

import App from "./App.vue";
import "./assets/index.css";

const app = createApp(App);
app.use(VueAxios, axios);
app.use(VueRouter)
app.mount("#app");

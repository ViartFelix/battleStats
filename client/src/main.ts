import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

loadFonts();

import { createPinia } from "pinia";
const pinia = createPinia();

import { globalCookiesConfig } from "vue3-cookies";
globalCookiesConfig({
	expireTimes: "30d",
	path: "/",
	domain: "",
	secure: true,
	sameSite: "None",
});

createApp(App).use(router).use(vuetify).use(pinia).mount("#app");

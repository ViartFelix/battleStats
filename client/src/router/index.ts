import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import ProfileView from "@/views/ProfileView.vue";
import RegisterLoginView from "@/views/RegisterLogin.vue";

import RegisterLayout from "@/layouts/registerLogin/Register.vue";
import LoginLayout from "@/layouts/registerLogin/Login.vue";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "home",
		component: HomeView,
	},
	{
		path: "/profile",
		name: "profile",
		component: ProfileView,
	},
	{
		path: "/register",
		name: "registerView",
		component: RegisterLoginView,
		children: [
			{
				path: "",
				component: RegisterLayout,
			},
		],
	},
	{
		path: "/login",
		name: "loginView",
		component: RegisterLoginView,
		children: [
			{
				path: "",
				component: LoginLayout,
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;

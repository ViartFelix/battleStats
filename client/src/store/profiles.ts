import { defineStore } from "pinia";

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import axios, { AxiosError, AxiosResponse } from "axios";

import { serverResponse, cookieCredidentials } from "./storeTypes";

export const userStore = defineStore("user", {
	state: () => ({
		token: String(),
		expiresIn: Number(),
		isLoggedIn: Boolean(false),
		details: {},

		rememberMe: Boolean(false),

		credidentials: {},
	}),
	actions: {
		storeLogin(
			response: serverResponse,
			rememberMe: boolean,
			credidentials: cookieCredidentials
		): void {
			this.doLogin(response);

			this.rememberMe = rememberMe;
			this.credidentials = credidentials;

			if (rememberMe) {
				this.makeRemember();
			}

			this.isLoggedIn = true;
		},

		makeRemember(): void {
			cookies.set("auth-login", this.credidentials as string);
		},

		rememberAuth(): boolean {
			try {
				const credits = cookies.get(
					"auth-login"
				) as unknown as cookieCredidentials;

				console.log(credits);

				if (credits != undefined) {
					axios
						.post("http://localhost:8000/auth/login", {
							username: credits.username,
							password: credits.password,
						})
						.then((r: AxiosResponse) => {
							this.doLogin(r.data as serverResponse);

							return true;
						})
						.catch((e: AxiosError) => {
							console.log(e);
							return false;
						});
				}

				return true;
			} catch (e) {
				console.log(e);

				return false;
			}
		},

		doLogin(r: serverResponse): void {
			this.token = r.token;
			this.expiresIn = r.expiresIn;
			this.details = r.user;

			this.isLoggedIn = true;
		},

		doLogout(): void {
			this.isLoggedIn = false;

			this.token = String();
			this.expiresIn = Number();
			this.details = {};
		},
	},
});

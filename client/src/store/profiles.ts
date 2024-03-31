import { createStore } from "vuex";

export default createStore({
	state: {
		user: {},
		token: String(undefined),
	},
	getters: {},
	mutations: {
		updateUser: function (state, userInfos: object): void {
			state.user = userInfos;
		},
		updateToken: function (state, token: string): void {
			state.token = token;
		},
	},
	actions: {},
	modules: {},
});

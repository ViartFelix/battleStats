<script lang="ts">
import { userStore } from "@/store/profiles";
import * as pinia from "pinia";

import { defineComponent } from "vue";
import { Icon } from "@iconify/vue";
import router from "@/router";

export default defineComponent({
	name: "HeaderComp",
	components: {
		Icon,
	},
	data() {
		return {
			searchTextModel: "",
			profileImg: "index.jpg",
		};
	},
	computed: {
		...pinia.mapState(userStore, ["details", "isLoggedIn"]),
	},
	methods: {
		search() {
			router.push({
				path: "/search",
				query: { query: this.searchTextModel },
			});
		},
		...pinia.mapActions(userStore, ["doLogout"]),
	},
});
</script>

<template>
	<header class="header">
		<div class="header-wrapper">
			<div class="header-contents">
				<nav class="header-site-links">
					<RouterLink to="/" class="main-logo"
						>BATTLE<br />STATS</RouterLink
					>

					<v-menu open-on-click open-on-focus open-on-hover>
						<template v-slot:activator="{ props }">
							<span class="dashboard-dropdown" v-bind="props">
								Dashboards
								<Icon
									class="dashboard-dropdown-icon"
									icon="mdi:chevron-down"
								/>
							</span>
						</template>

						<v-list class="__v-list-container__">
							<v-list-item>
								<RouterLink to="/dashboard/public"
									>Public</RouterLink
								>
							</v-list-item>
							<v-list-item>
								<RouterLink to="/dashboard/private"
									>Private</RouterLink
								>
							</v-list-item>
						</v-list>
					</v-menu>

					<RouterLink
						class="my-teams-link"
						to="/slots"
						v-if="isLoggedIn"
						>My teams</RouterLink
					>

					<RouterLink to="/units">All units</RouterLink>
				</nav>

				<div class="search-bar">
					<div class="search-bar-wrapper">
						<v-text-field
							label="Search for users' name/ID..."
							append-inner-icon="mdi-magnify"
							variant="underlined"
							clearable
							v-model="searchTextModel"
							@click:append-inner="search"
						/>
					</div>
				</div>

				<div class="auth profile-container" v-if="isLoggedIn">
					<RouterLink
						class="profile-link internal-link"
						to="/profile"
					>
						<img
							class="profile-img"
							:src="require('@/assets/pp_test.jpg')"
						/>
						My profile
					</RouterLink>
					<Icon
						@click="doLogout"
						class="logout-btn"
						color="red"
						icon="material-symbols:logout"
					/>
				</div>

				<div class="unAuth profile-container" v-else>
					<RouterLink
						class="register-link internal-link"
						to="/register"
					>
						Register
					</RouterLink>
					<RouterLink class="login-link internal-link" to="/login">
						<v-btn type="flat" color="#F77F00">Login</v-btn>
					</RouterLink>
				</div>
			</div>
		</div>
	</header>
</template>

<style lang="scss">
@import "@/scss/header/index.scss";
</style>

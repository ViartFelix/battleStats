<script lang="ts">
import { userStore } from "@/store/profiles";
import * as pinia from "pinia";

import { Icon } from "@iconify/vue";
import axios, { AxiosResponse } from "axios";
import { defineComponent } from "vue";
import { cookieCredidentials } from "@/store/storeTypes";

export default defineComponent({
	components: {
		Icon,
	},
	computed: {
		...pinia.mapState(userStore, ["token"]),
	},
	data() {
		return {
			isFormValid: false,
			isAPIContacting: false,

			username: undefined,
			password: undefined,

			rememberMe: false,

			isPasswordShown: false,

			usernameRules: [
				(value: string) => {
					if (value && value.length > 0) return true;
					else return "Please enter your username.";
				},
			],

			passwordRules: [
				(value: string) => {
					if (value && value.length > 0) return true;
					else return "Please enter your password.";
				},
			],
		};
	},
	methods: {
		submitHandler(): void {
			this.isAPIContacting = true;

			axios
				.post("http://localhost:8000/auth/login", {
					username: this.username,
					password: this.password,
				})
				.then((r: AxiosResponse) => {
					const data = r.data;

					const credidentials: cookieCredidentials = {
						username: this.username as unknown as string,
						password: this.password as unknown as string,
					};

					this.storeLogin(data, this.rememberMe, credidentials);

					this.$router.push({ path: "/", force: true });
				})
				.catch((e) => {
					console.log(e);
				})
				.finally(() => {
					this.isAPIContacting = false;
				});
		},
		...pinia.mapActions(userStore, ["storeLogin"]),
	},
});
</script>

<template>
	<v-card-title class="card-title">Login to your account</v-card-title>
	<v-card-text class="card-text-container">
		<v-img src="/google-btn.png" class="google-btn __temp" />
		<v-divider class="separator border-opacity-100" />

		<v-form
			class="form-container"
			fast-fail
			@submit.prevent="submitHandler"
			v-model="isFormValid"
		>
			<v-text-field
				v-model="username"
				label="Username"
				variant="outlined"
				:rules="usernameRules"
			/>

			<v-text-field
				v-model="password"
				label="Password"
				variant="outlined"
				:rules="passwordRules"
				:type="isPasswordShown ? 'text' : 'password'"
			>
				<template v-slot:append>
					<Icon
						@click="isPasswordShown = !isPasswordShown"
						:icon="isPasswordShown ? 'mdi:eye' : 'mdi:eye-off'"
					/>
				</template>
			</v-text-field>

			<p style="text-align: center">
				<v-btn
					type="submit"
					color="#F77F00"
					:loading="isAPIContacting"
					:disabled="!isFormValid"
				>
					Login
				</v-btn>

				<v-checkbox
					class="remember-me-btn"
					v-model="rememberMe"
					label="Remember me ?"
				></v-checkbox>
			</p>
		</v-form>

		<p class="account-switch">
			Don't have an account ?
			<router-link to="/register">Register</router-link>
		</p>
	</v-card-text>
</template>

<style lang="scss" scoped>
@import "../../scss/loginRegister/login.scss";
</style>
this.username as unknownthis.password as unknownthis.username as
unknownthis.password as unknown

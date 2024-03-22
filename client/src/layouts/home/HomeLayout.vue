<script lang="ts">
import { defineComponent } from "vue";
import mainScreen from "@/components/home/mainScreen.vue";
import homeCards from "@/components/home/homeCards.vue";

export default defineComponent({
	name: "HomeLayout",
	components: {
		mainScreen,
		homeCards,
	},
});
</script>

<template>
	<div class="container">
		<mainScreen />
		<homeCards />
	</div>
</template>

<style lang="scss" scoped>
@import "../../scss/home/index-home.scss";
</style>

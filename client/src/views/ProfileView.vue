<script lang="ts" setup>
import BG from "@/components/common/BG.vue";
</script>

<template>
	<div class="main">Bonsoir</div>

	<BG
		:visible="true"
		:src="require('../assets/img_video_accueil.webp')"
		type="img"
	/>
</template>

<style lang="scss" scoped>
div.main {
	position: relative;
	min-height: 100vh;
}
</style>

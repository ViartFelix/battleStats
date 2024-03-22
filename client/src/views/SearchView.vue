<script lang="ts">
import { defineComponent } from "vue";

// Components
import QueryRecite from "@/components/search/QueryRecite.vue";

export default defineComponent({
	name: "QueryTest",

	components: {
		QueryRecite,
	},
});
</script>

<template>
	<QueryRecite />
</template>

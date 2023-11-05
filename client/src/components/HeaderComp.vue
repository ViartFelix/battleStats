<script lang="ts">
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
  methods: {
    search() {
      router.push({
        path: "/search",
        query: { query: this.searchTextModel },
      });
    },
  },
});
</script>

<template>
  <header class="header">
    <div class="header-wrapper">
      <div class="header-contents">
        <nav class="header-site-links">
          <RouterLink to="/" class="main-logo">BATTLE<br />STATS</RouterLink>

          <v-menu open-on-click open-on-focus open-on-hover>
            <template v-slot:activator="{ props }">
              <span class="dashboard-dropdown" v-bind="props">
                Dashboards
                <Icon class="dashboard-dropdown-icon" icon="mdi:chevron-down" />
              </span>
            </template>

            <v-list class="__v-list-container__">
              <v-list-item>
                <RouterLink to="/dashboard/public">Public</RouterLink>
              </v-list-item>
              <v-list-item>
                <RouterLink to="/dashboard/private">Private</RouterLink>
              </v-list-item>
            </v-list>
          </v-menu>

          <RouterLink class="my-teams-link" to="/slots">My teams</RouterLink>

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

        <div class="auth">
          <RouterLink class="profile-link" to="/profile">
            <img class="profile-img" :src="require('@/assets/pp_test.jpg')" />
            My profile
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss">
@import "../scss/header/index.scss";
</style>

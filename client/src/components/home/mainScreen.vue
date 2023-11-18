<script lang="ts">
import { Icon } from "@iconify/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "mainScreen",
  components: {
    Icon,
  },
});
</script>

<template>
  <div class="main-screen">
    <div class="screen-container">
      <div class="container-grid">
        <div class="titles">
          <h1>BATTLE STATS</h1>
          <h2>Making strategies and teams in battle cats easier and better.</h2>
          <router-link to="/slots">
            <v-btn type="flat" color="#F77F00"> Make my teams </v-btn>
          </router-link>
        </div>
        <v-img
          class="img-logo"
          aspect-ratio="1/1"
          :height="300"
          src="../../assets/logo_temp.png"
        />
      </div>
    </div>
    <Icon class="down-btn" icon="mdi:chevron-double-down" />
  </div>
</template>

<style lang="scss" scoped>
@import "../../scss/home/home_main-screen.scss";
</style>

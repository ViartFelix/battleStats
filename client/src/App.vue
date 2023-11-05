<script lang="ts">
import { defineComponent } from "vue";
import HeaderComp from "./components/HeaderComp.vue";

export default defineComponent({
  name: "App",
  components: {
    HeaderComp,
  },
  data() {
    return {
      //
    };
  },
});
</script>

<template>
  <v-app>
    <v-main>
      <HeaderComp />
      <router-view />
    </v-main>
  </v-app>
</template>

<style lang="scss">
//Quicksand
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap");

//Public sans
@import url("https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

:root {
  font-size: 16px !important;
}
* {
  font-size: 1rem;
  font-family: "Public Sans", sans-serif;
}
</style>

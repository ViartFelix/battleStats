<script lang="ts">
import BG from "@/components/common/BG.vue";

import { defineComponent } from "vue";

export default defineComponent({
  name: "registerLogin",
  components: {
    BG,
  },
  data() {
    return {
      page: new String(this.$route.path),
    };
  },
});
</script>

<template>
  <div class="main">
    <div class="container" role="div">
      <v-card width="640" class="card-container">
        <router-view></router-view>
      </v-card>
    </div>
  </div>

  <BG
    :visible="true"
    :src="require('../assets/img_video_accueil.webp')"
    type="img"
  />
</template>

<style lang="scss" scoped>
@import "@/scss/loginRegister/index.scss";
div.main {
  position: relative;
  //min-height: 100vh;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "BG_comp",
  props: {
    visible: {
      type: Boolean,
      required: false,
    },

    src: {
      type: String,
      required: true,
    },

    type: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      fileExt: "",
    };
  },
  mounted() {
    this.fileExt = this.getFileExt(this.$props.src);
  },
  methods: {
    getFileExt(fileName: string): string {
      return fileName.split(".")[0];
    },
  },
});
</script>

<template>
  <div class="__BG">
    <div class="BG-wrapper" v-if="$props.visible">
      <template v-if="$props.type == 'img'">
        <v-img class="target-img" cover :src="$props.src" />
      </template>

      <template v-else-if="$props.type == 'video'"></template>

      <template v-else></template>
    </div>
    <span class="BG-filter"></span>
  </div>
</template>

<style lang="scss" scoped>
@import "@/scss/vars.scss";

div.__BG {
  background: rgba(0, 18, 35, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;

  div.BG-wrapper {
    filter: blur(20px);
    width: 100%;
    height: 100%;

    .target-img {
      width: 100%;
      height: 100%;
    }
  }

  span.BG-filter {
    position: absolute;
    width: calc(100vw + 20px);
    height: calc(100vh + 20px);
    top: -10px;
    left: -10px;
    z-index: 101;
    background-color: rgba($color: $black, $alpha: 0.6);
  }
}
</style>

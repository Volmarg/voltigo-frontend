<template>
  <a
      href="https://github.com/Volmarg/voltigo-frontend"
      target="_blank"
      class="hover:opacity-70"
  >
    <GitHub
        :width="widthAndHeight"
        :height="widthAndHeight"
        color="white"
    />
  </a>
</template>

<script lang="ts">

import GitHub from "@/components/Ui/Icons/Svg/GitHub.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";
export default {
  data(): ComponentData {
    return {
      widthAndHeight: 26,
    }
  },
  components: {
    GitHub
  }
}
</script>

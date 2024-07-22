<template>
  <NoResultsText />
  <div class="flex justify-center mt-2">
    <ul class="ml-4 md:ml-0">
      <li
          v-for="x in 2"
          :key="x"
          class="list-disc align-self-start text-left text-gray-600"
      > {{ $t(`searchResults.text.info.${x}`) }}, </li>
    </ul>

    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import NoResultsText from "@/components/Page/NoResultsText.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

export default {
  data(): ComponentData {
    return {
      infoCount: 2,
    }
  },
  components: {
    NoResultsText
  }
}
</script>
<template>
  <div class="hover:opacity-70 cursor-pointer mr-1 flex flex-row">
    <p
        class="align-self-center mr-1 founds-status-text"
        v-if="!isPhoneBreakingPoint"
    >{{ $t('navbar.topBar.founds.label') }}</p>
    <img
        src="/public/image/system/gem/gem-32.png"
        class="founds-status-gem"
    />
  </div>
</template>

<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import ResponsiveVarsMixin from "@/mixins/Responsive/ResponsiveVarsMixin.vue";

export default {
  data(): ComponentData {
    return {
    }
  },
  mixins: [
    ResponsiveVarsMixin
  ]
}
</script>

<style lang="scss" scoped>
.gem {
  width: 32px;
  height: 32px;
}
</style>
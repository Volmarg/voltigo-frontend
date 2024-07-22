<template>
  <WarningBlock class="mb-5 bg-white text-gray-500 text-2md">
    <div class="text-left">
      <span v-html="$t('builder.mobile.description')" />
    </div>
  </WarningBlock>
</template>

<script lang="ts">
import WarningBlock from "@/components/Page/WarningBlock.vue";

export default {
  components: {
    WarningBlock,
  }
}
</script>
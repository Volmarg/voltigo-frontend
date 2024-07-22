<template>
  <div>

    <WarningBlock :text="$t('jobOfferSearch.page.locationBasedSearch')"
                  class="mb-5 bg-white text-gray-500 text-2md"
    />

  </div>
</template>

<script lang="ts">
import WarningBlock from "@/components/Page/WarningBlock.vue";

export default {
  components: {
    WarningBlock,
  }
}
</script>
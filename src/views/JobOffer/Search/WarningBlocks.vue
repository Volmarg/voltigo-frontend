<template>

  <div v-if="isOffersHandlerAlive || isOffersHandlerQuotaReached">

    <div
        v-if="!isOffersHandlerAlive"
        class="mb-5"
    >
      <HandlerOfflineInfo />
    </div>

    <div
        v-else-if="isOffersHandlerQuotaReached"
        class="mb-5"
    >
      <QuotaReachedInfo />
    </div>

  </div>

</template>

<script lang="ts">

import QuotaReachedInfo   from "@/views/JobOffer/Search/QuotaReachedInfo.vue";
import HandlerOfflineInfo from "@/views/JobOffer/Search/HandlerOfflineInfo.vue";

export default {
  props: {
    isOffersHandlerAlive: {
      type: Boolean,
      required: true,
    },
    isOffersHandlerQuotaReached: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    QuotaReachedInfo,
    HandlerOfflineInfo,
  }
}
</script>
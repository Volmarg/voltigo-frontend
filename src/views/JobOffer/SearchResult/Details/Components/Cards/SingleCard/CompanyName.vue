<template>
  <div class="text-left">
    <span v-if="jobOffer.companyDetail.companyName ">
      <h2>
        <span class="company-name">{{ jobOffer.companyDetail.companyName }}</span>
      </h2>
    </span>
  </div>
</template>

<script lang="ts">
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";

export default {
  props: {
    jobOffer: {
      type     : Object as unknown as JobOfferAnalyzed,
      required : true,
    },
  },
}
</script>

<style lang="scss">
.company-name {
  font-size: 1.1rem;
}
</style>
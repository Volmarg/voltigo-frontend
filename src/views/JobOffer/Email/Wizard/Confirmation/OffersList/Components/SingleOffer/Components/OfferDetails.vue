<template>
  <div class="details-wrapper">

    <ul>
      <li>
        <span class="label">{{ $t('components.jobOfferEmailWizard.steps.confirmation.labels.offerDetails.jobName') }}</span>:
        <span class="break-all">{{ jobOffer.jobTitle }}</span>
      </li>
      <li v-tippy="{
            content: emailSourceHoverText,
            placement : 'top'
          }">
        <span class="label">{{ $t('components.jobOfferEmailWizard.steps.confirmation.labels.offerDetails.recipient') }}</span>:
        <span class="break-all"> {{ jobOffer.contactDetail.email }} </span>

        <fa :icon="emailSourceAwesomeIconName"
            class="ml-1"
            :class="{
                [emailSourceColorClass]: true,
              }"
        />

      </li>
      <li>
        <span class="label">{{ $t('components.jobOfferEmailWizard.steps.confirmation.labels.offerDetails.company') }}</span>:
        <span class="break-all">{{ jobOffer.companyDetail.companyName }}</span>
      </li>
    </ul>

  </div>
</template>

<script lang="ts">
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";

import EmailSourceMixin from "@/views/JobOffer/SearchResult/Details/Mixin/EmailSourceMixin.vue";

export default {
  props: {
    jobOffer: {
      type     : Object as () => JobOfferAnalyzed,
      required : true,
    },
  },
  mixins: [
    EmailSourceMixin
  ],
}
</script>

<style lang="scss" scoped>
.label {
  font-weight: bold;
}

.details-wrapper {
  text-align: left;
}

</style>
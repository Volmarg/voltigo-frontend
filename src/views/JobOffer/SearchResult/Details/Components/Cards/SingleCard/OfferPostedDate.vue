<template>
  <div class="last-time-applied-date-wrapper flex flex-">
    <div class="flex flex-row justify-end posted-date align-self-center"
         v-if="jobOffer.jobPostedDateTime"
    >
      <span v-tippy="$t('searchResults.singleCard.jobOfferPostedDateTime.tippyInfo')">
        <fa :icon="['far', 'calendar-alt']"/>
        <b>{{ $t('searchResults.singleCard.jobOfferPostedDateTime.postedAt') }}</b>
        {{ jobOffer.jobPostedDateTime }}

        <span class="hidden lg:inline">
          ({{ getJobOfferPostedDaysDifference(jobOffer.jobPostedDateTime) }}
          {{ $t('searchResults.singleCard.jobOfferPostedDateTime.postedDaysAgo') }})
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";

import DateTimeProcessor from "@/scripts/Core/Services/TypesProcessors/DateTimeProcessor";

export default {
  props: {
    jobOffer: {
      type     : Object as unknown as JobOfferAnalyzed,
      required : true,
    },
  },
  methods: {
    /**
     * @description will return information of how many days ago was given job offer posted on external service
     */
    getJobOfferPostedDaysDifference(postedDateString: string): number {
      return DateTimeProcessor.getDaysAgo(postedDateString);
    }
  }
}
</script>

<style lang="scss" scoped>
.posted-date {
  color: slategray;
}
</style>
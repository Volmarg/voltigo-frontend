<template>
  <div class="last-time-applied-date-wrapper flex flex-">
    <div class="flex flex-row justify-end align-self-center"
         v-if="jobOffer.appliedAt"
    >
      <span v-tippy="$t('searchResults.singleCard.jobOfferAppliedAtDateTime.tippyInfo')">
        <la
            svg-icon-name="suitcase-solid"
            :color="color.orange"
            font-size="20"
        />

        <span class="ml-2">
          <b>{{ $t('searchResults.singleCard.jobOfferAppliedAtDateTime.appliedAt') }}</b>
          {{ jobOffer.appliedAt }}

          <span class="hidden lg:inline">
            ({{ getJobOfferApplicationDaysDifference(jobOffer.appliedAt) }}
            {{ $t('searchResults.singleCard.jobOfferAppliedAtDateTime.daysAgo') }})
          </span>
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";
import moment             from "moment/moment";
import Colors             from "@/scripts/Vue/Mixins/Colors.vue";

export default {
  props: {
    jobOffer: {
      type     : Object as unknown as JobOfferAnalyzed,
      required : true,
    },
  },
  mixins: [
    Colors
  ],
  methods: {
    /**
     * @description will return information of how many days ago was application for this job sent
     */
    getJobOfferApplicationDaysDifference(appliedAtDateString: string): number {
      let now          = moment();
      let postedMoment = moment(appliedAtDateString);
      let daysDiff     = now.diff(postedMoment, 'days');

      return daysDiff;
    }
  }
}
</script>

<style lang="scss" scoped>
.last-time-applied-date-wrapper {
  * {
    color: rgb(255, 98, 0); // equal to orange-900
  }
}
.posted-date {
  color: slategray;
}
</style>
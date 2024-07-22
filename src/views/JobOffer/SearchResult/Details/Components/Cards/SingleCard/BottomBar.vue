<template>
  <div class="grid grid-cols-12 grid-rows-1 mt-5">

    <div class="grid grid-cols-12 grid-rows-1 col-start-1 col-end-13">

      <div class="grid grid-rows-1 grid-cols-12">
        <QuickApply :job-offer="jobOffer"
                    :is-initially-selected="isInitiallySelected"
                    @card-selection-changed="onCardSelectionChanged"
                    class="
                        col-start-1
                        col-end-12

                        md:col-end-1
                        sm:col-end-1
                      "
        />
      </div>

      <div class="grid grid-rows-1 grid-cols-11 col-start-7 col-end-13">
        <LastTimeAppliedDate
            :job-offer="jobOffer"
            class="date-entry last-time-applied-date"
            v-if="jobOffer.appliedAt"
        />
        <OfferPostedDate :job-offer="jobOffer"
                         class="date-entry offer-posted-date"
        />

      </div>
    </div>
  </div>
</template>

<script lang="ts">

import QuickApply          from "@/views/JobOffer/SearchResult/Details/Components/Cards/SingleCard/QuickApply.vue";
import LastTimeAppliedDate from "@/views/JobOffer/SearchResult/Details/Components/Cards/SingleCard/LastTimeAppliedDate.vue";
import OfferPostedDate     from "@/views/JobOffer/SearchResult/Details/Components/Cards/SingleCard/OfferPostedDate.vue";

import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";
import {ComponentData}    from "@/scripts/Vue/Types/Components/types";

export default {
  data(): ComponentData {
    return {
      isSelected: false,
    }
  },
  props: {
    jobOffer: {
      type     : Object as unknown as JobOfferAnalyzed,
      required : true,
    },
    isInitiallySelected: {
      type    : Boolean,
      default : false,
    },
  },
  emits: [
    'cardSelectionChanged'
  ],
  components : {
    LastTimeAppliedDate,
    OfferPostedDate,
    QuickApply,
  },
  methods: {
    /**
     * @description handler for when the job offer selection changes
     */
    onCardSelectionChanged(jobOfferIdentifier: number, isSelected: boolean): void {
      this.$emit('cardSelectionChanged', jobOfferIdentifier, isSelected)
      this.isSelected = isSelected;
    },
  }
}
</script>

<style lang="scss">
.date-entry {
  @apply col-start-1 col-end-13 sm:col-start-5 md:col-start-5 lg:col-start-6 xl:col-start-7 xl:col-end-13 flex justify-end
}

.offer-posted-date {
  @apply row-start-1 row-end-1
}

.last-time-applied-date {
  @apply row-start-2 row-end-2
}

</style>
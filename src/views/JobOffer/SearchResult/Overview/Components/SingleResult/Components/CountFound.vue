<template>
  <div
      class="data-chunk text-blue-500"
      v-if="isSearchSuccess(searchResult)"
  >
    <div class="text-center">
     <span class="font-bold">{{ $t('jobOfferSearchEntries.singleEntry.offersFound.label') }}: </span>
      <span>{{ foundOffersCount }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import {JobSearchResult} from "@/scripts/Entity/Job/JobSearchResult";

import SearchResultStatusMixin from "@/views/JobOffer/SearchResult/Mixin/SearchResultStatusMixin.vue";

export default {
  props: {
    searchResult: {
      type     : Object as unknown as JobSearchResult,
      required : true,
    }
  },
  computed: {
    /**
     * @description returns count of found offers, or 0 if null is returned
     */
    foundOffersCount(): number {
      return this.searchResult.offersFoundCount ?? 0
    },
  },
  mixins: [
    SearchResultStatusMixin,
  ],
}
</script>

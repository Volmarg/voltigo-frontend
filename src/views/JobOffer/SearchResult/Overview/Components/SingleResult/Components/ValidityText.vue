<template>
  <div>
    <span class="data-chunk">
      <b> {{ $t('jobOfferSearchEntries.singleEntry.validity.daysTillRemoval')}}: </b>

      <span
          :class="{
            'red'    : (searchResult.validDaysNumber <= 5),
            'orange' : (searchResult.validDaysNumber <= 10 && searchResult.validDaysNumber > 5)
          }">
        {{ validDaysValue }}
      </span>


    </span>

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
  mixins: [
    SearchResultStatusMixin,
  ],
  computed: {
    validDaysValue(): string {
      if (this.searchResult.validDaysNumber > 0) {
        return this.searchResult.validDaysNumber;
      }

      return this.$t('jobOfferSearchEntries.singleEntry.validity.status.expired');
    }
  }
}
</script>


<style lang="scss">
.red {
  color: red;
}

.orange {
  color: orange;
}

.data-chunk {
  display: block;
  text-align: left;
}
</style>

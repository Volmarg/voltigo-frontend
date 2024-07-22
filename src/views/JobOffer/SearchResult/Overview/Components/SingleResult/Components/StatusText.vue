<template>
  <div>
    <!-- Order matters, as it's more strict this way -->

    <div v-if="isSearchFailed(searchResult)">
      <span class="status status-failed"> {{ status }}</span>
    </div>

    <div v-else-if="isSearchPending(searchResult)">
      <span class="status status-pending"> {{ status }}</span>
    </div>

    <div v-else>
      <span class="status status-success"> {{ status }}</span>
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
  mixins: [
    SearchResultStatusMixin,
  ],
  computed: {
    /**
     * @description get status text
     */
    status(): string {
      return this.$t(`jobOfferSearchEntries.singleEntry.status.${this.searchResult.status}`);
    }
  }
}
</script>


<style lang="scss">
.status {
  font-size: 20px;
}

.status-failed {
  color: red;
}

.status-success {
  color: green;
}

.status-pending {
  color: orange;
}

</style>
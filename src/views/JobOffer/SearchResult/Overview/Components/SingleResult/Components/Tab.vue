<template>
  <div>

    <!-- tab -->
    <div class="w-full flex items-center justify-start p-4 bg-transparent shadow border-l-4 border-current mb-3 bg-white text-gray-500 text-2md"
         :class="{
            'border-green-600'  : isSearchSuccess(searchResult),
            'border-red-600'    : isSearchFailed(searchResult),
            'border-orange-500' : isSearchPending(searchResult) || isSearchWip(searchResult),
           }"
    >
      <!-- tab content -->
      <div class="flex justify-start data-wrapper">
        <div class="grid sm:grid-rows-1 sm:grid-cols-2 gap-2 main-grid-wrapper grid-rows-2 grid-cols-1">
          <StatusIcon
              :search-result="searchResult"
              class="row-start-1"
          />

          <div class="grid grid-rows-1 grid-cols-1 gap-2 row-start-2 sm:row-start-1">
            <StatusText :search-result="searchResult"/>
            <CountFound :search-result="searchResult"/>
            <Details :search-result="searchResult"/>
            <ValidityText :search-result="searchResult"/>
          </div>

        </div>
      </div>


    </div>

  </div>
</template>

<script lang="ts">

import CountFound   from "@/views/JobOffer/SearchResult/Overview/Components/SingleResult/Components/CountFound.vue";
import StatusIcon   from "@/views/JobOffer/SearchResult/Overview/Components/SingleResult/Components/StatusIcon.vue";
import ValidityText from "@/views/JobOffer/SearchResult/Overview/Components/SingleResult/Components/ValidityText.vue";
import StatusText   from "@/views/JobOffer/SearchResult/Overview/Components/SingleResult/Components/StatusText.vue";
import Details      from "@/views/JobOffer/SearchResult/Overview/Components/SingleResult/Components/Details.vue";

import SearchResultStatusMixin from "@/views/JobOffer/SearchResult/Mixin/SearchResultStatusMixin.vue";
import {JobSearchResult} from "@/scripts/Entity/Job/JobSearchResult";

export default {
  name: "SearchResultOverviewSingleResultTabContent",
  props: {
    searchResult: {
      type     : Object as unknown as JobSearchResult,
      required : true,
    }
  },
  components: {
    ValidityText,
    CountFound,
    StatusIcon,
    StatusText,
    Details,
  },
  mixins: [
    SearchResultStatusMixin,
  ]

}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/responsive.scss';

.orange {
  border-color: orange
}

.main-grid-wrapper {
  grid-template-rows: 50px 1fr;
}

@media screen and (min-width: $phoneBreakingPoint + 'px') {
  .main-grid-wrapper {
    grid-template-columns: 70px 1fr;
    grid-template-rows: 1fr;
  }

}
</style>
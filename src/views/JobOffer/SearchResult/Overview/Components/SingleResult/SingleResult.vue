<template>
  <div>

    <router-link :to="{name: detailsRouteName, params: {id: searchResult.id}}"
                 class="cursor-pointer hover:opacity-50 relative"
                 v-if="isSearchSuccess(searchResult)"
                 @click="onResultClick"
                 v-tippy="{
                  content   : $t('jobOfferSearchEntries.singleEntry.helper.open.text'),
                  placement : 'top'
                }"
    >
      <Tab :search-result="searchResult" />
    </router-link>

    <div v-else>
      <Tab :search-result="searchResult" />
    </div>

  </div>
</template>

<script lang="ts">
import {JobSearchResult} from "@/scripts/Entity/Job/JobSearchResult";

import Tab from "@/views/JobOffer/SearchResult/Overview/Components/SingleResult/Components/Tab.vue";

import VueRouter from "@/router/VueRouter";

import SearchResultStatusMixin from "@/views/JobOffer/SearchResult/Mixin/SearchResultStatusMixin.vue";

export default {
  name: "SearchResultOverviewSingleResult",
  data(){
    return {
      detailsRouteName : VueRouter.ROUTE_NAME_JOB_OFFER_SEARCH_RESULT_DETAILS,
    }
  },
  props: {
    searchResult: {
      type     : Object as unknown as JobSearchResult,
      required : true,
    }
  },
  components: {
    Tab,
  },
  mixins: [
    SearchResultStatusMixin,
  ],
  methods: {
    /**
     * @description handles user clicking on the result box:
     *              - scrolls page to top
     */
    onResultClick() {
      this.$view.scrollContentOfElement(window)
    }
  }
}
</script>

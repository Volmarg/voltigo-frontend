<template>
  <div class="status-icon-top-parent">

    <!-- Order matters, as it's more strict this way -->

    <div v-if="isSearchFailed(searchResult)"
         class="status-icon-wrapper"
    >
      <la svg-icon-name="times-circle-solid"
          :font-size="config.iconSize"
          color="red"
          class="status-icon"
      />
    </div>

    <div v-else-if="isSearchPending(searchResult)"
         class="status-icon-wrapper"
    >
      <la svg-icon-name="stopwatch-solid"
          :font-size="config.iconSize"
          color="orange"
          class="status-icon"
      />
    </div>

    <div v-else
         class="status-icon-wrapper"
    >
      <la svg-icon-name="check-circle-solid"
          :font-size="config.iconSize"
          color="green"
          class="status-icon"
      />
    </div>

  </div>
</template>

<script lang="ts">
import {JobSearchResult} from "@/scripts/Entity/Job/JobSearchResult";

import SearchResultStatusMixin from "@/views/JobOffer/SearchResult/Mixin/SearchResultStatusMixin.vue";

import LineAwesome from "@/components/Ui/Icons/LineAwesome.vue";

export default {
  name: "SearchResultOverviewStatusIcon",
  data() {
    return {
      config: {
        iconSize: 50,
      }
    }
  },
  props: {
    searchResult: {
      type     : Object as unknown as JobSearchResult,
      required : true,
    }
  },
  mixins: [
    SearchResultStatusMixin,
  ],
  components: {
    "la" : LineAwesome,
  }
}
</script>

<style lang="scss" scoped>
.status-icon-top-parent {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 0;
}

</style>
<template>
  <div>

    <Accordion>
      <AccordionPanel>

        <template #title>
          {{ $t('jobOfferSearchEntries.filters.accordion.mainLabel') }}
        </template>

        <template #content>

          <Container class="grid lg:grid-rows-1 lg:grid-cols-2 gap-2 mb-4 sm:grid-rows-1 sm:grid-cols-1">
            <LocationDistanceFilter v-model="filterValues.locationDistance" />
            <LocationNameFilter v-model="filterValues.locationName" />
          </Container>

          <Container class="grid lg:grid-rows-2 lg:gap-4 gap-6">
            <KeywordsFilter v-model="filterValues.keywords" />

            <div class="grid lg:grid-rows-1 lg:grid-cols-2 lg:gap-4 gap-6">
              <StatusFilter
                  v-model="filterValues.status"
                  :search-results="searchResults"
              />
              <TargetAreaFilter :search-results="searchResults" v-model="filterValues.targetArea"/>
            </div>
          </Container>

          <Container class="grid lg:grid-rows-1 lg:grid-cols-3 gap-2 mb-4 sm:grid-rows-1 sm:grid-cols-1 mt-4">
            <CreatedFilter v-model="filterValues.created"/>
          </Container>

        </template>
      </AccordionPanel>
    </Accordion>

  </div>
</template>

<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import CreatedFilter          from "@/views/JobOffer/SearchResult/Overview/Components/FiltersPanel/Components/CreatedFilter.vue";
import KeywordsFilter         from "@/views/JobOffer/SearchResult/Overview/Components/FiltersPanel/Components/KeywordsFilter.vue";
import StatusFilter           from "@/views/JobOffer/SearchResult/Overview/Components/FiltersPanel/Components/StatusFilter.vue";
import LocationNameFilter     from "@/views/JobOffer/SearchResult/Overview/Components/FiltersPanel/Components/LocationNameFilter.vue";
import LocationDistanceFilter from "@/views/JobOffer/SearchResult/Overview/Components/FiltersPanel/Components/LocationDistanceFilter.vue";
import TargetAreaFilter       from "@/views/JobOffer/SearchResult/Overview/Components/FiltersPanel/Components/TargetAreaFilter.vue";

import Container      from "@/components/Ui/Containers/Container.vue";
import Accordion      from "@/components/Ui/Accordion/Accordion.vue";
import AccordionPanel from "@/components/Ui/Accordion/Panel.vue";

import {JobSearchResult} from "@/scripts/Entity/Job/JobSearchResult";

export default {
  name: "SearchResultFiltersPanel",
  data(): ComponentData {
    return {
      filterValues: {
        targetArea: null,
        locationDistance: null,
        locationName: null,
        created: null,
        status: null,
        keywords: [],
      }
    }
  },
  props: {
    searchResults: {
      type     : Array as unknown as Array<JobSearchResult>,
      required : true,
    }
  },
  emits: [
    'filterValueChanged'
  ],
  components: {
    Container,
    CreatedFilter,
    TargetAreaFilter,
    LocationNameFilter,
    LocationDistanceFilter,
    KeywordsFilter,
    StatusFilter,
    Accordion,
    AccordionPanel,
  },
  watch: {
    filterValues: {
      deep: true,
      handler(): void {
        this.$emit('filterValueChanged', this.filterValues);
      }
    }
  }
}

</script>
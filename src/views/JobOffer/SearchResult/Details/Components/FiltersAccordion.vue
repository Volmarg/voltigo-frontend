<template>
  <Accordion>
    <Panel>

      <template #title>
        {{ $t('filters.label.main') }}
      </template>

      <template #content>

        <filters-panel @job-offers-filtered="$emit('jobOfferFiltered', $event)"
                       :offers-search-filter-values="offersSearchFilterValues"
                       :all-job-offers="jobOffers"
                       ref="filterPanel"
        />

      </template>
    </Panel>
  </Accordion>

</template>

<script lang="ts">
import Accordion    from "@/components/Ui/Accordion/Accordion.vue";
import FiltersPanel from "@/views/JobOffer/SearchResult/Details/Components/FiltersPanel.vue";
import Panel        from "@/components/Ui/Accordion/Panel.vue";

import {FilterValues} from "@/scripts/Response/Job/Offer/GetJobOffers";
import {PropType}    from "vue";

export default {
  props: {
    offersSearchFilterValues: {
      type: [Object, null] as PropType<FilterValues> | PropType<null>,
      required: true,
    },
    jobOffers: {
      type     : Array,
      required : true
    }
  },
  emits: [
    "jobOfferFiltered"  
  ],
  components: {
    Accordion,
    FiltersPanel,
    Panel,
  }
}
</script>,
<template>
  <div class="text-left location-data">
    <div v-if="isCompanyLocationSet">
      <span v-for="(companyLocation, index) of filteredLocations"
            :key="index"
      >
        <span v-if="index !== 0 && index < this.jobOffer.companyDetail.companyLocations.length">
          ,
        </span>
        <a :href="buildGoogleMapLink(companyLocation)"
           target="_blank"
           class="hover:opacity-50"
        > {{ companyLocation }}</a>
      </span>
    </div>

  </div>
</template>

<script lang="ts">
import GoogleMapsService, {MAP_TYPE} from "@/scripts/Core/Services/External/GoogleMapsService";
import ArrayTypeProcessor            from "@/scripts/Core/Services/TypesProcessors/ArrayTypeProcessor";

import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";

export default {
  props: {
    jobOffer: {
      type     : Object as unknown as JobOfferAnalyzed,
      required : true,
    },
  },
  computed: {
    /**
     * @description goes over the locations and filters them out in case backend would return some empty / null based locations
     *              (could happen if some data merging goes wrong)
     */
    filteredLocations(): Array<string> {
      let filteredLocations = [] as Array<string>;
      let nonEmptyLocations = this.jobOffer.companyDetail.companyLocations.filter(Boolean);
      for (let location of nonEmptyLocations) {

        let isSame = false;
        for (let singleFiltered of filteredLocations) {
          if (singleFiltered.toLowerCase() === location.toLowerCase()) {
            isSame = true;
            break;
          }
        }

        if (!isSame) {
          filteredLocations.push(location);
        }
      }

      return filteredLocations;
    },
    /**
     * @description will check if company location is set
     */
    isCompanyLocationSet(): boolean {
      return !ArrayTypeProcessor.isEmpty(this.jobOffer.companyDetail.companyLocations);
    },
  },
  methods: {
    /**
     * @description create google map link for single location + company name (taken directly from prop)
     * @param location
     */
    buildGoogleMapLink(location: string): string {
      let normalizedSearch = encodeURI(this.jobOffer.companyDetail.companyName + " " + location);
      let googleMapUrl     = GoogleMapsService.buildGoogleMapsUrlForLocationString(normalizedSearch, MAP_TYPE.NORMAL);

      return googleMapUrl;
    },
  }
}
</script>

<style lang="scss" scoped>
.location-data {
  font-size: 0.95rem;
  @apply text-gray-500
}
</style>
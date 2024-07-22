<template>
  <div v-if="companyData.companyLocations.length !== 0">

    <div class="text-center mb-8 text-lg border-l-0 border-r-0 border-t-0 border-b-2 border-gray-200">
      <p class="font-bold">{{ $t('searchResults.fullInfo.tabs.companyDetails.data.locations.headers.locations') }}</p>
    </div>

    <row :is-content-equally-distributed="true"
         flex-direction="flex-col"
    >
      <!-- the duplicated v-for is necessary to have the gui looking good -->
      <div class="flex flex-row justify-between">
        <big-square-button class="mb-2"
                           :bottom-text="data.location"
                           :is-full-width="false"
                           :is-active="data.isActive"
                           @click="onLocationClick(data.location)"
                           v-for="(data, index) of locationsWithMapUrls"
                           :key="index"
        />
      </div>

      <div v-for="(data, index) of locationsWithMapUrls"
           :key="index"
           class="w-full"
      >
        <iframe  :src="data.mapUrl"
                 width="100%"
                 height="350px"
                 style="border:0"
                 loading="lazy"
                 allowfullscreen
                 :ref="`iframe.${data.location}`"
                 v-if="data.isActive"
        />
      </div>
    </row>

  </div>
</template>

<script lang="ts">
import Row             from "@/components/Ui/Row.vue";
import BigSquareButton from "@/components/Navigation/Button/BigSquareButton.vue";

import CompanyDetail   from "@/scripts/Entity/Job/CompanyDetail";
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import ArrayTypeProcessor from "@/scripts/Core/Services/TypesProcessors/ArrayTypeProcessor";
import GoogleMapsService  from "@/scripts/Core/Services/External/GoogleMapsService";

type LocationData = {
  location : string,
  mapUrl   : string,
  isActive : boolean,
};

export default {
  name: "OfferFullInfoCompanyDetailLocations",
  data(): ComponentData {
    return {
      locationsWithMapUrls: [] as Array<LocationData>,
    }
  },
  props: {
    companyData: {
      type     : Object as unknown as CompanyDetail,
      required : true,
    },
  },
  components: {
    Row,
    BigSquareButton,
  },
  methods: {
    /**
     * @description handler for location name click
     *              - makes clicked location active
     */
    onLocationClick(locationName: string): void {
      let clickedLocationData = this.locationsWithMapUrls.find((locationData: LocationData) => {
        return locationData.location == locationName;
      });

      this.deactivateAllLocations();
      clickedLocationData.isActive = true;
    },
    /**
     * @description will mark all locations as inactive (not clicked now)
     */
    deactivateAllLocations(): void {
      for (let location of this.locationsWithMapUrls) {
        location.isActive = false;
      }
    },
    /**
     * @description will mark the first location as the active one
     */
    markFirstLocationActive(): void {
      if (ArrayTypeProcessor.isEmpty(this.locationsWithMapUrls)) {
        return;
      }

      this.deactivateAllLocations();
      let firstLocation      = this.locationsWithMapUrls[0];
      firstLocation.isActive = true;
    },
    /**
     * @description will set the data property with google maps location url
     */
    getGoogleMapsLocationUrls(): void {
      let locationsWithMapUrls = [] as Array<LocationData>;
      for(let location of this.companyData.companyLocations){
        let normalizedSearch = encodeURI(this.companyData.companyName  + " " + location);
        let googleMapUrl     = GoogleMapsService.buildGoogleMapsUrlForLocationString(normalizedSearch);

        locationsWithMapUrls.push({
          location : location,
          mapUrl   : googleMapUrl,
          isActive : false,
        })
      }

      this.locationsWithMapUrls = locationsWithMapUrls;
    }
  },
  created(): void {
    this.getGoogleMapsLocationUrls();
    this.markFirstLocationActive();
  },
  updated(): void {
    this.getGoogleMapsLocationUrls();
    this.markFirstLocationActive();
  },
}
</script>
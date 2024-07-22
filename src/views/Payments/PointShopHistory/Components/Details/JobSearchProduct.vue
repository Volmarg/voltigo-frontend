<template>
  <ul class="text-left p-5">
    <li>
      <span class="chunk-label">{{ $t('pointShop.modal.details.type.jobSearchTag.keywords.label')}}: </span>
      <span class="chunk-data">{{ jobSearchProductData.jobSearchKeywords.join(', ') }}</span>
    </li>
    <li>
      <span class="chunk-label">{{ $t('pointShop.modal.details.type.jobSearchTag.country.label')}}: </span>
      <span class="chunk-data">{{ countryName }}</span>
    </li>
    <li v-if="jobSearchProductData.locationName">
      <span class="chunk-label">{{ $t('pointShop.modal.details.type.jobSearchTag.locationName.label')}}: </span>
      <span class="chunk-data">{{ jobSearchProductData.locationName }}</span>
    </li>
    <li v-if="jobSearchProductData.maxDistance">
      <span class="chunk-label">{{ $t('pointShop.modal.details.type.jobSearchTag.maxDistance.label')}}: </span>
      <span class="chunk-data">{{ jobSearchProductData.maxDistance }}km</span>
    </li>
  </ul>
</template>

<script lang="ts">
import IsoCountries               from "@/scripts/Libs/IsoCountries";
import BackendErrorStorageService from "@/scripts/Core/Services/Storage/BackendErrorStorageService";

export default {
  props: {
    /** @var {JobSearchProductData} */
    jobSearchProductData: {
      type: Object,
      required: true,
    }
  },
  computed: {
    /**
     * @description returns the human-readable country name for the target area which represents country iso code
     */
    countryName(): string {
      let name = IsoCountries.getHumanCountryNameForIso31661ThreeDigitCode(this.jobSearchProductData.targetArea);
      if (!name) {
        BackendErrorStorageService.storeData({
          "info": "Could not find human-readable country name for target area",
          "targetArea": this.jobSearchProductData.targetArea,
        });
        return this.jobSearchProductData.targetArea;
      }

      return name;
    }
  }
}
</script>

<style lang="scss" scoped>
.chunk-label {
  @apply font-bold
}
</style>
<template>
  <div>
    <span class="data-chunk">
      <b> {{ $t('jobOfferSearchEntries.singleEntry.id.label')}}:</b>
      {{ searchResult.id }}
    </span>

    <span class="data-chunk">
      <b> {{ $t('jobOfferSearchEntries.singleEntry.created.label')}}:</b>
      {{ formattedTimestamp }}
    </span>

    <span class="data-chunk">
      <b> {{ $t('jobOfferSearchEntries.singleEntry.keywords.label')}}:</b>
      {{ formattedSearchedKeywords }}
    </span>

    <span class="data-chunk">
      <b> {{ $t('jobOfferSearchEntries.singleEntry.targetArea.label')}}:</b>
      {{ formattedTargetAreas }}
    </span>

    <span v-if="isLocationSet"
          class="data-chunk"
    >
      <b> {{ $t('jobOfferSearchEntries.singleEntry.location.label')}}:</b>
      {{ searchResult.locationName }}

      <span v-if="isDistanceSet"
            class="data-chunk"
      >
        <b> {{ $t('jobOfferSearchEntries.singleEntry.distance.label')}}:</b>
        {{ searchResult.maxDistance }}
      </span>

    </span>

  </div>
</template>

<script lang="ts">
import {JobSearchResult} from "@/scripts/Entity/Job/JobSearchResult";
import moment            from "moment";
import TypeChecker       from "@/scripts/Core/Services/Types/TypeChecker";
import IsoCountries      from "@/scripts/Libs/IsoCountries";

export default {
  name: "SearchResultOverviewSingleResultDetails",
  props: {
    searchResult: {
      type     : Object as unknown as JobSearchResult,
      required : true,
    }
  },
  computed: {
    /**
     * @description check if location is set
     */
    isLocationSet(): boolean {
      return !TypeChecker.isNull(this.searchResult.locationName);
    },
    /**
     * @description check if distance is set
     */
    isDistanceSet(): boolean {
      return !TypeChecker.isNull(this.searchResult.maxDistance);
    },
    /**
     * @description returns the "created" date formatted in human-readable way
     */
    formattedTimestamp(): string {
      return moment(this.searchResult.created).format("Y-MM-DD H:mm");
    },
    /**
     * @description returns the "keywords" date formatted in human-readable way
     */
    formattedSearchedKeywords(): string {
      return this.searchResult.keywords.join(",");
    },
    /**
     * @description returns the "keywords" date formatted in human-readable way
     */
    formattedTargetAreas(): string {
      let humanTargetAreas = [] as Array<string>;
      for (let targetArea of this.searchResult.targetAreas) {
        humanTargetAreas.push(IsoCountries.getHumanCountryNameForIso31661ThreeDigitCode(targetArea) ?? targetArea);
      }

      return humanTargetAreas.join(",");
    }
  }
}
</script>

<style lang="scss" scoped>
.data-chunk {
  display: block;
  text-align: left;
}
</style>

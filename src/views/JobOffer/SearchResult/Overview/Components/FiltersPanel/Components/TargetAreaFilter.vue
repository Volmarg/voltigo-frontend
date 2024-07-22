<template>
  <div>
    <MultiSelect :options="areaOptions"
                 :label="$t('jobOfferSearchEntries.filters.area.label')"
                 class="w-full h-full"
                 v-model="area"
                 @select="onEvent"
                 @deselect="onEvent"
                 @clear="onEvent"
                 @keydown="onEvent"
                 @paste="onEvent"
                 @input="onEvent"
                 @change="onEvent"
    />
  </div>
</template>

<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import MultiSelect from "@/components/Form/MultiSelect.vue";

import {JobSearchResult} from "@/scripts/Entity/Job/JobSearchResult";

import IsoCountries        from "@/scripts/Libs/IsoCountries";
import StringTypeProcessor from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";

export default {
  name: "SearchResultTargetAreaFilter",
  data(): ComponentData {
    return {
      area: null,
    }
  },
  props: {
    modelValue: {
      required: false,
    },
    searchResults: {
      type     : Array as unknown as Array<JobSearchResult>,
      required : true,
    }
  },
  components: {
    MultiSelect,
  },
  computed: {
    /**
     * @description returns  the list of areas related to the searches,
     * It's actually planned to have 2 loops in here since searching for human-readable name is time-consuming
     */
    areaOptions(): Array<Record<string, string>> {
      let allAreas    = [] as Array<string>;
      for(let searchResult of this.searchResults){
        allAreas.push(...searchResult.targetAreas);
      }

      let uniqueAreas        = [...(new Set(allAreas))];
      let humanReadableAreas = [] as Array<Record<string, string>>;
      for (let areaName of uniqueAreas) {
        let humanName = IsoCountries.getHumanCountryNameForIso31661ThreeDigitCode(areaName);
        if(null === humanName){
          humanReadableAreas.push({
            value: areaName,
            label: StringTypeProcessor.ucFirst(areaName),
          });
          continue;
        }

        humanReadableAreas.push({
          value: areaName,
          label: StringTypeProcessor.ucFirst(humanName),
        });
      }

      return humanReadableAreas;
    }
  },
  methods: {
    onEvent(): void {
      this.$emit("update:modelValue", this.area);
    }
  },
}
</script>

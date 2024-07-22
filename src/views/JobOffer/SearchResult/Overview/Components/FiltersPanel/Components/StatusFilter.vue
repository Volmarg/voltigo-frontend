<template>
  <div>
    <MultiSelect :options="selectOptions"
                 :label="$t('jobOfferSearchEntries.filters.status.label')"
                 class="w-full h-full"
                 v-model="status"
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

export default {
  name: "SearchResultStatusFilter",
  data(): ComponentData {
    return {
      status: null,
    }
  },
  components: {
    MultiSelect
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
  computed: {
    /**
     * @description returns status options
     */
    selectOptions(): Array<Record<string, string>> {

      let options = [] as Array<Record<string, string>>;
      let addedStatus = [] as Array<string>;

      for (let searchResult of this.searchResults) {
        if (addedStatus.includes(searchResult.status)) {
          continue;
        }

        addedStatus.push(searchResult.status);

        options.push({
          label: this.$t(`jobOfferSearchEntries.singleEntry.status.${searchResult.status}`),
          value: searchResult.status,
        });
      }

      return options;
    }
  },
  methods: {
    onEvent(): void {
      this.$emit("update:modelValue", this.status);
    }
  }
}
</script>

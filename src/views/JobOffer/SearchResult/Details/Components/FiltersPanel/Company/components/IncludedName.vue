<template>
  <div>
    <BaseName
      :label="$t('filters.company.includedNames')"
      v-model="includedNames"
      tag-classes="bg-green-500"
    />
  </div>
</template>

<script lang="ts">
import BaseName from "@/views/JobOffer/SearchResult/Details/Components/FiltersPanel/Company/components/BaseName.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

export default {
  data(): ComponentData {
    return {
      includedNames: [],
    }
  },
  components: {
    BaseName
  },
  watch: {
    includedNames() {
      this.$emit('change', this.includedNames);
    }
  }
}
</script>
<template>
  <div>
    <BaseName
      :label="$t('filters.company.excludedNames')"
      v-model="excludedNames"
      tag-classes="bg-red-500"
    />
  </div>
</template>

<script lang="ts">
import BaseName from "@/views/JobOffer/SearchResult/Details/Components/FiltersPanel/Company/components/BaseName.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

export default {
  data(): ComponentData {
    return {
      excludedNames: [],
    }
  },
  components: {
    BaseName
  },
  watch: {
    excludedNames() {
      this.$emit('change', this.excludedNames);
    }
  }
}
</script>
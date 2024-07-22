<template>
  <div>
    <MultiSelect v-model="keywords"
                 mode="tags"
                 :show-count-in-label="true"
                 :allow-create-options="true"
                 :is-searchable="true"
                 :allow-show-options-list="false"
                 :options="[]"
                 :label="$t('jobOfferSearchEntries.filters.keywords.label')"
                 :value="modelValue"
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

export default {
  name: "SearchResultKeywordsFilter",
  data(): ComponentData {
    return {
      keywords: [],
    }
  },
  components: {
    MultiSelect
  },
  props: {
    modelValue: {
      required: false,
    }
  },
  methods: {
    onEvent(): void {
      this.$emit("update:modelValue", this.keywords);
    }
  }
}
</script>

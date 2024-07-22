<template>
  <div>
    <MultiSelect v-model="productNames"
                 mode="tags"
                 :show-count-in-label="true"
                 :allow-create-options="true"
                 :is-searchable="true"
                 :allow-show-options-list="false"
                 :options="[]"
                 :label="$t('orderPaymentsOverview.filters.productNames.label')"
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
  data(): ComponentData {
    return {
      productNames: [],
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
      this.$emit("update:modelValue", this.productNames);
    }
  }
}
</script>

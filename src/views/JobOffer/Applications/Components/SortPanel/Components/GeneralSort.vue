<template>
  <div>
    <MultiSelect :options="sortOptionsForSelect"
                 :label="$t('sort.label')"
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

import SortTypesMixin  from "@/views/JobOffer/Applications/Mixin/Sort/SortTypesMixin.vue";

export default {
  name: "JobOfferApplicationFilterPanelSort",
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
    }
  },
  mixins: [
    SortTypesMixin
  ],
  methods: {
    onEvent(): void {
      this.$emit("update:modelValue", this.status);
    }
  }
}
</script>

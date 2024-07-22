<template>
  <div>
    <v-input type="text"
             :label="$t('jobOfferSearchEntries.filters.locationName.label')"
             :is-gray="true"
             class="lg:ml-2 detail-input"
             v-model="name"
             :value="modelValue"
             @input="onInput"
    />
  </div>
</template>

<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import Input       from "@/components/Form/Input.vue";

export default {
  name: "SearchResultLocationNameFilter",
  data(): ComponentData {
    return {
      name: null,
    }
  },
  props: {
    modelValue: {
      required: false,
    }
  },
  components: {
    "v-input": Input,
  },
  methods: {
    /**
     * @description handler for when the location name input update
     */
    onInput($event): void {
      this.$emit('update:modelValue', $event.target.value);
    }
  },
}
</script>

<template>
  <div>
    <v-input type="number"
             min="0"
             :label="$t('jobOfferSearchEntries.filters.distance.label')"
             :is-gray="true"
             class="detail-input"
             v-model="distance"
             :value="modelValue"
             @input="onInput"
    />
  </div>
</template>

<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import Input       from "@/components/Form/Input.vue";
import StringTypeProcessor from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";

export default {
  name: "SearchResultLocationDistanceFilter",
  data(): ComponentData {
    return {
      distance: null,
    }
  },
  props: {
    modelValue: {
      required: false,
    }
  },
  components: {
    "v-input": Input
  },
  methods: {
    /**
     * @description handler for when the location distance input update
     */
    onInput($event): void {
      let value = (StringTypeProcessor.isEmptyString($event.target.value) ? null : parseInt($event.target.value));
      this.$emit('update:modelValue', value);
    }
  },
}
</script>

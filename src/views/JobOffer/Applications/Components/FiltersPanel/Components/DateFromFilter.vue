<template>
  <div>
    <v-input type="date"
             :label="$t('filters.dateFrom.label')"
             :is-gray="true"
             class="ml-2 detail-input"
             v-model="dateFrom"
             :value="modelValue"
             @input="onInput"
    />
  </div>
</template>

<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import Input from "@/components/Form/Input.vue";

export default {
  name: "JobOfferApplicationFilterPanelDateFrom",
  data(): ComponentData {
    return {
      dateFrom: null,
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

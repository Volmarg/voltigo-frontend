<template>
  <div>
    <v-input type="date"
             :label="$t('filters.dateTo.label')"
             :is-gray="true"
             class="ml-2 detail-input"
             v-model="dateTo"
             :value="modelValue"
             @input="onInput"
    />
  </div>
</template>

<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import Input from "@/components/Form/Input.vue";

export default {
  name: "JobOfferApplicationFilterPanelDateTo",
  data(): ComponentData {
    return {
      dateTo: null,
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
     * @description handler for when the date to filter changes
     */
    onInput($event): void {
      this.$emit('update:modelValue', $event.target.value);
    }
  },
}
</script>

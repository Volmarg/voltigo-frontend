<template>
  <div>
    <v-input type="text"
             :label="$t('filters.jobTitle.label')"
             :is-gray="true"
             class="ml-2 detail-input"
             v-model="jobTitle"
             :value="modelValue"
             @input="onInput"
    />
  </div>
</template>

<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import Input from "@/components/Form/Input.vue";

export default {
  name: "JobOfferApplicationFilterPanelJobTitle",
  data(): ComponentData {
    return {
      jobTitle: null,
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
     * @description handler for when the job title changes
     */
    onInput($event): void {
      this.$emit('update:modelValue', $event.target.value);
    }
  },
}
</script>

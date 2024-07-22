<template>
  <div>
    <v-input type="text"
             :label="$t('filters.companyName.label')"
             :is-gray="true"
             class="ml-2 detail-input"
             v-model="name"
             :value="modelValue"
             @input="onInput"
    />
  </div>
</template>

<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import Input from "@/components/Form/Input.vue";

export default {
  name: "JobOfferApplicationFilterPanelCompanyName",
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
     * @description handler for when the company name changes
     */
    onInput($event): void {
      this.$emit('update:modelValue', $event.target.value);
    }
  },
}
</script>

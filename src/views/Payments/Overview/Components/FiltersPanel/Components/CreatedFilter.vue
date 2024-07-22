<template>
  <div>
    <v-input type="date"
             :label="$t('orderPaymentsOverview.filters.createdDate.label')"
             :is-gray="true"
             class="ml-2 detail-input"
             :value="modelValue"
             v-model="date"
             @input="onInput"
    />
  </div>
</template>

<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import Input from "@/components/Form/Input.vue";

export default {
  data(): ComponentData {
    return {
      date: null,
    }
  },
  props: {
    modelValue: {
      required:  false,
    },
  },
  components: {
    'v-input': Input,
  },
  methods: {
    /**
     * @description handler for when the date gets updated
     */
    onInput($event): void {
      this.$emit('update:modelValue', $event.target.value);
    }
  },
}
</script>

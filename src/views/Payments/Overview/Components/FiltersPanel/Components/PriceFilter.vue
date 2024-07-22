<template>
  <div>
    <v-input type="number"
             min="0"
             :step="0.01"
             :label="label"
             :is-gray="true"
             class="detail-input"
             v-model="price"
             :value="modelValue"
             @input="onInput"
    />
  </div>
</template>

<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import Input from "@/components/Form/Input.vue";

import StringTypeProcessor from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";

export default {
  data(): ComponentData {
    return {
      price: null,
    }
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      required: false,
    }
  },
  components: {
    "v-input": Input
  },
  methods: {
    /**
     * @description handler for when the location price input update
     */
    onInput($event): void {
      let value = (StringTypeProcessor.isEmptyString($event.target.value) ? null : parseFloat($event.target.value));
      this.$emit('update:modelValue', value);
    }
  },
}
</script>

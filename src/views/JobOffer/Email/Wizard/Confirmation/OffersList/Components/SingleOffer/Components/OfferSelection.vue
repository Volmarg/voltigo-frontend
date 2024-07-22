<template>
  <div>

    <v-checkbox
        v-model="isChecked"
        @click="isTouched = true"
    />

  </div>
</template>

<script lang="ts">

import Checkbox from "@/components/Form/Checkbox.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

export default {
  data(): ComponentData {
    return {
      isTouched: false,
      isMounted: false,
      isChecked: false,
    }
  },
  props: {
    modelValue: {
      required: false,
    },
    forcedIsChecked: {
      type     : [Boolean, null],
      required : false,
      default  : null,
    }
  },
  components: {
    'v-checkbox': Checkbox,
  },
  emits: [
    'update:modelValue',
    'deSelected',
    'selected',
  ],
  created() {
    this.isChecked = this.modelValue;
  },
  mounted(): void {
    this.isMounted = true;
  },
  watch: {
    isChecked() {
      if (!this.isTouched) {
        return;
      }

      this.$emit('update:modelValue', this.isChecked);

      if (!this.isChecked) {
        this.$emit('deSelected')
      }

      // this is required, else when opening the WizardModal it auto closes and de-selects all offers
      if (this.isChecked && this.isMounted) {
        this.$emit('selected');
      }
    },
    modelValue() {
      this.isChecked = this.modelValue;
    }
  },
}
</script>
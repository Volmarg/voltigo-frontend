<template>
  <div>
    <VueInput
        :is-required="false"
        top-wrapper-classes=""
        type="text"
        :label="$t('actionsPanel.search.label')"
        v-model="value"
        @input="$emit('input', {value: value.trim()})"
    />
  </div>
</template>

<script lang="ts">
import Input from "@/components/Form/Input.vue";
import {ComponentData} from "@/scripts/Vue/Types/Components/types";
export default {
  data(): ComponentData {
    return {
      value: "",
    }
  },
  emits: [
    'input'
  ],
  components: {
    "VueInput": Input
  }
}
</script>
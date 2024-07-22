<template>
  <div>
    <MultiSelect
        mode="tags"
        :allow-create-options="true"
        @change="onMultiSelectChanged"
        @select="onMultiSelectChanged"
        @deselect="onMultiSelectChanged"
        @clear="onMultiSelectChanged"
        @paste="onMultiSelectChanged"
        :options="options"
        :tag-classes="tagClasses"
        :label="label"
        :ref="refName"
        v-model="names"
        :show-count-in-label="true"
    />
  </div>
</template>

<script lang="ts">
import MultiSelect from "@/components/Form/MultiSelect.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

export default {
  data(): ComponentData {
    return {
      names   : [],
      options : [],
      refName : 'namesMultiselect'
    }
  },
  props: {
    label: {
      type     :String,
      required : true,
    },
    tagClasses: {
      type     : [String, null],
      required : false,
      default  : null,
    }
  },
  methods: {
    /**
     * @description handle multi select value being changed,
     *              assign value to names
     */
    onMultiSelectChanged(value: Array<string>): void {
      this.names = value;
      this.$emit("update:modelValue", value);
    }
  },
  components: {
    MultiSelect,
  },
  watch: {
    modelValue() {
      this.names   = this.modelValue;
      this.options = this.modelValue;
    }
  }
}
</script>
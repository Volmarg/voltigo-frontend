<template>
  <MultiSelect
      :label="$t('jobOfferSearch.page.modal.advancedSetting.limitSelect.label')"
      :options="selectOptions"
      @change="onOptionChanged"
      @select="onOptionChanged"
      @deselect="onOptionChanged"
      @clear="onOptionChanged"
      @paste="onOptionChanged"
      v-model="selectedLimit"
      mode="single"
      :allow-show-options-list="true"
      :allow-create-options="false"
      :can-clear="false"
      :required="true"
  />
</template>

<script lang="ts">
import MultiSelect from "@/components/Form/MultiSelect.vue";

import {ComponentData}               from "@/scripts/Vue/Types/Components/types";
import {PointShopSearchTagLimitEnum} from "@/scripts/Enum/PointShopProductEnum";

export default {
  data(): ComponentData {
    return {
      selectOptions: [],
      selectedLimit: 0,
    }
  },
  props: {
    /** @type Array<PointShopProduct> */
    options: {
      type: Array,
      required: true,
    }
  },
  components: {
    MultiSelect
  },
  methods: {
    /**
     * @description return select options array
     */
    getOptions(): Array<Record<string, string | null | number|boolean>> {
      let options = [] as Array<Record<string, string | null | number|boolean>>;
      for (let product of this.options) {
        let limit = PointShopSearchTagLimitEnum[product.internalIdentifier] ?? undefined;
        let label = (
              !limit
            ? this.$t('jobOfferSearch.page.modal.advancedSetting.limitSelect.option.noLimit')
            : `${limit} ${this.$t('jobOfferSearch.page.modal.advancedSetting.limitSelect.option.postfix')}`
        )

        options.push({
          label: label,
          value: limit,
          selected: !limit,
        })
      }

      return options;
    },
    /**
     * @description will save + emit the selected country when country selection option changes
     */
    onOptionChanged(value: number): void {
      this.selectedLimit = value;
      this.$emit('update:modelValue', value);
    }
  },
  created(): void {
    this.selectOptions = this.getOptions();
  },
}
</script>
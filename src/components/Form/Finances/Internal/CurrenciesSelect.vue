<template>

  <multi-select :label="$t('form.currency.allCurrencies.targetCurrency.label')"
                :options="selectOptions"
                @change="onOptionChanged"
                @select="onOptionChanged"
                @deselect="onOptionChanged"
                @clear="onOptionChanged"
                @paste="onOptionChanged"
                :is-searchable="true"
                :allow-show-options-list="true"
                :allow-create-options="false"
                v-model="selection"
                :required="required"
                :has-errors="hasErrors"
  />

</template>

<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import MultiSelect from "@/components/Form/MultiSelect.vue";

import CurrencyCodesMixin from "@/mixins/Finances/Currency/CurrencyCodesMixin.vue";

export default {
  data(): ComponentData {
    return {
      selection: null,
      selectedCurrency: null,
    }
  },
  props: {
    required: {
      type     : Boolean,
      required : false,
      default  : false
    },
    initialValue: {
      required: false,
      default : null,
    },
    hasErrors: {
      type     : Boolean,
      required : false,
      default  : false,
    },
  },
  components: {
    "multi-select": MultiSelect,
  },
  mixins: [
    CurrencyCodesMixin
  ],
  computed: {
    /**
     * @description will return select options
     */
    selectOptions(): Array<Record<string, unknown>> {
      let options = [] as Array<Record<string, unknown>>;
      for (let currencyCodeKey of Object.keys(this.currencyCodes)) {

        let currencyName = this.currencyCodes[currencyCodeKey];
        let label        = `${currencyName} (${currencyCodeKey})`;

        options.push({
          label: label,
          value: currencyCodeKey,
        })
      }

      return options;
    },
  },
  methods: {
    /**
     * @description will save + emit the selected currencies when selected option changes
     */
    onOptionChanged(value: unknown): void {
      this.selectedCurrency = value;
      this.$emit('update:modelValue', this.selectedCurrency);
    }
  },
  async created(): Promise<void> {
    this.selection = this.initialValue;
    await this.getAllCurrencyCodes();
  }
}
</script>
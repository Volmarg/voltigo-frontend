<template>
  <multi-select :label="label"
                :options="selectOptions"
                @change="onOptionChanged"
                @select="onOptionChanged"
                @deselect="onOptionChanged"
                @clear="onOptionChanged"
                @paste="onOptionChanged"
                :mode="mode"
                :is-searchable="true"
                :allow-show-options-list="true"
                :allow-create-options="false"
                v-model="selection"
                :required="required"
                :has-errors="hasErrors"
                :violations="violations"
                :disabled="disabled"
  />

</template>

<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";
import {Country}       from "@/scripts/Entity/Geolocation/Country";

import MultiSelect from "@/components/Form/MultiSelect.vue";
import CountryFlag from "@/components/Libs/CountryFlag/CountryFlag.vue";

import {shallowRef} from "vue";
import TypeChecker  from "@/scripts/Core/Services/Types/TypeChecker";
import BaseError    from "@/scripts/Core/Error/BaseError";

export default {
  name: "FormCountrySelect",
  data(): ComponentData {
    return {
      selection: null,
      selectedCountries: null,
    }
  },
  props: {
    disabled: {
      type     : Boolean,
      required : false,
      default  : false
    },
    required: {
      type     : Boolean,
      required : false,
      default  : false
    },
    initialValue: {
      required: false,
      default : null,
    },
    mode: {
      type     : String,
      required : false,
      default  : "tags"
    },
    label: {
      type     : String,
      required : true,
    },
    countriesData: {
      type     : Array as unknown as Array<Country>,
      required : true,
      validator(value: Array<Record<string, string>>): boolean {

        for (let object of value) {
          let objectJson = JSON.stringify(value);
          if (TypeChecker.isUndefined(object.countryName)) {
            throw new BaseError("`countriesData` value is missing the property: `countryName`. Got object: " + objectJson)
          }

          if (TypeChecker.isUndefined(object.countryIsoCode)) {
            throw new BaseError("`countriesData` value is missing the property: `countryIsoCode`. Got object: " + objectJson)
          }
        }

        return true;
      }
    },
    violations: {
      type     : Array,
      required : true,
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
  computed: {
    /**
     * @description will return select options
     */
    selectOptions(): Array<Record<string, unknown>> {
      let options = [] as Array<Record<string, unknown>>;
      for(let country of this.countriesData){

        options.push({
          label: country.countryName,
          value: country.countryIsoCode,
          component: shallowRef(CountryFlag),
          props: {
            countryIsoCode: country.countryIsoCode
          },
        })
      }

      return options;
    },
  },
  methods: {
    /**
     * @description will save + emit the selected country when country selection option changes
     */
    onOptionChanged(value: unknown): void {
      this.selectedCountries = value;
      this.$emit('update:modelValue', this.selectedCountries);
    }
  },
  created(): void {
    this.selection = this.initialValue;
  }
}
</script>
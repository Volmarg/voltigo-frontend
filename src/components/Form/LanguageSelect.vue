<template>
  <multi-select :label="label"
                :options="selectOptions"
                v-model="selectedLanguages"
                mode="tags"
                :is-searchable="true"
                :allow-show-options-list="true"
                :allow-create-options="false"
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
  name: "FormLanguageSelect",
  data(): ComponentData {
    return {
      selectedLanguages: null,
    }
  },
  props: {
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

          if (TypeChecker.isUndefined(object.countryLanguage)) {
            throw new BaseError("`countriesData` value is missing the property: `countryLanguage`. Got object: " + objectJson)
          }

          if (TypeChecker.isUndefined(object.countryIsoCode)) {
            throw new BaseError("`countriesData` value is missing the property: `countryIsoCode`. Got object: " + objectJson)
          }
        }

        return true;
      }
    }
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
          label: country.countryLanguage,
          value: country.countryLanguage,
          component: shallowRef(CountryFlag),
          props: {
            countryIsoCode: country.countryIsoCode
          },
        })
      }

      return options;
    }
  },
  watch: {
    selectedLanguages(): void {
      this.$emit('change', this.selectedLanguages);
    }
  }
}
</script>
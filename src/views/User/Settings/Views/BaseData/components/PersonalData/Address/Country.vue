<template>
  <div>
    <CountrySelect :label="$t('views.user.baseData.personalData.form.address.country.label')"
                   :countries-data="allSupportedCountriesData"
                   :violations="violations"
                   :required="true"
                   mode="single"
                   v-model="selectedCountry"
                   @update:modelValue="$emit('change', selectedCountry)"
    />

  </div>
</template>

<script lang="ts">

import CountrySelect   from "@/components/Form/GeoLocation/CountrySelect.vue";
import {Country}       from "@/scripts/Entity/Geolocation/Country";
import IsoCountries    from "@/scripts/Libs/IsoCountries";
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

/**
 * @description this component is not supporting v-model on purpose, which is some issue with the component not passing
 *              forward the `update:modelValue` on change, all the events are emitted properly but this one not,
 *              thus using the "change" emission
 */
export default {
  data(): ComponentData {
    return {
      selectedCountry: null,
    }
  },
  props: {
    violations: {
      type     : Array,
      required : true,
    },
    modelValue: {
      required: false,
    },
    initialValue: {
      type     : String,
      required : true,
    }
  },
  components: {
    CountrySelect
  },
  emits: [
    "change"
  ],
  computed: {
    /**
     * @description will return the language data in form of Country Array
     */
    allSupportedCountriesData(): Array<Country> {
      let allCountries = IsoCountries.getAllCountriesData();

      return allCountries;
    },
  },
  mounted(): void {
    this.selectedCountry = this.initialValue.toUpperCase();
  }
}
</script>
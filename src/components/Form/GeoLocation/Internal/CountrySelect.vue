<template>
  <div>

    <CountrySelect :label="$t('views.user.baseData.personalData.form.address.country.label')"
                   :countries-data="allSupportedCountriesData"
                   :required="required"
                   mode="single"
                   v-model="selectedCountry"
                   @update:modelValue="$emit('change', selectedCountry)"
                   :has-errors="hasErrors"
                   :violations="violations"
                   :disabled="disabled"
    />

  </div>
</template>

<script lang="ts">

import CountrySelect   from "@/components/Form/GeoLocation/CountrySelect.vue";

import {Country}       from "@/scripts/Entity/Geolocation/Country";
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import IsoCountries                         from "@/scripts/Libs/IsoCountries";
import SymfonyRoutes                        from "@/router/SymfonyRoutes";
import SymfonySystemRoutes                  from "@/router/SymfonyRoutes/SymfonySystemRoutes";
import InternallySupportedCountriesResponse from "@/scripts/Response/System/GeoData/InternallySupportedCountriesResponse";
import {CountryData}                        from "@/scripts/Response/System/GeoData/InternallySupportedCountriesResponse";

/**
 * @description this component is not supporting v-model on purpose, which is some issue with the component not passing
 *              forward the `update:modelValue` on change, all the events are emitted properly but this one not,
 *              thus using the "change" emission
 *
 * @description other thing is also that the countries that are present in this select are NOT all the countries
 *              available but rather the system-wide (internally supported) ones used for example for payments etc.
 */
export default {
  data(): ComponentData {
    return {
      internallySupportedCountriesData: [] as Array<CountryData>,
      internallySupportedTwoDigitCountryCodes: [] as Array<string>,
      selectedCountry: null,
    }
  },
  props: {
    hasErrors: {
      type     : Boolean,
      required : false,
      default  : false,
    },
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
     *              The {@see IsoCountries.getAllCountriesData}
     *              gets reduced by the {@see CountrySelect.getInternallySupportedCountriesData}, so in the end
     *              only the backend supported countries are getting listed.
     */
    allSupportedCountriesData(): Array<Country> {
      let allCountries = IsoCountries.getAllCountriesData().filter( (country: Country) => {
        return this.internallySupportedTwoDigitCountryCodes.includes(country.countryIsoCode.toUpperCase());
      });

      return allCountries;
    },
  },
  methods: {
    /**
     * @description returns array of {@see CountryData}
     */
    async getInternallySupportedCountriesData(): Promise<Array<CountryData>> {
      if (this.disabled) {
        return new Promise((resolve) => {
          resolve([]);
        });
      }

      let route = SymfonyRoutes.buildUrl(SymfonySystemRoutes.GET_INTERNALLY_SUPPORTED_COUNTRIES_DATA);

      this.$rootEvent.showFullPageLoader();
      return this.$axios.getWithCsrf(route, InternallySupportedCountriesResponse).then( (response: InternallySupportedCountriesResponse) => {
        this.$rootEvent.hideFullPageLoader();
        return response.countriesData;
      })
    }
  },
  async mounted(): Promise<void> {
    this.selectedCountry                         = this.initialValue;
    this.internallySupportedCountriesData        = await this.getInternallySupportedCountriesData();
    this.internallySupportedTwoDigitCountryCodes = this.internallySupportedCountriesData.map((countryData: CountryData) => {
      return countryData.twoDigitCode;
    })
  }
}
</script>
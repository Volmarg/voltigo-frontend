<template>
  <container class="mb-4 flex flex-col company-filters">
    <div class="text-left font-bold mb-2">
      {{ $t('filters.company.label') }}
    </div>

    <div class="grid grid-rows-1 lg:grid-rows-2 grid-cols-1 gap-2">
      <div class="row-2-inputs">
        <v-input type="number"
                 min="0"
                 :label="$t('filters.company.ageOld')"
                 :is-gray="true"
                 class="detail-input"
                 input-classes="job-search-detail-filter-input-min-height"
                 v-model="ageOld"
        />

        <v-input type="number"
                 :min="0"
                 :label="$t('filters.company.employees')"
                 :is-gray="true"
                 class="detail-input"
                 v-model="employeesMin"
        />
      </div>

      <div class="row-2-inputs">
        <!-- this is disabled on purpose, the logic is already there on front and back but is not enabled due to geo tool not being launched on go-live (to expensive) -->
<!--        <multi-select :options="countriesForSelect"-->
<!--                      v-model="countries"-->
<!--                      :label="$t('filters.company.countries')"-->
<!--                      :is-full-height="false"-->
<!--                      :allow-show-options-list="true"-->
<!--                      :is-searchable="false"-->
<!--                      mode="tags"-->
<!--                      :allow-create-options="true"-->
<!--                      :show-count-in-label="true"-->
<!--        />-->

        <multi-select :options="citiesForSelect"
                      v-model="cities"
                      :label="$t('filters.company.cities')"
                      :allow-show-options-list="true"
                      :is-searchable="true"
                      :is-full-height="false"
                      mode="tags"
                      :show-count-in-label="true"
        />
      </div>

    </div>

    <NameSet
        @included-name-change="includedNames = $event"
        @excluded-name-change="excludedNames = $event"
    />

  </container>
</template>

<script lang="ts">
import {ComponentData}    from "@/scripts/Vue/Types/Components/types";
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";
import {PropType}         from "vue";

import {CityFilterValue, CountryFilterValue} from "@/scripts/Response/Job/Offer/GetJobOffers";

import MultiSelect from "@/components/Form/MultiSelect.vue";
import Container   from "@/components/Ui/Containers/Container.vue";
import NameSet     from "@/views/JobOffer/SearchResult/Details/Components/FiltersPanel/Company/components/NameSet.vue";
import Input       from "@/components/Form/Input.vue";

export default {
  name: "OffersFilterPanelCompany",
  data(): ComponentData {
    return {
      ageOld: null,
      employeesMin: null,
      countries: [],
      cities: [],
      includedNames: [],
      excludedNames: [],
    }
  },
  props: {
    citiesFiltersValues: {
      type: Object as PropType<Array<CityFilterValue>>,
      required: true,
    },
    countriesFiltersValues: {
      type: Object as PropType<Array<CountryFilterValue>>,
      required: true,
    },
    allJobOffers: {
      type     : Array as unknown as Array<JobOfferAnalyzed>,
      required : true,
    },
    forcedAgeOld: {
      type     : [Number, null],
      required : false,
      default  : null,
    },
    forcedEmployeesMin: {
      type      : [Number, null],
      required  : false,
      default   : null,
    },
    forcedCountries: {
      type      : [Array],
      required  : false,
      default   : () => {
        return [];
      },
    },
    forcedCities: {
      type      : [Array],
      required  : false,
      default   : () => {
        return [];
      },
    },
  },
  components: {
    "v-input"      : Input,
    "container"    : Container,
    "multi-select" : MultiSelect,
    NameSet
  },
  computed: {
    /**
     * @description will return cities that user can select from the list
     **/
    citiesForSelect(): Array<Record<string, string | boolean>> {
      let data = [] as Array<Record<string, string | boolean>>;

      for (let cityName of Object.keys(this.citiesFiltersValues)) {
        let cityFilterValue = this.citiesFiltersValues[cityName];
        let cityLabel       = `${cityFilterValue.cityName}`;

        if (!cityFilterValue.offersCount) {
          continue;
        }

        data.push({
          value: cityFilterValue.cityName,
          label: cityLabel,
        });
      }

      return data;
    },
    /**
     * @description will return countries that user can select from the list
     **/
    countriesForSelect(): Array<Record<string, string | boolean>> {
      let data = [] as Array<Record<string, string | boolean>>;

      for (let countryName of Object.keys(this.countriesFiltersValues)) {
        let countryFilterValue = this.countriesFiltersValues[countryName];
        let countryLabel       = `${countryFilterValue.countryName} (${countryFilterValue.offersCount} ${this.$t('filters.company.texts.offers')})`;

        if (!countryFilterValue.offersCount) {
          continue;
        }

        data.push({
          value: countryFilterValue.countryName,
          label: countryLabel,
        });
      }

      return data;
    },
  },
  methods: {
    /**
     * @default will return the filters state / values
     */
    getFilters(): Record<string, unknown> {
      return {
        employeesMin : this.employeesMin,
        countries    : this.countries,
        cities       : this.cities,
        ageOld       : this.ageOld,
        includedCompanyNames: this.includedNames,
        excludedCompanyNames: this.excludedNames,
      };
    },
  },
  watch: {
    forcedAgeOld() {
      this.ageOld = this.forcedAgeOld;
    },
    forcedEmployeesMin() {
      this.employeesMin = this.forcedEmployeesMin
    },
    forcedCountries() {
      this.countries = this.forcedCountries
    },
    forcedCities() {
      this.cities = this.forcedCities
    },
  }
}
</script>

<style lang="scss" scoped>
.company-filters {
  .detail-input input {
    min-height: 44px;
  }
}

.row-2-inputs {
  @apply grid grid-rows-1 lg:grid-cols-2 sm:grid-cols-1 gap-2 xl:gap-10 w-full
}
</style>
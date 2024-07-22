<template>
  <container class="mb-4">
    <div class="text-left font-bold mb-2">
      {{ $t('filters.other.label') }}
    </div>

    <div class="mb-4 grid lg:grid-rows-1 lg:grid-cols-1 sm:grid-rows-2 sm:grid-cols-1 gap-10 other-grid">

      <div class="grid lg:grid-rows-1 lg:grid-cols-2 sm:grid-rows-2 sm:grid-cols-1 gap-4 xl:gap-10">
        <!-- spoken languages multi-select -->
        <language-select :label="$t('inputs.language.label')"
                         :class="'w-1/4'"
                         :countries-data="spokenLanguagesCountriesData"
                         @change="onLanguageChange"
        />

        <!-- date picker OR select [up to week old, etc...]-->
        <multi-select :options="whenWasItPostedFilterOptions"
                      v-model="whenWasItPosted"
                      :label="$t('inputs.whenWasItPosted.label')"
        />
      </div>

      <div
          class="grid lg:grid-cols-4 grid-rows-1 grid-cols-4 md:grid-cols-2"
          v-if="isAnySalarySet"
      >
        <!-- salary range -->
        <range :min="lowestSalaryAvailable"
               :max="highestSalaryAvailable"
               @update="onRangeSalaryUpdated"
               :label="$t('inputs.salary.label')"
               class="mb-2 col-start-1 col-end-4 md:col-start-1 md:col-end-2"
        />
      </div>

      <OnlyNewOffers @toggle-only-new-offers="onlyNewOffers = $event"
                     :forced-only-new-offers="forcedOnlyNewOffers"
      />

    </div>
  </container>

</template>

<script lang="ts">
import OnlyNewOffers  from "@/views/JobOffer/SearchResult/Details/Components/FiltersPanel/Other/OnlyNewOffers.vue";
import LanguageSelect from "@/components/Form/LanguageSelect.vue";
import MultiSelect    from "@/components/Form/MultiSelect.vue";
import Container      from "@/components/Ui/Containers/Container.vue";
import Range          from "@/components/Form/Range.vue";

import VuelidateHandler from "@/scripts/Vue/Mixins/VuelidateHandler.vue";

import {Country}          from "@/scripts/Entity/Geolocation/Country";
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";
import {ComponentData}    from "@/scripts/Vue/Types/Components/types";
import useVuelidate       from "@vuelidate/core";

import {POSTED_FILTERING_RULE} from "@/views/JobOffer/SearchResult/Details/Components/FiltersPanel/Enum/FilteringRuleEnum";

import StringTypeProcessor from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";
import IsoCountries        from "@/scripts/Libs/IsoCountries";
import Logger              from "@/scripts/Core/Logger";

export default {
  name: "OffersFilterPanelOther",
  setup: (): Record<string, unknown> => ({ v$: useVuelidate() }),
  data(): ComponentData {
    return {
      onlyNewOffers: false,
      whenWasItPosted: null,
      lowestSalaryAvailable: null,
      selectedLanguages: [],
      highestSalaryAvailable: null,
      salaryMin: null,
      salaryMax: null,
    }
  },
  props: {
    allJobOffers: {
      type     : Array as unknown as Array<JobOfferAnalyzed>,
      required : true,
    },
    minSalaryAvailable: {
      type     : Number,
      required : true,
    },
    maxSalaryAvailable: {
      type     : Number,
      required : true,
    },
    forcedOnlyNewOffers: {
      type     : Boolean,
      required : true,
    },
    forcedWhenWasItPosted: {
      type     : [String, null],
      required : false,
      default  : null,
    },
    forcedSelectedLanguages: {
      type     : Array,
      required : false,
      default  : () => {
        return [];
      }
    },
    forcedSalaryMin: {
      type     : [Number, null],
      required : false,
      default  : null,
    },
    forcedSalaryMax: {
      type     : [Number, null],
      required : false,
      default  : null,
    },
  },
  mixins: [
    VuelidateHandler,
  ],
  components: {
    "range"           : Range,
    "container"       : Container,
    "multi-select"    : MultiSelect,
    "language-select" : LanguageSelect,
    OnlyNewOffers
  },
  computed: {
    /**
     * @description will return the language data in form of Country Array
     */
    spokenLanguagesCountriesData(): Array<Country> {

      let countriesData: Array<Country> = [];
      let humanLanguages: Array<string> = [];

      for (let offer of this.allJobOffers) {
        if (offer.hasHumanLanguages) {
          humanLanguages.push(...Object.values(offer.humanLanguages))
        }
      }

      // leave only unique languages
      humanLanguages = [...new Set(humanLanguages)];
      for (let language of humanLanguages) {

        let languageIsoCode = IsoCountries.getCountry3166IsoCodeForSpokenLanguage(language);
        if (null === languageIsoCode) {
          Logger.warn("No language iso code was found for language named: " + language);
          continue;
        }

        countriesData.push({
          countryName: "", // not needed for language filter
          countryLanguage: language,
          countryIsoCode: languageIsoCode as string,
        })
      }

      return countriesData;
    },
    /**
     * @description will check if any salary
     */
    isAnySalarySet(): boolean {
      return (
          (
                  !StringTypeProcessor.isEmptyString(this.maxSalaryAvailable)
              &&  !StringTypeProcessor.isEmptyString(this.minSalaryAvailable)
          )
          ||
          (
                  !StringTypeProcessor.isEmptyString(this.maxSalaryAvailable)
              &&   StringTypeProcessor.isEmptyString(this.minSalaryAvailable)
          )
      );
    },
    /**
     * @description will return options for the "how old offers are allowed" select
     */
    whenWasItPostedFilterOptions(): Array<Record<string, string>>{
      return [
        {
          label : this.$t('inputs.whenWasItPosted.weekAgo.label'),
          value : this.$t('inputs.whenWasItPosted.weekAgo.value'),
        },
        {
          label : this.$t('inputs.whenWasItPosted.twoWeeksAgo.label'),
          value : this.$t('inputs.whenWasItPosted.twoWeeksAgo.value'),
        },
        {
          label : this.$t('inputs.whenWasItPosted.oneMonthAgo.label'),
          value : this.$t('inputs.whenWasItPosted.oneMonthAgo.value'),
        }
      ];
    }
  },
  methods: {
    /**
     * @description handler for when language gets changed
     */
    onLanguageChange(selectedLanguages: Array<string>): void {
      this.selectedLanguages = selectedLanguages;
    },
    /**
     * @default will return the filters state / values
     */
    getFilters(): Record<string, unknown> {
      return {
        // some filtering rule MUST be provided else the Symfony un-serializer fails on "enum not having such value" even to dto prop is nullable
        whenWasItPosted : this.whenWasItPosted ?? POSTED_FILTERING_RULE[POSTED_FILTERING_RULE.NONE],
        languages       : this.selectedLanguages,
        salaryMin       : this.salaryMin ?? 0,
        salaryMax       : this.salaryMax ?? 0,
        onlyNewOffers   : this.onlyNewOffers,
      };
    },
    /**
     * @description check if all the validated data in this panel is valid
     */
    isValid(): boolean {
      this.v$.$validate();
      this.violations = this.vuelidateErrorsToArrayOfViolationsForProperties(this.v$.$errors);
      return this.isVuelidateResultValid;
    },
    /**
     * @description reacts on range salary being updated
     */
    onRangeSalaryUpdated(rangeValues: Array<number>): void {
      this.salaryMin = rangeValues[0];
      this.salaryMax = rangeValues[1];
    },
    /**
     * @description will set the salary attributes from props
     */
    setSalaries(): void {
      this.lowestSalaryAvailable  = (StringTypeProcessor.isEmptyString(this.minSalaryAvailable) ? 0 : parseInt(this.minSalaryAvailable));
      this.highestSalaryAvailable = (StringTypeProcessor.isEmptyString(this.maxSalaryAvailable) ? 0 : parseInt(this.maxSalaryAvailable));
    }
  },
  created(): void {
    this.setSalaries();
  },
  updated(): void {
    this.setSalaries();
  },
  watch: {
    forcedWhenWasItPosted() {
      this.whenWasItPosted = this.forcedWhenWasItPosted;
    },
    forcedSelectedLanguages() {
      this.selectedLanguages = this.forcedSelectedLanguages;
    },
    forcedSalaryMin() {
      this.salaryMin = this.forcedSalaryMin;
    },
    forcedSalaryMax() {
      this.salaryMax = this.forcedSalaryMax;
    },
    forcedOnlyNewOffers() {
      this.onlyNewOffers = this.forcedOnlyNewOffers;
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/responsive.scss';

@media only screen and (max-width: $tabletBreakingPointPx + 'px') {
  .other-grid {
    grid-template-rows: 1fr 50px;
  }
}
</style>
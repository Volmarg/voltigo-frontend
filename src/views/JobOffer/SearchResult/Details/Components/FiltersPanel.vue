<template>
  <offer-filters ref="offerFilters"
                 :forced-email-required="forcedFilterConfiguration.emailRequired"
                 :forced-location-required="forcedFilterConfiguration.locationRequired"
                 :forced-include-without-posted-date="forcedFilterConfiguration.includeWithoutPostedDate"
                 :forced-must-be-remote="forcedFilterConfiguration.mustBeRemote"
                 :forced-phone-required="forcedFilterConfiguration.phoneRequired"
                 :forced-salary-required="forcedFilterConfiguration.salaryRequired"
                 :forced-speak-language-required="forcedFilterConfiguration.speakLanguageRequired"
  />

  <company-filters ref="companyFilters"
                   :all-job-offers="allJobOffers"
                   :cities-filters-values="offersSearchFilterValues?.cityFilterValues ?? []"
                   :countries-filters-values="offersSearchFilterValues?.countryFilterValues ?? []"
                   :forced-age-old="forcedFilterConfiguration.ageOld"
                   :forced-cities="forcedFilterConfiguration.cities"
                   :forced-countries="forcedFilterConfiguration.countries"
                   :forced-employees-min="forcedFilterConfiguration.employeesMin"
  />
  <other-filters :all-job-offers="allJobOffers"
                 :min-salary-available="offersSearchFilterValues?.minSalary ?? 0"
                 :max-salary-available="offersSearchFilterValues?.maxSalary ?? 0"
                 ref="otherFilters"
                 :forced-salary-max="forcedFilterConfiguration.salaryMax"
                 :forced-salary-min="forcedFilterConfiguration.salaryMin"
                 :forced-selected-languages="forcedFilterConfiguration.languages"
                 :forced-when-was-it-posted="forcedFilterConfiguration.whenWasItPosted"
                 :forced-only-new-offers="forcedFilterConfiguration.onlyNewOffers"
  />

  <keyword-filters ref="keywordFilters"
                   :forced-excluded-keywords="forcedFilterConfiguration.mandatoryExcludedKeywords"
                   :forced-mandatory-included-keywords="forcedFilterConfiguration.mandatoryIncludedKeywords"
                   :forced-mandatory-excluded-keywords-filtering-rule="forcedFilterConfiguration.mandatoryExcludedKeywordsFilteringRule"
                   :forced-mandatory-included-keywords-filtering-rule="forcedFilterConfiguration.mandatoryIncludedKeywordsFilteringRule"
  />

  <!-- this one panel must stay here for easier filters values gathering -->
  <container class="mb-4">
    <row :bottom-margin-size="0"
         class="sm:flex sm:justify-center sm:pt-0"
         flex-direction="flex-col"
         center-wrapper-base-classes="flex flex-col sm:items-center sm:justify-between"
    >
      <medium-button-with-icon text="Filter"
                               @click="filterOffers()"
                               button-classes="w-full flex sm:block sm:justify-start justify-center"
      >
        <template #icon>
          <fa icon="filter"/>
        </template>
      </medium-button-with-icon>
    </row>
  </container>

</template>

<script lang="ts">
import Company  from "@/views/JobOffer/SearchResult/Details/Components/FiltersPanel/Company.vue";
import Keywords from "@/views/JobOffer/SearchResult/Details/Components/FiltersPanel/Keywords.vue";
import Offer    from "@/views/JobOffer/SearchResult/Details/Components/FiltersPanel/Offer.vue";
import Other    from "@/views/JobOffer/SearchResult/Details/Components/FiltersPanel/Other.vue";

import MediumButtonWithIcon from "@/components/Navigation/Button/MediumButtonWithIcon.vue";
import Fontawesome          from "@/components/Libs/Fontawesome.vue";
import Container            from "@/components/Ui/Containers/Container.vue";
import Row                  from "@/components/Ui/Row.vue";

import SymfonyRoutes         from "@/router/SymfonyRoutes";
import SymfonyJobOfferRoutes from "@/router/SymfonyRoutes/SymfonyJobOfferRoutes";
import GetDefaultFilter      from "@/scripts/Response/Job/Filter/GetDefaultFilter";

import GetJobOffers, {FilterValues} from "@/scripts/Response/Job/Offer/GetJobOffers";

import {JobOfferSearchResultDetailFilter} from "@/scripts/Entity/Job/Filter/JobOfferSearchResultDetailFilter";
import {ComponentData}                    from "@/scripts/Vue/Types/Components/types";
import {JobOfferAnalyzed}                 from "@/scripts/Entity/Job/JobOfferAnalyzed";
import {PropType}                         from "vue";

export default {
  name: "JobOfferAnalyseFiltersPanel",
  data(): ComponentData {
    return {
      forcedFilterConfiguration: {} as JobOfferSearchResultDetailFilter, // by the time it's mounted the data is already there
    }
  },
  props: {
    offersSearchFilterValues: {
      type: [Object, null] as PropType<FilterValues> | PropType<null>,
      required: true,
    },
    allJobOffers: {
      type     : Array as unknown as Array<JobOfferAnalyzed>,
      required : true,
    }
  },
  emits: [
      'selectAllVisibleOffers',
      'jobOffersFiltered',
  ],
  components: {
    "company-filters"         : Company,
    "other-filters"           : Other,
    "offer-filters"           : Offer,
    "keyword-filters"         : Keywords,
    "row"                     : Row,
    "container"               : Container,
    "fa"                      : Fontawesome,
    "medium-button-with-icon" : MediumButtonWithIcon,
  },
  methods: {
    /**
     * @description check if all children filters panels are valid
     */
    areChildrenFiltersValid(): boolean {
      let areOtherFiltersValid   = this.$refs.otherFilters.isValid();
      let areKeywordFiltersValid = this.$refs.keywordFilters.isValid();
      return (
            areOtherFiltersValid
        &&  areKeywordFiltersValid
      );
    },
    /**
     * @description will return children filters values
     */
    getChildrenFiltersValues(): Record<string, unknown> {
      let filtersValues = {};
      let refsNames     = ['offerFilters', 'companyFilters', 'otherFilters', 'keywordFilters'];
      for (let refName of refsNames) {
        filtersValues = {
          ...filtersValues,
          ...this.$refs[refName].getFilters()
        };
      }

      return filtersValues;
    },
    /**
     * @description will send the request to backend, supplying the provided filters and getting
     *              filtered offers in return.
     *
     *              It has to be handled this way since backend offers logic is way too complex to rewrite it again
     *              for frontend and to keep it in sync
     */
    filterOffers(): void {

      if (!this.areChildrenFiltersValid()) {
        return;
      }

      let dataBag   = this.getChildrenFiltersValues();
      let calledUrl = SymfonyRoutes.buildUrl(
          SymfonyJobOfferRoutes.URL_GET_FILTERED_JOB_OFFERS,
          {
            [SymfonyJobOfferRoutes.URL_GET_FILTERED_JOB_OFFERS_PARAM_SEARCH_ID]: this.$route.params.id,
          }
      );
      this.$rootEvent.showFullPageLoader();
      this.$axios.postWithCsrf(calledUrl, dataBag, false, {}, GetJobOffers).then( (response: GetJobOffers) => {
        this.$rootEvent.hideFullPageLoader();
        this.$emit("jobOffersFiltered", response);
      })
    },
  },
  async created(): Promise<void> {
    let getDefaultFilter = (): Promise<JobOfferSearchResultDetailFilter> => {
      let calledUrl = SymfonyRoutes.buildUrl(
          SymfonyJobOfferRoutes.URL_GET_OFFERS_OVERVIEW_DEFAULT_FILTER,
          {
            [SymfonyJobOfferRoutes.URL_GET_OFFERS_OVERVIEW_DEFAULT_FILTER_PARAM_SEARCH_ID]: this.$route.params.id
          }
      );

      return this.$axios.getWithCsrf(calledUrl, GetDefaultFilter).then( (response: GetDefaultFilter) => {
        return response.filterData;
      })
    };

    this.forcedFilterConfiguration = await getDefaultFilter();
  }
}

</script>
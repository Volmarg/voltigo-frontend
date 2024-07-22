<template>
  <div>
    <FiltersPanel :search-results="searchResults"
                  @filter-value-changed="onFilterValueChange"
    />

    <container>
      <div v-for="searchResult of visibleSearchResults"
           :key="searchResult.id"
      >

        <SingleResult :search-result="searchResult"/>
      </div>

      <pagination :number-of-results="getSearchResultsCount"
                  :initial-count-of-result-per-page="config.pagination.resultPerPage"
                  :initial-current-page="config.pagination.currentPage"
                  @page-number-changes="onPaginationChange"/>

      <NoResultsText v-if="searchResults.length === 0">
        <p class="mt-4">
          {{ $t('jobOfferSearchEntries.message.goToSearchPage' )}}
          <router-link
              :to="route.jobSearchPath"
              class="ml-1 text-blue-500 hover:opacity-70"
          >
            {{ $t('jobOfferSearchEntries.message.here') }}
          </router-link>
        </p>
      </NoResultsText>

    </container>
  </div>
</template>

<script lang="ts">
import VueRouter              from "@/router/VueRouter";
import moment                 from "moment";
import TypeChecker            from "@/scripts/Core/Services/Types/TypeChecker";
import SymfonyRoutes          from "@/router/SymfonyRoutes";
import SymfonyJobOfferRoutes  from "@/router/SymfonyRoutes/SymfonyJobOfferRoutes";
import GetJobSearchResults    from "@/scripts/Response/Job/Search/GetJobSearchResults";
import {ComponentData}        from "@/scripts/Vue/Types/Components/types";
import {JobSearchResult}      from "@/scripts/Entity/Job/JobSearchResult";
import ArrayTypeProcessor     from "@/scripts/Core/Services/TypesProcessors/ArrayTypeProcessor";
import StringTypeProcessor    from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";

import NoResultsText  from "@/components/Page/NoResultsText.vue";
import Pagination     from "@/components/Ui/Pagination.vue";
import Container      from "@/components/Ui/Containers/Container.vue";
import SingleResult   from "@/views/JobOffer/SearchResult/Overview/Components/SingleResult/SingleResult.vue";
import FiltersPanel   from "@/views/JobOffer/SearchResult/Overview/Components/FiltersPanel/FiltersPanel.vue";

import PaginationMixin         from "@/scripts/Vue/Mixins/Ui/PaginationMixin.vue";
import SearchResultStatusMixin from "@/views/JobOffer/SearchResult/Mixin/SearchResultStatusMixin.vue";

type FilterValues = {
  targetArea       : null | string,
  locationDistance : null | number,
  locationName     : null | string,
  created          : null | string,
  status           : null | string,
  keywords         : Array<string>,
}

export default {
  name: "JobSearchResultOverview",
  data: (): ComponentData => {
    return {
      route: {
        jobSearchPath: VueRouter.ROUTE_PATH_JOB_SEARCH,
      },
      searchResults    : [] as Array<JobSearchResult>,
      visibleSearchResults: [] as Array<JobSearchResult>,
      filteredSearchResults: [] as Array<JobSearchResult>,
      config: {
        pagination: {
          resultPerPage : 10,
          currentPage   : 1,
        }
      },
    }
  },
  components: {
    "container"  : Container,
    "pagination" : Pagination,
    SingleResult,
    FiltersPanel,
    NoResultsText
  },
  mixins: [
    PaginationMixin,
    SearchResultStatusMixin,
  ],
  computed: {
    /**
     * @description will return amount of search results
     */
    getSearchResultsCount(): number {
      return this.filteredSearchResults.length;
    }
  },
  methods: {
    /**
     * @description will handle the event when page number changes on pagination
     */
    onPaginationChange(currentPage: number, countOfResultsPerPage: number): void {
      this.config.pagination.currentPage = currentPage;
      this.visibleSearchResults          = this.filterShownResultByPagination(currentPage, countOfResultsPerPage, this.filteredSearchResults);
    },
    /**
     * @description will perform ajax call to obtain the job search results
     */
    async fetchSearchResults(): Promise<void> {
      this.$rootEvent.showFullPageLoader();
      let calledUrl = SymfonyRoutes.buildUrl(SymfonyJobOfferRoutes.URL_GET_DISPATCHED_SEARCH_JOB_OFFERS)
      return this.$axios.getWithCsrf(calledUrl, GetJobSearchResults).then((response: GetJobSearchResults) => {
        this.$rootEvent.hideFullPageLoader();

        this.searchResults         = response.searchResults;
        this.filteredSearchResults = response.searchResults;
      });
    },
    /**
     * @description handles 1:1 match
     *
     * @param searchResults
     * @param filterValues
     */
    filterByStatus(searchResults: Array<JobSearchResult>, filterValues: FilterValues): Array<JobSearchResult> {
      return searchResults.filter((searchResult: JobSearchResult) => {
        return (
                TypeChecker.isNull(filterValues.status)
            ||  filterValues.status === searchResult.status
        )
      });
    },
    /**
     * @description returns matches having MINIMUM the provided distance, ignores entries without distance search
     *
     * @param searchResults
     * @param filterValues
     */
    filterByDistance(searchResults: Array<JobSearchResult>, filterValues: FilterValues): Array<JobSearchResult> {
      return searchResults.filter((searchResult: JobSearchResult) => {
        return (
                StringTypeProcessor.isEmptyString(filterValues.locationDistance)
            ||
                (
                        !StringTypeProcessor.isEmptyString(searchResult.maxDistance)
                    &&  (searchResult.maxDistance as number) >= (filterValues.locationDistance as number)
                )
        )
      });
    },
    /**
     * @description handles 1:1 match
     *
     * @param searchResults
     * @param filterValues
     */
    filterByLocationName(searchResults: Array<JobSearchResult>, filterValues: FilterValues): Array<JobSearchResult> {
      return searchResults.filter((searchResult: JobSearchResult) => {
        let locationNameRegexp  = new RegExp(`.*${filterValues.locationName}.*`, "g");
        return (
                StringTypeProcessor.isEmptyString(filterValues.locationName)
            ||  locationNameRegexp.test(searchResult.locationName as string)
        )
      });
    },
    /**
     * @description handles 1:1 match
     *
     * @param searchResults
     * @param filterValues
     */
    filterTargetArea(searchResults: Array<JobSearchResult>, filterValues: FilterValues): Array<JobSearchResult> {
      return searchResults.filter((searchResult: JobSearchResult) => {
        return (
                StringTypeProcessor.isEmptyString(filterValues.targetArea)
            ||  searchResult.targetAreas.includes(filterValues.targetArea as string)
        )
      });
    },
    /**
     * @description matches the entries that were created on THE SAME day or AFTER
     *
     * @param searchResults
     * @param filterValues
     */
    filterByCreatedDate(searchResults: Array<JobSearchResult>, filterValues: FilterValues): Array<JobSearchResult> {
      return searchResults.filter((searchResult: JobSearchResult) => {
        if (StringTypeProcessor.isEmptyString(filterValues.created)){
          return true;
        }

        let createdMoment             = moment(filterValues.created)
        let searchResultCreatedMoment = moment(searchResult.created);

        return searchResultCreatedMoment.isSameOrAfter(createdMoment);
      });
    },
    /**
     * @description filters by the provided keywords,
     *              - this is NOT 1:1 keyword match but rather regexp based match kinda "str_contains"
     *
     * @param searchResults
     * @param filterValues
     */
    filterByKeywords(searchResults: Array<JobSearchResult>, filterValues: FilterValues): Array<JobSearchResult> {
      return searchResults.filter((searchResult: JobSearchResult) => {

        if (ArrayTypeProcessor.isEmpty(filterValues.keywords)) {
          return true;
        }

        for (let filterKeyword of filterValues.keywords) {
          let keywordRegexp = new RegExp(`.*${filterKeyword}.*`, 'i');
          for (let searchResultKeyword of searchResult.keywords) {
            if (keywordRegexp.test(searchResultKeyword)) {
              return true;
            }
          }
        }

        return false;
      });
    },
    /**
     * @description applies filters on when any of its value changes
     */
    onFilterValueChange(filterValues: FilterValues) {
      let filteredResults = this.filterByStatus(this.searchResults, filterValues);
      filteredResults     = this.filterByDistance(filteredResults, filterValues);
      filteredResults     = this.filterByLocationName(filteredResults, filterValues);
      filteredResults     = this.filterTargetArea(filteredResults, filterValues);
      filteredResults     = this.filterByKeywords(filteredResults, filterValues);
      filteredResults     = this.filterByCreatedDate(filteredResults, filterValues);

      this.filteredSearchResults         = filteredResults;
      this.config.pagination.currentPage = 1;
      this.visibleSearchResults          = this.filterShownResultByPagination(this.config.pagination.currentPage, this.config.pagination.resultPerPage, filteredResults);
    }
  },
  async created(): Promise<void>{
    await this.fetchSearchResults();
    this.visibleSearchResults = this.filterShownResultByPagination(this.config.pagination.currentPage, this.config.pagination.resultPerPage, this.filteredSearchResults);
  }
}
</script>
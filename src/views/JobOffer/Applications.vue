<template>
  <div>
    <FiltersPanel @filter-value-changed="onFilterValueChanged"/>
    <SortPanel @sort-value-changed="onSortValueChange"/>

    <container>
      <div class="flex w-full">
        <!-- Applications -->
        <div class="w-full p-2">
          <topRow :amount-of-applications="getAmountOfApplications"/>
          <single-application v-for="(application, index) in visibleApplications"
                             :key="index"
                             :application="application"
          />

          <pagination :number-of-results="getAmountOfApplications"
                      :initial-count-of-result-per-page="config.pagination.resultPerPage"
                      :initial-current-page="config.pagination.currentPage"
                      @page-number-changes="onPaginationChange"/>
        </div>

      </div>

    <NoResultsText v-if="!getAmountOfApplications" />

    </container>
  </div>
</template>

<script lang="ts">
import {ComponentData}  from "@/scripts/Vue/Types/Components/types";
import {JobApplication} from "@/scripts/Entity/Job/JobApplications";

import NoResultsText     from "@/components/Page/NoResultsText.vue";
import Container         from "@/components/Ui/Containers/Container.vue";
import SingleApplication from "@/views/JobOffer/Applications/SingleApplication/SingleJobApplication.vue"
import TopRow            from "@/views/JobOffer/Applications/TopRow.vue";
import Pagination        from "@/components/Ui/Pagination.vue";
import FiltersPanel      from "@/views/JobOffer/Applications/Components/FiltersPanel/FiltersPanel.vue";
import SortPanel         from "@/views/JobOffer/Applications/Components/SortPanel/SortPanel.vue";

import InitialFilterValuesMixin from "@/views/JobOffer/Applications/Mixin/Filter/InitialFilterValuesMixin.vue";
import PaginationMixin          from "@/scripts/Vue/Mixins/Ui/PaginationMixin.vue";
import SortTypesMixin           from "@/views/JobOffer/Applications/Mixin/Sort/SortTypesMixin.vue";

import SymfonyRoutes         from "@/router/SymfonyRoutes";
import SymfonyJobOfferRoutes from "@/router/SymfonyRoutes/SymfonyJobOfferRoutes";
import GetApplications       from "@/scripts/Response/Job/Application/GetApplications";
import TypeChecker           from "@/scripts/Core/Services/Types/TypeChecker";
import StringTypeProcessor   from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";
import moment, {Moment}      from "moment";

import {SortValues}           from "@/views/JobOffer/Applications/Types/Sort/SortTypes";
import InitialSortValuesMixin from "@/views/JobOffer/Applications/Mixin/Sort/InitialSortValuesMixin.vue";

export default {
  data: (): ComponentData => {
    return {
      applications: [] as Array<JobApplication>,
      filteredApplications: [] as Array<JobApplication>,
      visibleApplications: [] as Array<JobApplication>,
      sortValues: {} as SortValues,
      filters: {
        sortBy: null,
        companyName: null,
        jobTitle: null,
        dateFrom: null,
        dateTo: null,
      },
      config: {
        pagination: {
          resultPerPage : 10,
          currentPage   : 1,
        }
      },
    }
  },
  components: {
    "topRow"             : TopRow,
    "pagination"         : Pagination,
    "container"          : Container,
    "single-application" : SingleApplication,
    FiltersPanel,
    SortPanel,
    NoResultsText
  },
  mixins: [
    InitialFilterValuesMixin,
    InitialSortValuesMixin,
    PaginationMixin,
    SortTypesMixin,
  ],
  computed: {
    /**
     * @description Will return amount of applications made
     */
    getAmountOfApplications() :number {
      return this.filteredApplications.length;
    }
  },
  methods: {
    onFilterValueChanged(filterValues): void {
      this.filterValues = filterValues;
      this.filterApplications();
    },
    /**
     * @description handle sort value change
     * @param sortValues
     */
    onSortValueChange(sortValues: SortValues): void {
      this.sortValues = sortValues;
      this.filterApplications();
    },
    /**
     * @description will handle the event when page number changes on pagination
     */
    onPaginationChange(currentPage: number, countOfResultsPerPage: number): void {
      this.config.pagination.currentPage = currentPage;
      this.visibleApplications           = this.filterShownResultByPagination(currentPage, countOfResultsPerPage, this.filteredApplications);
    },
    /**
     * @description will provide job offer applications on which user applied to
     */
    getAll(): void {
      let calledUrl = SymfonyRoutes.buildUrl(SymfonyJobOfferRoutes.URL_GET_APPLICATIONS);
      this.$rootEvent.showFullPageLoader();
      this.$axios.getWithCsrf(calledUrl, GetApplications).then( (response: GetApplications) => {
        this.$rootEvent.hideFullPageLoader();

        this.applications         = response.jobApplications;
        this.filteredApplications = this.applications;
        this.visibleApplications  = this.filterShownResultByPagination(this.config.pagination.currentPage, this.config.pagination.resultPerPage, this.filteredApplications);
      })
    },
    /**
     * @description will apply filters on the applications, results in applications that match provided criteria
     */
    filterApplications(): void {
      this.filteredApplications = this.handleSorting(this.applications);
      this.filteredApplications = this.filterByJobTitle(this.filteredApplications);
      this.filteredApplications = this.filterByCompanyName(this.filteredApplications);
      this.filteredApplications = this.filterByDate(this.filteredApplications);
      this.filteredApplications = this.filterByEmail(this.filteredApplications);
      this.visibleApplications  = this.filterShownResultByPagination(this.config.pagination.currentPage, this.config.pagination.resultPerPage, this.filteredApplications);
    },
    /**
     * @description will filter out the job applications by the email
     */
    filterByEmail(jobApplications: Array<JobApplication>): Array<JobApplication> {
      if (TypeChecker.isNull(this.filterValues.email)) {
        return jobApplications;
      }

      let emailRegexp          = new RegExp(`.*${this.filterValues.email.toLowerCase()}.*`);
      let filteredApplications = jobApplications.filter((jobApplication: JobApplication) => {
        return (null !== jobApplication.email.toLowerCase().match(emailRegexp));
      });

      return filteredApplications;
    },
    /**
     * @description will filter out the job applications by the dates ranges
     */
    filterByDate(jobApplications: Array<JobApplication>): Array<JobApplication> {
      let fromDate = null as null | Moment;
      let toDate   = null as null | Moment;

      if (
              StringTypeProcessor.isEmptyString(this.filterValues.dateFrom)
          &&  StringTypeProcessor.isEmptyString(this.filterValues.dateTo)
      ) {
        return jobApplications;
      }

      if (!StringTypeProcessor.isEmptyString(this.filterValues.dateFrom)) {
        fromDate = moment(this.filterValues.dateFrom);
      }

      if (!StringTypeProcessor.isEmptyString(this.filterValues.dateTo)) {
        toDate = moment(this.filterValues.dateTo);
      }

      let filteredApplications = [] as Array<JobApplication>;
      for (let jobApplication of jobApplications) {
        let createdDate = moment(jobApplication.created);

        if (null !== toDate && null !== fromDate) {
          if (createdDate.isSameOrBefore(toDate) && createdDate.isSameOrAfter(fromDate)) {
            filteredApplications.push(jobApplication);
          }
          continue;
        }

        if (null !== toDate && createdDate.isSameOrBefore(toDate)) {
          filteredApplications.push(jobApplication);
          continue;
        }

        if (null !== fromDate && createdDate.isSameOrAfter(fromDate)) {
          filteredApplications.push(jobApplication);
          continue;
        }
      }

      return filteredApplications;
    },
    /**
     * @description will filter out the job applications by the job title
     */
    filterByJobTitle(jobApplications: Array<JobApplication>): Array<JobApplication> {
      if (TypeChecker.isNull(this.filterValues.jobTitle)) {
        return jobApplications;
      }

      let titleRegexp          = new RegExp(`.*${this.filterValues.jobTitle.toLowerCase()}.*`);
      let filteredApplications = jobApplications.filter((jobApplication: JobApplication) => {
        return (null !== jobApplication.jobOffer.title.toLowerCase().match(titleRegexp));
      });

      return filteredApplications;
    },
    /**
     * @description will filter out the job applications by the company name
     */
    filterByCompanyName(jobApplications: Array<JobApplication>): Array<JobApplication> {
      if (TypeChecker.isNull(this.filterValues.companyName)) {
        return jobApplications;
      }

      let companyNameRegexp    = new RegExp(`.*${this.filterValues.companyName.toLowerCase()}.*`);
      let filteredApplications = jobApplications.filter((jobApplication: JobApplication) => {
        return (null !== jobApplication.jobOffer.companyName.toLowerCase().match(companyNameRegexp));
      })

      return filteredApplications;
    },
    /**
     * @description will return sorted applications
     */
    handleSorting(jobApplications: Array<JobApplication>): Array<JobApplication> {
      let sortedApplications = [...jobApplications];
      switch (this.sortValues.general) {

        // DATE
        case this.sortOptions.dateAscending:
        {
          return sortedApplications.sort( (currentApplication: JobApplication, nextApplication: JobApplication): number => {
            return new Date(currentApplication.created).getTime() - new Date(nextApplication.created).getTime();
          })
        }

        case this.sortOptions.dateDescending:
        {
          return sortedApplications.sort( (currentApplication: JobApplication, nextApplication: JobApplication): number => {
            return new Date(nextApplication.created).getTime() - new Date(currentApplication.created).getTime();
          })
        }

        // JOB TITLE
        case this.sortOptions.jobTitleAscending:
        {
          return sortedApplications.sort( (currentApplication: JobApplication, nextApplication: JobApplication): number => {
            return currentApplication.jobOffer.title.localeCompare(nextApplication.jobOffer.title);
          })
        }

        case this.sortOptions.jobTitleDescending:
        {
          return sortedApplications.sort( (currentApplication: JobApplication, nextApplication: JobApplication): number => {
            return nextApplication.jobOffer.title.localeCompare(currentApplication.jobOffer.title);
          })
        }

        // COMPANY NAME
        case this.sortOptions.companyNameAscending:
        {
          return sortedApplications.sort( (currentApplication: JobApplication, nextApplication: JobApplication): number => {
            return currentApplication.jobOffer.companyName.localeCompare(nextApplication.jobOffer.companyName);
          })
        }

        case this.sortOptions.companyNameDescending:
        {
          return sortedApplications.sort( (currentApplication: JobApplication, nextApplication: JobApplication): number => {
            return nextApplication.jobOffer.companyName.localeCompare(currentApplication.jobOffer.companyName);
          })
        }

        // OTHER
        default:
          return jobApplications;
      }

    },
  },
  async created(): Promise<void> {
    this.getAll();
    this.visibleApplications = this.filterShownResultByPagination(this.config.pagination.currentPage, this.config.pagination.resultPerPage, this.filteredApplications);
  },
  watch: {
    filterValues: {
      deep: true,
      handler() {
        this.filterApplications();
        this.$nextTick(() => {
          this.config.pagination.currentPage = 1;
        })
      }
    }
  }
}
</script>
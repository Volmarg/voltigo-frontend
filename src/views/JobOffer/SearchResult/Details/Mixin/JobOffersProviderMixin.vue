<script lang="ts">
import SymfonyRoutes         from "@/router/SymfonyRoutes";
import SymfonyJobOfferRoutes from "@/router/SymfonyRoutes/SymfonyJobOfferRoutes";
import GetJobOffers, {FilterValues} from "@/scripts/Response/Job/Offer/GetJobOffers";

import {ToastTypeEnum} from "@/scripts/Libs/ToastNotification";
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

export default {
  data(): ComponentData{
    return {
      allFoundOffersCount: 0,
      returnedOffersCount: 0,
      appliedOffersCount: 0,
      initiallyFetchedOffers : [],
      searchFilteredOffers   : [],
      jobOffers              : [],
      jobOffersForId         : [],
      offersSearchFilterValues : null as unknown as FilterValues,
    }
  },
  methods: {
    /**
     * @description will provide the job offers which user can apply to
     */
    async getJobOffers(isInitialFetch: boolean = false): Promise<void> {
      this.$rootEvent.showFullPageLoader();
      this.isOffersLoadingDone = false;

      let calledUrl = SymfonyRoutes.buildUrl(
          SymfonyJobOfferRoutes.URL_GET_FILTERED_JOB_OFFERS,
          {
            [SymfonyJobOfferRoutes.URL_GET_FILTERED_JOB_OFFERS_PARAM_SEARCH_ID]: this.$route.params.id,
          }
      );

      let filterPanelValues = {};
      if (!isInitialFetch) {
        filterPanelValues = this.$root.getLoggedInUserViewRef().$refs.filtersAccordion.$refs.filterPanel.getChildrenFiltersValues();
      }

      return this.$axios.postWithCsrf(calledUrl, filterPanelValues, false, {}, GetJobOffers).then( (response: GetJobOffers) => {
        this.isOffersLoadingDone = true;
        this.$rootEvent.hideFullPageLoader();

        if(response.success){
          this.setVariablesFromGetOffersResponse(response);
        } else {
          let message = (response.isMessageSet() ? response.message : this.$t('messages.internalServerError'));
          this.$rootEvent.showNotification(ToastTypeEnum.error, message);
        }

      })
    },
    /**
     * @description will set all needed variables based on the {@see GetJobOffers}
     */
    setVariablesFromGetOffersResponse(response: GetJobOffers): void {
      this.initiallyFetchedOffers   = response.jobOffers;
      this.jobOffers                = response.jobOffers;
      this.searchFilteredOffers     = response.jobOffers;
      this.allFoundOffersCount      = response.allFoundOffersCount;
      this.returnedOffersCount      = response.returnedOffersCount;
      this.appliedOffersCount       = response.appliedOffersCount;
      this.offersSearchFilterValues = response.filterValues;

      // this speeds up searching offer for id, helps with optimisation on mobile
      for (let offer of this.jobOffers) {
        this.jobOffersForId[offer.identifier] = offer;
      }
    }
  }
}
</script>
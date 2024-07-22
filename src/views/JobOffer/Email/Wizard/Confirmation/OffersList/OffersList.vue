<template>
  <div>

    <div v-for="(offer, index) in visibleOffers"
         :key="index"
    >
      <SingleOffer :job-offer="offer"
                   :is-open="offer.identifier == openOffer"
                   :is-right-sidebar-visible="isRightSidebarVisible"
                   @offer-selection-changed="$emit('offerSelectionChanged', $event)"
                   @show-right-sidebar="$emit('showRightSidebar', $event, offer)"
      />
    </div>

    <div>
      <Pagination :number-of-results="numberOfAllOffers"
                  :initial-count-of-result-per-page="config.pagination.resultPerPage"
                  :initial-current-page="config.pagination.currentPage"
                  @page-number-changes="onPaginationChange"/>
    </div>
  </div>
</template>

<script lang="ts">
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";
import {ComponentData}    from "@/scripts/Vue/Types/Components/types";

import SingleOffer    from "@/views/JobOffer/Email/Wizard/Confirmation/OffersList/Components/SingleOffer.vue";
import Pagination     from "@/components/Ui/Pagination.vue";
import MiniSingleCard from "@/views/JobOffer/SearchResult/Details/Components/Cards/MiniSingleCard.vue";

import PaginationMixin from "@/scripts/Vue/Mixins/Ui/PaginationMixin.vue";
import ArrayTypeProcessor from "@/scripts/Core/Services/TypesProcessors/ArrayTypeProcessor";

export default {
  data(): ComponentData {
    return {
      visibleOffers: [] as Array<JobOfferAnalyzed>,
      config: {
        pagination: {
          resultPerPage : 5,
          currentPage   : 1,
        }
      },
    }
  },
  props: {
    selectedJobOffers: {
      type     : Array as () => Array<JobOfferAnalyzed>,
      required : true,
    },
    isRightSidebarVisible: {
      type: Boolean,
      required: true,
    },
    openOffer: {
      type: [null, Number],
      required: true,
    },
  },
  emits: [
    'offerSelectionChanged',
  ],
  mixins: [
    PaginationMixin,
  ],
  components: {
    MiniSingleCard,
    SingleOffer,
    Pagination,
  },
  computed: {
    /**
     * @description returns the count of all selected offers
     */
    numberOfAllOffers(): number {
      return this.selectedJobOffers.length;
    }
  },
  methods: {
    /**
     * @description will handle the event when page number changes on pagination
     */
    onPaginationChange(currentPage: number, countOfResultsPerPage: number): void {
      this.config.pagination.currentPage = currentPage;
      this.visibleOffers                 = this.filterShownResultByPagination(currentPage, countOfResultsPerPage, this.selectedJobOffers);
    },
    /**
     * @description handle deciding if the pagination should be decreased or not,
     *              upon deciding that it SHOULD, then it will get decreased
     */
    handlePaginationDecrease(): void {
      if (ArrayTypeProcessor.isEmpty(this.visibleOffers)) {
        this.config.pagination.currentPage--;
      }
    }
  },
  created() {
    this.visibleOffers = this.filterShownResultByPagination(this.config.pagination.currentPage, this.config.pagination.resultPerPage, this.selectedJobOffers);
  },
  watch: {
    selectedJobOffers: {
      deep: true,
      handler(){
        this.visibleOffers = [];
        this.$nextTick(() => {

          // check if any offers are visible on current page, if not then decrease page
          this.visibleOffers = this.filterShownResultByPagination(this.config.pagination.currentPage, this.config.pagination.resultPerPage, this.selectedJobOffers);
          if (ArrayTypeProcessor.isEmpty(this.visibleOffers)) {
            this.handlePaginationDecrease();
            this.visibleOffers = this.filterShownResultByPagination(this.config.pagination.currentPage, this.config.pagination.resultPerPage, this.selectedJobOffers);
          }
        });

      }
    }
  }
}
</script>
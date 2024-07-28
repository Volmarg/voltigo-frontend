<template>

  <div class="flex flex-start">
    <MediumButtonWithIcon :text="$t('searchResults.button.goToDetails')"
                          :is-icon-on-top="true"
                          :is-mobile-full-width="true"
                          @click="$router.push({path: route.searchResults.path})"
                          class="mb-4 flex"
                          button-classes="w-full md:w-auto ml-3 sm:ml-0"
                          margin-right-class-number="4"
    />
  </div>

  <WarningBlock class="mb-5 bg-white text-gray-500 text-2md">
    <div>
      <p>{{ $t('filters.info.keepInMind.autoFilter') }}</p>
      <p class="mt-2 sm:mt-0">{{ $t('filters.info.keepInMind.alreadyAppliedFilter') }}</p>
    </div>
  </WarningBlock>

  <FiltersAccordion
    @job-offer-filtered="onJobOffersFiltered"
    :job-offers="initiallyFetchedOffers"
    :offers-search-filter-values="offersSearchFilterValues"
    ref="filtersAccordion"
  />

  <OffersCountInfoBlock
      class="mb-5"
      :found-count="allFoundOffersCount"
      :applied-count="appliedOffersCount"
      :visible-count="searchFilteredOffers.length"
  />

  <LegendBlock class="mb-5" />

  <ActionsPanel @toggle-all-visible-offers-selection="onToggleAllVisibleOffersSelection"
                @search-changed="onSearchChanged"
                :all-visible-offers-selected="areAllVisibleOffersSelected"
                :all-job-offers="jobOffers"
                ref="actionsPanel"
  />

  <SingleOfferCard
      v-for="(jobOffer, index) in visibleResults.singleCards"
      :key="index"

      :job-offer="jobOffer"
      :is-initially-selected="jobOffer.isSelected"
      :is-right-sidebar-visible="isRightSidebarVisible"
      :is-open="openOffer === jobOffer.identifier"

      :ref="`singleCard-${jobOffer.identifier}`"

      @show-right-sidebar="onShowRightSidebar($event, jobOffer)"
      @card-selection-changed="onCardSelectionChanged"
  />

  <container v-if="visibleResults.singleCards.length === 0" >
    <NoSearchResults />
  </container>

  <Pagination :number-of-results="searchFilteredOffers.length"
              :initial-count-of-result-per-page="config.pagination.normalCards.resultPerPage"
              :initial-current-page="config.pagination.normalCards.currentPage"
              @page-number-changes="onSingleCardPaginationPageNumberChange"
              v-if="visibleResults.singleCards.length !== 0"
  />

  <FixedTopBottom />

  <!-- Right side button -->
  <div v-show="isAtLeastOnOfferSelected">

    <FloatingBoxes
      @show-selected-offers-preview-clicked="showSelectedJobOffersPreview()"
      @show-email-wizard-clicked="isEmailWizardVisible = true"
      :selected-offers="selectedOffers"
    />

    <SelectedOffersListModal
        :selected-offers-count="selectedOffers.length"
        :initial-count-of-result-per-page="miniCardsConfig.pagination.resultPerPage"
        :initial-current-page="miniCardsConfig.pagination.currentPage"
        :visible-results="miniCardsVisibleResults"
        :is-visible="isSelectedJobOfferPreviewVisible"
        :is-right-sidebar-visible="isRightSidebarVisible"
        :open-offer="openOffer"

        @modal-closed="isSelectedJobOfferPreviewVisible = false"
        @show-right-sidebar="onShowRightSidebar"
        @page-number-changes="onMiniCardPaginationPageNumberChange"
        @undo-offer-selection="undoOfferSelection($event.offerId)"
    />

  </div>

  <!-- This was taken outside of the check "is any offer selected" because user is now able to re-select de-selected offer in wizard -->
  <WizardModal
      :job-offer="randomSelectedJobOffer"
      :is-visible="isEmailWizardVisible"
      :is-right-sidebar-visible="isRightSidebarVisible"
      :open-offer="openOffer"

      @modal-closed="isEmailWizardVisible = false"
      @modal-opened="pickOneRandomSelectedJobOffer()"
      @get-random-selected-offer="pickOneRandomSelectedJobOffer()"
      @application-sent="onApplicationsSent()"
      @card-selection-changed="onCardSelectionChanged"
      @show-right-sidebar="onShowRightSidebar"
      @points-fee-fetch-failure="isEmailWizardVisible = false"
  />
</template>

<script lang="ts">

import Container               from "@/components/Ui/Containers/Container.vue";
import LegendBlock             from "@/views/JobOffer/SearchResult/Details/Components/LegendBlock.vue";
import WarningBlock            from "@/components/Page/WarningBlock.vue";
import NoSearchResults         from "@/views/JobOffer/SearchResult/Details/Components/NoSearchResults.vue";
import WizardModal             from "@/views/JobOffer/SearchResult/Details/Components/WizardModal.vue";
import FiltersAccordion        from "@/views/JobOffer/SearchResult/Details/Components/FiltersAccordion.vue";
import OffersCountInfoBlock    from "@/views/JobOffer/SearchResult/Details/Components/OffersCountInfoBlock.vue";
import ActionsPanel            from "@/views/JobOffer/SearchResult/Details/Components/ActionsPanel.vue";
import Pagination              from "@/components/Ui/Pagination.vue";
import SingleOfferCard         from "@/views/JobOffer/SearchResult/Details/Components/Cards/SingleCard.vue";
import FloatingBoxes           from "@/views/JobOffer/SearchResult/Details/Components/Navigation/FloatingBoxes.vue";
import FixedTopBottom          from "@/components/Ui/Navigation/QuickTopBottom/FixedTopBottom.vue";
import MediumButtonWithIcon    from "@/components/Navigation/Button/MediumButtonWithIcon.vue";
import SelectedOffersListModal from "@/views/JobOffer/SearchResult/Details/Components/SelectedOffersListModal.vue";

import DemoAwareMixin              from "@/mixins/Awarness/DemoAwareMixin.vue";
import RightSidebarHandlerMixin    from "@/views/JobOffer/SearchResult/Details/Mixin/RightSidebarHandlerMixin.vue";
import JobOffersProviderMixin      from "@/views/JobOffer/SearchResult/Details/Mixin/JobOffersProviderMixin.vue";
import OffersSelectionHandlerMixin from "@/views/JobOffer/SearchResult/Details/Mixin/OffersSelectionHandlerMixin.vue";
import MiniCardsHandlerMixin       from "@/views/JobOffer/SearchResult/Details/Mixin/MiniCardsHandlerMixin.vue";
import PaginationMixin             from "@/scripts/Vue/Mixins/Ui/PaginationMixin.vue";
import SearchMixin                 from "@/views/JobOffer/SearchResult/Details/Mixin/SearchMixin.vue";

import Logger              from "@/scripts/Core/Logger";
import ArrayTypeProcessor  from "@/scripts/Core/Services/TypesProcessors/ArrayTypeProcessor";
import StringTypeProcessor from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";
import GetJobOffers        from "@/scripts/Response/Job/Offer/GetJobOffers";
import BrowserDetection    from "@/scripts/Core/Services/View/BrowserDetection";

import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";
import {ComponentData}    from "@/scripts/Vue/Types/Components/types";
import {RightSidebarComponentData} from "@/scripts/Vue/Types/Components/Sidebar";

import VueRouter from "@/router/VueRouter";

import {applicationWizardOffersStore, ApplicationWizardOffersStore} from "@/scripts/Vue/Store/ApplicationWizardOffersStore";


export default {
  name: "JobOfferSearchResultDetails",
  data(): ComponentData {
    return {
      route: {
        searchResults: {
          path: VueRouter.ROUTE_PATH_JOB_OFFER_SEARCH_RESULTS,
        }
      },
      openOffer: null as null | number,
      searchedString: "",
      isOffersLoadingDone : false,
      sidebarData            : {},
      randomSelectedJobOffer : {},
      visibleResults         : {
        singleCards : [],
      },
      selectedOffers         : [],
      applicationWizardOffersStore: null as null | ApplicationWizardOffersStore,
      isEmailWizardVisible   : false,
      areAllVisibleOffersSelected: false,
      isSelectedJobOfferPreviewVisible: false,
      config: {
        pagination: {
          normalCards: {
            resultPerPage : 10,
            currentPage   : 1,
          },
        }
      },
    }
  },
  props: {
    isRightSidebarVisible: {
      type: Boolean,
      required: true,
    },
    /** @var {JobOfferAnalyzed} */
    rightSidebarAppliedOffer: {
      type: Object,
      required: true,
    },
    rightSidebarAppliedOffersClicks: {
      type: Object,
      required: true,
    }
  },
  components: {
    MediumButtonWithIcon,
    LegendBlock,
    WarningBlock,
    Container,
    Pagination,
    SingleOfferCard,
    ActionsPanel,
    FloatingBoxes,
    FixedTopBottom,
    NoSearchResults,
    OffersCountInfoBlock,
    SelectedOffersListModal,
    FiltersAccordion,
    WizardModal
  },
  emits: [
    "toggleRightSidebar",
    "rightSidebarContentChanged",
  ],
  mixins: [
    SearchMixin,
    DemoAwareMixin,
    PaginationMixin,
    MiniCardsHandlerMixin,
    JobOffersProviderMixin,
    RightSidebarHandlerMixin,
    OffersSelectionHandlerMixin,
  ],
  computed: {
    /**
     * @description check if information block is visible
     */
    isInformationBlockVisible(): boolean {
      return (
              ArrayTypeProcessor.isEmpty(this.visibleResults.singleCards)
          &&  this.isOffersLoadingDone
      )
    },
    /**
     * @description check if at least one  job offer is selected
     */
    isAtLeastOnOfferSelected(): boolean {
      return (this.selectedOffers.length >= 1);
    }
  },
  methods: {
    /**
     * @description handle user clicking on "Apply" in right-sidebar.
     *              This function simply triggers the whole "selection change" logic
     */
    sidebarApplyClick(offerId: number): void {
      this.onCardSelectionChanged(offerId.toString());

      if (this.isSelectedJobOfferPreviewVisible) {
        this.filterShownMiniCardsOnPage(this.miniCardsConfig.pagination.currentPage, this.miniCardsConfig.pagination.resultPerPage);
      }
    },
    /**
     * @description handle right sidebar getting open
     *              - show sidebar,
     *              - store the current offer id
     */
    onShowRightSidebar(eventData: RightSidebarComponentData, jobOffer: JobOfferAnalyzed): void {
      this.openOffer = jobOffer.identifier;
      this.showRightSidebar(eventData);
    },
    /**
     * @description handler for when the search field changes
     *              - will filter out the offers `on-fly`,
     */
    onSearchChanged(eventData: Record<string, string>): void {
      this.searchedString = eventData.value;

      this.config.pagination.normalCards.constructor = 1;
      this.filterShownSingleCardsOnPage(1, this.config.pagination.normalCards.resultPerPage)
    },
    /**
     * @description will remove the job offer from <selectedOffers> array,
     */
    undoOfferSelection(jobOfferIdentifier: number): void {
      // remove from selected array
      for(let arrayIndex in this.selectedOffers){
        let jobOffer = this.selectedOffers[arrayIndex];

        if(jobOffer.identifier == jobOfferIdentifier){
          this.selectedOffers.splice(parseInt(arrayIndex), 1);
        }
      }

      // Filter the <MiniCard> results due to `un-checking` the offer
      this.filterShownMiniCardsOnPage(this.miniCardsConfig.pagination.currentPage, this.miniCardsConfig.pagination.resultPerPage);

      // either close modal or go to previous page
      if( ArrayTypeProcessor.isEmpty(this.miniCardsVisibleResults) ){
        if(this.miniCardsConfig.pagination.currentPage === 1){
          this.isSelectedJobOfferPreviewVisible = false;
        }else{
          this.miniCardsConfig.pagination.currentPage--;
          this.filterShownMiniCardsOnPage(this.miniCardsConfig.pagination.currentPage, this.miniCardsConfig.pagination.resultPerPage);
        }
      }

      // undo selection on the <SingleCard> array
      this.jobOffersForId[jobOfferIdentifier].isSelected = false;
      this.filterShownSingleCardsOnPage(this.config.pagination.normalCards.currentPage, this.config.pagination.normalCards.resultPerPage);

      // need to force update due to issues with vue object prop reactivity
      this.$forceUpdate();
      this.saveOffersSelection();
    },
    /**
     * @description will return random selected job offer
     */
    pickOneRandomSelectedJobOffer(): void {
      this.randomSelectedJobOffer = ArrayTypeProcessor.getRandomElement(this.selectedOffers);
    },
    /**
     * @description handler for `select all visible` switch state change
     *              will check if all visible offers are selected or not
     */
    onToggleAllVisibleOffersSelection(isActive: boolean): void {
      this.areAllVisibleOffersSelected = isActive;
      this.selectedOffers              = [];

      /**
       * @description that's some weird situation here, because toggling works slow on mobile browsers,
       *              can't find reason for this, on PC it's blasting fast. Decided to show loader.
       *              The loader won't even show if timeout is not added thus, it's been added.
       */
      let timeout = 0;
      if (BrowserDetection.isMobileBrowser()) {
        this.$rootEvent.showFullPageLoader();
        timeout = 50;
      }

      setTimeout(() => {
        // Info: this will most likely need to be updated later in case of some further filters etc
        for (let id in this.jobOffersForId) {
          let result = this.jobOffersForId[id];
          if (StringTypeProcessor.isEmptyString(result.contactDetail.email)) {
            continue;
          }

          result.isSelected = isActive;
          if (isActive) {
            this.selectedOffers.push(result);
          }
        }
        this.filterShownSingleCardsOnPage(this.config.pagination.normalCards.currentPage, this.config.pagination.normalCards.resultPerPage);

        if (BrowserDetection.isMobileBrowser()) {
          this.$rootEvent.hideFullPageLoader();
        }

        this.saveOffersSelection();
      }, timeout);

    },
    /**
     * @description will de-select all offers, and re-fetch them from DB to update the state of offers that are still
     *              available for applications (since offer can be applied only once in a time period)
     */
    async onApplicationsSent(): Promise<void> {
      this.selectedOffers = [];
      this.removeSavedOffersSelection();

      this.jobOffersForId         = [];
      this.initiallyFetchedOffers = [];

      this.$nextTick( async () => {
        await this.getJobOffers(false);

        this.$nextTick( () => {
          this.filterShownMiniCardsOnPage(1, this.miniCardsConfig.pagination.resultPerPage)
          this.filterShownSingleCardsOnPage(1, this.config.pagination.normalCards.resultPerPage)
        })

      })

      this.isEmailWizardVisible = false;
    },
    /**
     * @description handles user filtering the job offers
     *              takes the result of filtered offers and makes them the "currently handled offers"
     */
    onJobOffersFiltered(filterResponse: GetJobOffers): void {
      this.config.pagination.normalCards.currentPage = 1;
      this.setVariablesFromGetOffersResponse(filterResponse);
      this.filterShownSingleCardsOnPage(this.config.pagination.normalCards.currentPage, this.config.pagination.normalCards.resultPerPage);
    },
    /**
     * @description will show selected job offers preview modal
     */
    showSelectedJobOffersPreview(): void {
      this.isSelectedJobOfferPreviewVisible = true;
      this.filterShownMiniCardsOnPage(this.miniCardsConfig.pagination.currentPage, this.miniCardsConfig.pagination.resultPerPage);
    },
    /**
     * @description handles the card selection
     */
    onCardSelectionChanged(searchedIdentifier: string, iSelected: boolean | null = null): void {
      let jobOffer = this.jobOffersForId[searchedIdentifier];

      // toggle
      if (null === iSelected) {
        iSelected = !jobOffer.isSelected;
      }

      if(iSelected){
        jobOffer.isSelected = true;
        this.selectedOffers.push(jobOffer);
        this.saveOffersSelection();
        this.checkAllOffersSelected();
        return;
      }

      for(let arrayIndex in this.selectedOffers){
        let selectedOffer = this.selectedOffers[arrayIndex];

        if(selectedOffer.identifier === searchedIdentifier){
          selectedOffer.isSelected = false;
          this.selectedOffers.splice(arrayIndex, 1);
        }
      }

      if (!this.selectedOffers.length) {
        this.isSelectedJobOfferPreviewVisible = false;
      }

      this.saveOffersSelection();
      this.checkAllOffersSelected();
    },
    /**
     * @description check if all offers are selected
     */
    checkAllOffersSelected(): void {
      this.areAllVisibleOffersSelected = (this.selectedOffers.length === this.jobOffers.length);
    },
    /**
     * @description will return job offer for provided identifier
     */
    getJobOfferForIdentifier(searchedIdentifier: string): JobOfferAnalyzed | null {

      let matchingOfferResult = this.jobOffers.find( (jobOffer) => {
        return jobOffer.identifier === searchedIdentifier;
      }) ?? null;

      if(null === matchingOfferResult){
        Logger.error("Could not find any matching job offer for identifier. Should not happen as the identifier is emitted from card, which is then created from results");
        return null;
      }

      return matchingOfferResult;
    },
    /**
     * @description will filter the <SingleCard> results shown on page
     */
    filterShownSingleCardsOnPage(currentPage: number, countOfResultsPerPage: number): void {
      this.config.pagination.normalCards.currentPage = currentPage;
      this.visibleResults.singleCards                = [];

      this.searchFilteredOffers       = this.filterShownOffersBySearch(this.jobOffers);
      this.visibleResults.singleCards = this.filterShownResultByPagination(currentPage, countOfResultsPerPage, this.searchFilteredOffers);

      // mark selection checkbox
      let selectedIdentifiers = this.selectedOffers.map( (singleResult) => {
        return singleResult.identifier;
      });

      for(let visibleResult of this.visibleResults.singleCards){
        visibleResult.isSelected = selectedIdentifiers.includes(visibleResult.identifier);
      }
    },
    /**
     * @description will handle the event when page number changes on pagination
     */
    onSingleCardPaginationPageNumberChange(currentPage: number, countOfResultsPerPage: number): void {
      this.config.pagination.normalCards.currentPage = currentPage;
      this.filterShownSingleCardsOnPage(currentPage, countOfResultsPerPage);
      this.$view.scrollToElement(this.$refs.actionsPanel.$el);
    },
  },
  async mounted(): Promise<void> {
    await this.getJobOffers(true);
    this.filterShownSingleCardsOnPage(this.config.pagination.normalCards.currentPage, this.config.pagination.normalCards.resultPerPage);

    if (this.isDemo) {
      await this.getJobOffers(false);
      this.filterShownSingleCardsOnPage(this.config.pagination.normalCards.currentPage, this.config.pagination.normalCards.resultPerPage);
    }

    this.loadOffersSelection();
    this.applicationWizardOffersStore = applicationWizardOffersStore();
  },
  watch: {
    isRightSidebarVisible(): void {
      if (!this.isRightSidebarVisible) {
        this.openOffer = null;
      }
    },
    visibleResults: {
      deep: true,
    },
    searchFilteredOffers() {
      this.loadOffersSelection();
    },
    /**
     * @description will refresh the offers selection in store
     */
    isEmailWizardVisible() {
      if (this.isEmailWizardVisible) {
        // unpacking as otherwise the list in HERE is shared with list in store, and this should not happen!
        this.applicationWizardOffersStore.setOffers([...this.selectedOffers]);
        return;
      }
      this.applicationWizardOffersStore.clearOffersSelection();
    },
    /**
     * @description explaining the usage of both props:
     *              - rightSidebarAppliedOffersClicks,
     *              - rightSidebarAppliedOffer,
     *
     *              The rightSidebarAppliedOffer contains information "for which offer was the Apply clicked":
     *              - this however is not enough to propagate from parent, to child via prop, because this never
     *                changes no matter if selected state is true / false. See warning below.
     *
     * > Warning < there was already an idea to watch "rightSidebarAppliedOffer.isSelected" which does make sense
     *             and would reduce the code but also causes the endless loop, cuz once `isSelected` is modified
     *             it will be re-propagated to here, and so it loops.
     *
     *             The rightSidebarAppliedOffersClicks is what actually causes the watcher to react, and it's really
     *             the only reason why this prop exists at all. Once the change has been detected rest operates on the:
     *             `rightSidebarAppliedOffer`.
     */
    rightSidebarAppliedOffersClicks: {
      deep: true,
      handler: function() {
        this.sidebarApplyClick(this.rightSidebarAppliedOffer.identifier);
      }
    }
  }
}
</script>
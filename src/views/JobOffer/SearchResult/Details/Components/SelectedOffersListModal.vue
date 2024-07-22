<template>

  <Modal :title="$t('components.jobOfferSelectedOffersPreview.header.label')"
         :is-visible="isVisible"
         size="small"
         @modal-closed="$emit('modalClosed')"
         backdrop-classes="z-8"
         modal-main-wrapper-classes="z-9"
  >
    <template #content>
      <MiniSingleCard v-for="selectedOffer of visibleResults"
                 :key="selectedOffer.identifier"
                 :job-offer="selectedOffer"
                 :is-open="selectedOffer.identifier == openOffer"
                 :is-right-sidebar-visible="isRightSidebarVisible"

                 @show-right-sidebar="onShowRightSidebar($event, selectedOffer)"
                 :class="'flex justify-start break-all'"
      >

        <input type="checkbox"
               class="form-checkbox h-5 w-5 rounded-lg mr-2"
               v-tippy="$t('components.jobOfferSelectedOffersPreview.miniCard.checkboxApply.tippy.info.text')"
               :checked="true"
               @click.stop
               @click="onUndoOfferSelection(selectedOffer.identifier)"
        >

        <span>
          {{ selectedOffer.jobTitle }}
        </span>

      </MiniSingleCard>

      <Pagination :number-of-results="selectedOffersCount"
                  :initial-count-of-result-per-page="initialCountOfResultPerPage"
                  :initial-current-page="initialCurrentPage"
                  @page-number-changes="onPageNumberChange"
      />
    </template>
  </Modal>
</template>

<script lang="ts">

import Modal          from "@/components/Modal/Modal.vue";
import Pagination     from "@/components/Ui/Pagination.vue";
import MiniSingleCard from "@/views/JobOffer/SearchResult/Details/Components/Cards/MiniSingleCard.vue";

import {ToastTypeEnum} from "@/scripts/Libs/ToastNotification";

import {RightSidebarComponentData} from "@/scripts/Vue/Types/Components/Sidebar";
import {JobOfferAnalyzed}          from "@/scripts/Entity/Job/JobOfferAnalyzed";

export default {
  emits: [
    'modalClosed',
    'showRightSidebar',
    'pageNumberChanges',
    'undoOfferSelection'
  ],
  components: {
    Modal,
    Pagination,
    MiniSingleCard
  },
  props: {
    isVisible: {
      type     : Boolean,
      required : true,
    },
    initialCountOfResultPerPage: {
      type     : Number,
      required : false,
      default  : 2,
    },
    initialCurrentPage: {
      type     : Number,
      required : false,
      default  : 1,
    },
    selectedOffersCount: {
      type     : Number,
      required : true,
    },
    visibleResults: {
      type     : Array,
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
  methods: {
    /**
     * @description emits further the sidebar open event with data
     */
    onShowRightSidebar(eventData: RightSidebarComponentData, jobOffer: JobOfferAnalyzed): void {
      this.$emit('showRightSidebar', eventData, jobOffer)
    },
    /**
     * @description passes forward the page number change
     */
    onPageNumberChange(currentPage: number, countOfResultsPerPage: number): void {
      this.$emit('pageNumberChanges', currentPage, countOfResultsPerPage);
    },
    /**
     * @description emit the offer selection undo && show notification for user
     */
    onUndoOfferSelection(offerId: number): void {
      this.$emit('undoOfferSelection', {offerId: offerId})
      this.$rootEvent.showNotification(ToastTypeEnum.info, this.$t(`searchResults.singleCard.options.selectForApplication.removed`));
    }
  }
}

</script>
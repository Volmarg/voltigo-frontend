<template>
  <Modal
      :title="$t('components.jobOfferEmailWizard.steps.header')"
      :is-visible="isVisible"
      :has-body-padding="true"
      modal-main-wrapper-classes="z-20"
      backdrop-classes="z-10"
      class="application-wizard-modal"
      size="full"
      @modal-closed="$emit('modalClosed', $event)"
      @modal-opened="$emit('modalOpened', $event)"
      :footer-classes="{
        'flex justify-around' : true,
      }"
  >
    <template #content>
      <Wizard
          :job-offer="jobOffer"
          :selected-job-offers="selectedOffers"
          :is-right-sidebar-visible="isRightSidebarVisible"
          :open-offer="openOffer"
          @get-random-selected-job-offer="$emit('getRandomSelectedOffer', $event)"
          @applications-sent="$emit('applicationSent', $event)"
          @card-selection-changed="onCardSelectionChanged"
          @show-right-sidebar="onShowRightSidebar"
          @points-fee-fetch-failure="$emit('pointsFeeFetchFailure')"
          @close-modal="$emit('modalClosed', $event)"
      />
    </template>
  </Modal>

</template>

<script lang="ts">

import Modal  from "@/components/Modal/Modal.vue";
import Wizard from "@/views/JobOffer/Email/Wizard.vue";

import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";

import {ComponentData}             from "@/scripts/Vue/Types/Components/types";
import {RightSidebarComponentData} from "@/scripts/Vue/Types/Components/Sidebar";

import {applicationWizardOffersStore, ApplicationWizardOffersStore} from "@/scripts/Vue/Store/ApplicationWizardOffersStore";

export default {
  data(): ComponentData {
    return {
      applicationWizardOffersStore: null as null | ApplicationWizardOffersStore,
      selectedOffers: null as unknown as Array<JobOfferAnalyzed>,
    }
  },
  props: {
    isVisible: {
      type     : Boolean,
      required : true,
    },
    jobOffer: {
      type     : Object as unknown as JobOfferAnalyzed,
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
    'modalClosed',
    'modalOpened',
    'getRandomSelectedOffer',
    'applicationSent',
    'cardSelectionChanged',
    'showRightSidebar',
    'pointsFeeFetchFailure'
  ],
  components: {
    Modal,
    Wizard
  },
  methods: {
    /**
     * @description passes the event data further
     */
    onShowRightSidebar(eventData: RightSidebarComponentData, jobOffer: JobOfferAnalyzed): void {
      this.$emit('showRightSidebar', eventData, jobOffer);
    },
    /**
     * @description handles the card selection change, emits the event further
     */
    onCardSelectionChanged(eventData: Record<string, number | boolean>): void {
      this.$emit('cardSelectionChanged', eventData.offerId, eventData.isSelected);
    }
  },
  mounted(): void {
    this.applicationWizardOffersStore = applicationWizardOffersStore();
  },
  watch: {
    isVisible(): void {
      if (this.isVisible) {
        this.selectedOffers = this.applicationWizardOffersStore.getOffers();
      }
    }
  }
}

</script>
<template>
  <div>
    <h1 class="text-blue-500 font-extrabold text-center job-detail-title mb-4 header">
      {{ $t('components.jobOfferEmailWizard.steps.confirmation.header') }}
    </h1>

    <hr/>

    <SelectedAttachments :attachments="attachments" />

    <Headers :email-template="template"/>

    <p
        class="italic mb-3 text-center text-gray-500"
        v-html="$t('components.jobOfferEmailWizard.steps.confirmation.labels.offers.info')"
   />

    <OffersList :selected-job-offers="selectedJobOffers"
                :is-right-sidebar-visible="isRightSidebarVisible"
                :open-offer="openOffer"
                @offer-selection-changed="onOfferSelectionChange"
                @show-right-sidebar="onShowRightSidebar"
    />

    <PointsFee
      :about-text="$t('components.jobOfferEmailWizard.steps.confirmation.fee.information')"
      :count="applicationWizardOffersStore?.getSelectedOffersCount()"
      :product-fetch-url="emailSendingProductFetchUrl"
      @missing-points-check="isMissingPoints = $event.isMissingPoints"
      @failure="$emit('pointsFeeFetchFailure')"
    />

    <div v-if="applicationWizardOffersStore?.getSelectedOffersCount()">

      <div class="mt-2 flex justify-center flex-col sm:flex-row">
        <Checkbox
            v-model="isConfirmedByUser"
            class="transform scale-75"
        />
        <span class="ml-2 align-self-center">{{ $t('components.jobOfferEmailWizard.steps.confirmation.labels.confirmation.label') }}</span>
        <AsteriskRequired />

      </div>

      <SendApplicationsButton
          :selected-job-offers="selectedJobOffers"
          :job-search-id="$route.params.id"
          :template="template"
          :selected-cv="selectedCv"
          :disabled="isMissingPoints"
          :is-confirmed-by-user="isConfirmedByUser"
          @applications-sent="$emit('applicationsSent')"
          class="mb-4"
      />

   </div>

    <modal-template-has-changed :is-visible="modalTemplateHasChanged.isVisible"
                                @modal-closed="onClosingTemplateChangedModal"
    />

  </div>
</template>

<script lang="ts">
import SelectedAttachments                   from "@/views/JobOffer/Email/Wizard/Confirmation/SelectedAttachments.vue";
import OffersSelectionHandlerMixin           from "@/views/JobOffer/SearchResult/Details/Mixin/OffersSelectionHandlerMixin.vue";
import StepInterfaceMixin                    from "@/views/JobOffer/Email/Wizard/StepInterfaceMixin.vue";
import SendApplicationsButton                from "@/views/JobOffer/Email/Wizard/Confirmation/SendApplicationsButton.vue";
import Headers                               from "@/views/JobOffer/Email/Wizard/Confirmation/Headers.vue";
import Checkbox                              from "@/components/Form/Checkbox.vue";

import AsteriskRequired        from "@/components/Form/AsteriskRequired.vue";
import PointsFee               from "@/components/LoggedIn/Payment/PointsFee.vue";
import ModalTemplateHasChanged from "@/views/JobOffer/Email/Wizard/Confirmation/ModalTemplateHasChanged.vue";
import OffersList              from "@/views/JobOffer/Email/Wizard/Confirmation/OffersList/OffersList.vue";
import ColorsMixin             from "@/scripts/Vue/Mixins/Colors.vue";

import {RightSidebarComponentData} from "@/scripts/Vue/Types/Components/Sidebar";
import {ComponentData}             from "@/scripts/Vue/Types/Components/types";
import EmailTemplate               from "@/scripts/Entity/Email/EmailTemplate";

import {JobOfferAnalyzed,}    from "@/scripts/Entity/Job/JobOfferAnalyzed";
import UploadedFileDTO        from "@/scripts/Dto/File/UploadedFileDTO";
import SymfonyPointShopRoutes from "@/router/SymfonyRoutes/SymfonyPointShopRoutes";
import SymfonyRoutes          from "@/router/SymfonyRoutes";

import {ToastTypeEnum} from "@/scripts/Libs/ToastNotification";

import {applicationWizardOffersStore, ApplicationWizardOffersStore} from "@/scripts/Vue/Store/ApplicationWizardOffersStore";

/**
 * @description in this step user has to confirm sending the E-Mails
 */
export default {
  name: "JobOfferEmailWizardStepConfirmation",
  data(): ComponentData {
    return {
      applicationWizardOffersStore: null as null | ApplicationWizardOffersStore,
      isConfirmedByUser: false,
      isMissingPoints: false,
      /**
       * @description the "wasVisible" means that the notification was already displayed at least once
       */
      modalTemplateHasChanged: {
        isVisible: false,
        wasVisible: false
      },
      promiseTest: null as null | Promise<void>,
      attachments: {
        cv: null as null | UploadedFileDTO
      }
    };
  },
  props: {
    selectedJobOffers: {
      type     : Array as () => Array<JobOfferAnalyzed>,
      required : true,
    },
    template: {
      type     : Object as unknown as EmailTemplate, // todo: change the email template props etC?
      required : true,
    },
    selectedCv: {
      type     : UploadedFileDTO || null,
      required : false,
      default  : null,
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
  mixins: [
    OffersSelectionHandlerMixin,
    StepInterfaceMixin,
    ColorsMixin,
  ],
  emits: [
    "applicationsSent",
    "templateHasChanged",
    'cardSelectionChanged',
    'pointsFeeFetchFailure',
    'offerSelectionChanged',
    'showRightSidebar',
  ],
  components: {
    AsteriskRequired,
    ModalTemplateHasChanged,
    SelectedAttachments,
    OffersList,
    SendApplicationsButton,
    Headers,
    Checkbox,
    PointsFee
  },
  computed: {
    /**
     * @description returns url for fetching email sending point shop product
     */
    emailSendingProductFetchUrl(): string {
      return SymfonyRoutes.buildUrl(SymfonyPointShopRoutes.GET_EMAIL_SENDING_PRODUCT);
    },
  },
  methods: {
    /**
     * @description handle user closing the "email template has changed" modal
     *              - force close the modal,
     *              - mark as already closed, so it will not be shown again, downside is, that it won't be shown ever again
     *                so if user changes something one more time, the modal will not be displayed
     */
    onClosingTemplateChangedModal(): void {
      this.modalTemplateHasChanged.isVisible = false
      this.modalTemplateHasChanged.wasVisible = true
    },
    /**
     * @description passes the event data further
     */
    onShowRightSidebar(eventData: RightSidebarComponentData, jobOffer: JobOfferAnalyzed): void {
      this.$emit('showRightSidebar', eventData, jobOffer);
    },
    /**
     * @description check if the step state is valid
     */
    isValid(): boolean {
      return true;
    },
    /**
     * @description trigger when user marks / un-marks the offer checkbox / will (de)select offer
     */
    onOfferSelectionChange(eventData: Record<string, number | boolean>): void {
      this.applicationWizardOffersStore?.updateOffersSelection(eventData.offerId, eventData.isSelected);

      let actionType = (eventData.isSelected ? 'added' : 'removed');
      this.$rootEvent.showNotification(ToastTypeEnum.info, this.$t(`searchResults.singleCard.options.selectForApplication.${actionType}`));

      this.$emit('offerSelectionChanged', eventData);
    }
  },
  created(): void {
    this.applicationWizardOffersStore = applicationWizardOffersStore();
  },
  watch: {
    selectedCv: {
      deep: true,
      handler(newValue) {
        this.attachments.cv = newValue;
      }
    }
  }
}
</script>
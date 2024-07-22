<template>
  <div>

    <div class="flex justify-center">
      <medium-button-with-icon
          :text="$t('components.jobOfferEmailWizard.steps.confirmation.labels.buttons.send.label')"
          :disabled="disabled || !isConfirmedByUser"
          class="mt-5"
          @click="onSendEmailsClick()"
      >
        <template #icon>
          <fa icon="paper-plane"/>
        </template>
      </medium-button-with-icon>

    </div>
    <small class="italic p-2">{{ $t('components.jobOfferEmailWizard.steps.confirmation.labels.buttons.info.text') }}</small>

  </div>
</template>

<script lang="ts">
import MediumButtonWithIcon from "@/components/Navigation/Button/MediumButtonWithIcon.vue";
import Fontawesome          from "@/components/Libs/Fontawesome.vue";

import GenerateEmailMixin from "@/views/JobOffer/Email/Wizard/Common/Mixin/GenerateEmailMixin.vue";

import EmailTemplate      from "@/scripts/Entity/Email/EmailTemplate";
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";
import {AxiosPostDataBag} from "@/scripts/Core/Types/Request/AxiosTypes";

import PromiseService                       from "@/scripts/Core/Services/Promise/PromiseService";
import SymfonyRoutes                        from "@/router/SymfonyRoutes";
import SymfonyEmailRoutes                   from "@/router/SymfonyRoutes/SymfonyEmailRoutes";
import {ToastTypeEnum}                      from "@/scripts/Libs/ToastNotification";
import Md5Service                           from "@/scripts/Core/Services/Crypto/Md5Service";
import ReFetchTemplate                      from "@/scripts/Response/Email/Template/ReFetchTemplate";
import SymfonyJobOfferRoutes                from "@/router/SymfonyRoutes/SymfonyJobOfferRoutes";
import UploadedFileDTO                      from "@/scripts/Dto/File/UploadedFileDTO";
import IframePostMessageControlService      from "@/scripts/Core/Services/Security/IframePostMessageControlService";
import GetEditorVariables                   from "@/scripts/Response/Email/Template/GetEditorVariables";
import JwtTokenHandler                      from "@/scripts/Core/Security/JwtTokenHandler";

export default {
  components: {
    "fa"                      : Fontawesome,
    "medium-button-with-icon" : MediumButtonWithIcon,
  },
  props: {
    isConfirmedByUser: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    selectedJobOffers: {
      type     : Array as () => Array<JobOfferAnalyzed>,
      required : true,
    },
    template: {
      type     : Object as () => EmailTemplate,
      required : true,
    },
    selectedCv: {
      type     : UploadedFileDTO || null,
      required : false,
      default  : null,
    },
    jobSearchId: {
      type     : Number,
      required : true,
    },
  },
  mixins: [
    GenerateEmailMixin,
  ],
  emits: [
    'applicationsSent'
  ],
  methods: {
    /**
     * @description will re-fetch the current template, response contains either the template or null,
     *              - template: means that something has changed in template, like for example was edited on other page,
     *              - null    : means that nothing has changed for the template
     *
     * @return boolean
     *            - true means that template was re-fetched
     *            - false means that no template was re-fetched, null was returned from backend
     */
    async fetchTemplateData(): Promise<boolean> {

      let calledUrl = SymfonyRoutes.buildUrl(
          SymfonyEmailRoutes.RE_FETCH_BY_ID,
          {
            [SymfonyEmailRoutes.RE_FETCH_BY_ID_PARAMETER_ID]        : this.template.id,
            [SymfonyEmailRoutes.RE_FETCH_BY_ID_PARAMETER_BODY_MD5]  : Md5Service.hash(this.template.body),
            [SymfonyEmailRoutes.RE_FETCH_BY_ID_PARAMETER_TITLE_MD5] : Md5Service.hash(this.template.subject),
          }
      );

      // user was already informed once about the change, so not fetching the template, nor displaying the modal again
      if (this.$parent.modalTemplateHasChanged.wasVisible) {
        return new Promise((resolve) => {
          resolve(false);
        });
      }

      return await this.$axios.getWithCsrf(calledUrl, ReFetchTemplate).then( (response: ReFetchTemplate) => {
        if (response.isTemplateSet()) {
          this.$parent.modalTemplateHasChanged.isVisible = true;
          this.$emit('templateHasChanged', response.emailTemplate)
          return true;
        }

        return false;
      });
    },
    /**
     * @description handler for when "Send emails" button is clicked
     */
    async onSendEmailsClick(): Promise<void> {
      if (this.disabled || !this.isConfirmedByUser) {
        return;
      }

      if (await this.fetchTemplateData()) {
        return;
      }

      this.buildAndSendEmails();
    },
    /**
     * @description returns the variables that will be set inside the generated E-Mail which then is used as "Offer application E-Mail"
     */
    async getTemplateVariables(externalOfferId: number): Promise<Record<string | number, string | number | boolean>> {
      let filterPanelValues = this.$root.getLoggedInUserViewRef().$refs.filtersAccordion.$refs.filterPanel.getChildrenFiltersValues();
      let calledUrl         = SymfonyRoutes.buildUrl(
          SymfonyEmailRoutes.URL_GET_TEMPLATE_VARIABLES,
          {
            [SymfonyEmailRoutes.URL_GET_TEMPLATE_VARIABLES_EXTERNAL_OFFER_ID] : externalOfferId
          }
      );

      let data = {
        filterValues: filterPanelValues,
      }

      return await this.$axios.postWithCsrf(calledUrl, data, false, {}, GetEditorVariables).then( (response: GetEditorVariables) => {
        return response.variablesData;
      })

    },
    /**
     * @description this function will build E-Mails for all of the job offers, and afterwards will send the generated
     *              E-Mails to the backend
     *
     * Info: using dirty trick of passing the object with count of generated emails to the {@see PromiseService.buildPeriodicallyCheckedPromise}
     *       because the object is passed as reference, so while the counter goes on in other place, the promise
     *       will still be aware of new values of the properties, so each periodical check is actually running against
     *       updated object.
     */
    async buildAndSendEmails(): Promise<void> {
      this.$rootEvent.showFullPageLoader();

      /**
       * @description since adding the fetching of template variables from backend there were some issues with
       *              generating email on EmailBuilder, meaning that even if the html content was generated
       *              in builder and the posting code was reached, the post message never reached in here.
       *
       *              Therefor there was an idea to make all the calls for variables first, and then generate the
       *              html content and this worked out.
       */
      let variablesForOffers = {};
      for (let selectedOffer of this.selectedJobOffers) {
        variablesForOffers[selectedOffer.identifier] = await this.getTemplateVariables(selectedOffer.identifier);
      }

      for (let selectedOffer of this.selectedJobOffers) {
        let templateVariables = variablesForOffers[selectedOffer.identifier]
        this.sendRenderEmailRequest(this.template.body, templateVariables, selectedOffer.identifier);
      }

      let applicationsData = [] as Array<Record<string, unknown>>;
      let counter         = {generatedEmails: 0};

      var emailGeneratedHandler = (response) => {
        IframePostMessageControlService.checkAndHandleMessageCheck(response);

        if (response.data.event === this.event.renderEmails.get) {

          let html       = response.data.html;
          let trackingId = response.data.trackerId;
          let offer      = this.selectedJobOffers.find((jobOfferAnalyzed: JobOfferAnalyzed) => {
            return (jobOfferAnalyzed.identifier == trackingId);
          })

          applicationsData.push({
            recipient        : offer.contactDetail.email,
            emailBody        : html,
            offerId          : offer.identifier,
            offerTitle       : offer.jobTitle,
            offerUrl         : offer.jobOfferUrl,
            offerCompanyName : offer.companyDetail.companyName,
          });

          counter.generatedEmails++;
        }
      }
      window.addEventListener("message", emailGeneratedHandler);

      let scheduledPromise = PromiseService.buildPeriodicallyCheckedPromise(()  => (counter.generatedEmails >= this.selectedJobOffers.length));
      scheduledPromise.then(() => {
        this.sendEmails(applicationsData);
        this.$rootEvent.hideFullPageLoader();
        window.removeEventListener("message", emailGeneratedHandler);
      })
    },
    /**
     * @description handles sending application data (emails etc.) to backend
     */
    sendEmails(applicationsData: Array<Record<string, unknown>>): void {
      let attachedFileIds = [] as Array<number>;
      if (null !== this.selectedCv) {
        attachedFileIds.push(this.selectedCv.id);
      }

      let loggedInUserViewRoot = this.$root.getLoggedInUserViewRef();
      let filterPanelValues    = loggedInUserViewRoot.$refs.filtersAccordion.$refs.filterPanel.getChildrenFiltersValues()

      let dataBag = {
        applicationsData : applicationsData,
        templateId       : this.template.id,
        jobSearchId      : this.jobSearchId,
        attachedFileIds  : attachedFileIds,
        filters          : filterPanelValues,
      } as unknown as AxiosPostDataBag;

      let calledUrl = SymfonyRoutes.buildUrl(SymfonyJobOfferRoutes.URL_APPLY_ON_OFFERS);

      this.$nextTick(() => {
        this.$rootEvent.showFullPageLoader();
      })

      this.$axios.postWithCsrf(calledUrl, {}, false, dataBag).then( async (baseResponse) => {
        if (!baseResponse.success) {
          if (!baseResponse.isMessageSet()) {
            this.$rootEvent.showNotification(ToastTypeEnum.error, this.$t('messages.internalServerError'));
          }

          this.$rootEvent.showNotification(ToastTypeEnum.warning, baseResponse.message);
          this.$rootEvent.hideFullPageLoader();
          return;
        }

        if (baseResponse.isMessageSet()) {
          this.$rootEvent.showNotification(baseResponse.getNotificationType(), baseResponse.message);
        }

        await JwtTokenHandler.requestJwtTokenAndWaitForIt();
        this.$rootEvent.hideFullPageLoader();

        this.$emit("applicationsSent");
      })
    },
  }
}
</script>
<script lang="ts">
import SymfonyEmailRoutes from "@/router/SymfonyRoutes/SymfonyEmailRoutes";
import {ToastTypeEnum}    from "@/scripts/Libs/ToastNotification";
import SymfonyRoutes      from "@/router/SymfonyRoutes";
import SaveTemplate       from "@/scripts/Response/Email/Template/SaveTemplate";
import Incoming           from "@/scripts/Core/Services/EasyEmail/Event/Incoming";

import BackendErrorStorageService           from "@/scripts/Core/Services/Storage/BackendErrorStorageService";
import IframePostMessageControlService from "@/scripts/Core/Services/Security/IframePostMessageControlService";

import DummyVariablesProviderMixin from "@/views/JobOffer/Email/Mixin/DummyVariablesProviderMixin.vue";
import NotificationContentMixin    from "@/components/Notification/mixins/NotificationContentMixin.vue";
import BaseApiResponseMixin        from "@/scripts/Vue/Mixins/Response/BaseApiResponseMixin.vue";
import GenerateEmailMixin          from "@/views/JobOffer/Email/Wizard/Common/Mixin/GenerateEmailMixin.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

// Ignore the "RED" error, it works so who cares...
import toWords from 'split-camelcase-to-words';

export default {
  data(): ComponentData {
    return {
      // data props has to be used as the let variables are causing some weird issues as if they would not be set
      isTemplateRendered                : false,
      renderedTemplateContent           : null,
      timeWaitingForMessageEventBinding : 300, // should not go below that value, till fixed properly
      maxExampleHtmlRenderAttempts      : 5,
    }
  },
  mixins: [
    GenerateEmailMixin,
    BaseApiResponseMixin,
    NotificationContentMixin,
    DummyVariablesProviderMixin
  ],
  methods: {
    /**
     * @description returns the promise which resolves to rendered example html
     */
    async getRenderedExampleHtml(templateData: string): Promise<string | null> {

      let emailRenderedHandler = (response) => {
        IframePostMessageControlService.checkAndHandleMessageCheck(response);

        switch (response.data.event) {
          case Incoming.TEMPLATE_RENDERED:
            this.isTemplateRendered      = true;
            this.renderedTemplateContent = response.data.html;
        }
      };

      window.addEventListener("message", emailRenderedHandler)

      return new Promise(async (resolve, reject) => {

        let templateVariables = await this.provideDummyVariables();
        this.sendRenderEmailRequest(templateData, templateVariables);

        let rejectionTimeout = setTimeout(() => {
          window.removeEventListener("message", emailRenderedHandler)
          reject("Example template rendered to long, message listener probably not yet properly bound");
        }, this.timeWaitingForMessageEventBinding);

        if (this.isTemplateRendered) {
          clearTimeout(rejectionTimeout);
          resolve(this.renderedTemplateContent);

          // reset;
          this.isTemplateRendered      = false;
          this.renderedTemplateContent = null;
          window.removeEventListener("message", emailRenderedHandler)
        }

      });

    },
    /**
     * @description prepare data that will be sent to backend when saving the template
     */
    async preparedSaveTemplateData(eventData: Record<string, string | unknown>): Promise<Record<string, unknown>> {

      let isHtmlRendered         = false;
      let htmlRenderAttemptCount = 0;
      let renderedExampleHtml    = "<html lang='en'><head><title></title></head><body></body></html>";

      /**
       * @description this cannot be encrypted as the content is too big for encryption limitation,
       *              also there is actually no need to encrypt this data
       */
      let templateData = eventData.template as Record<string | number, unknown>

      /**
       * @description there is some severe unknown issue where triggering the save first time won't catch the "message"
       *              event {@see Incoming.TEMPLATE_RENDERED}, even tho it gets registered properly.
       *
       *              The DIRTY solution that was accidentally found is to make the call few times and try to get the
       *              result this way
       *
       *              It's unknown why it causes issues. This was tested and didn't work:
       *              - delaying event fetching because maybe event was not registered on time,
       *              - moving event registration before calling the EasyEmail to render template,
       *              - checking if other "message" listeners are not stealing the event and are not bubbling it
       *                and that's not the case because multiple PROPERLY REGISTERED "message" listeners
       *                react to the event
       */
      while ((htmlRenderAttemptCount <= this.maxExampleHtmlRenderAttempts) && !isHtmlRendered) {

        try {
          renderedExampleHtml = await this.getRenderedExampleHtml(JSON.stringify(templateData));
        } catch (Exception) {
          htmlRenderAttemptCount++;

          if (htmlRenderAttemptCount >= this.maxExampleHtmlRenderAttempts) {
            this.$rootEvent.showNotification(ToastTypeEnum.warning, this.$t('list.card.action.renderExampleHtml.message.couldNotRender'));
            BackendErrorStorageService.storeData({
              "message"     : "Could not render the E-Mail template miniature - created when saving the template",
              "maxAttempts" : this.maxExampleHtmlRenderAttempts,
              "templateId"  : this.editedTemplateId,
            })
          }

          continue;
        }

        isHtmlRendered = true;
      }

      let dataBag = {
        id                : this.editedTemplateId,
        body              : JSON.stringify(templateData),
        subject           : templateData.title,
        emailTemplateName : templateData.templateName,
        exampleHtml       : renderedExampleHtml,
      };

      return new Promise((resolve) => {
        resolve(dataBag);
      });
    },
    /**
     * @description handles saving template to backend
     */
    async saveTemplate(eventData: Record<string, string | unknown>): Promise<boolean> {
      let calledUrl = SymfonyRoutes.buildUrl(SymfonyEmailRoutes.URL_SAVE);
      if (this.isPredefinedTemplate) {
        calledUrl = SymfonyRoutes.buildUrl(SymfonyEmailRoutes.URL_SAVE_PREDEFINED);
      }

      let dataBag = await this.preparedSaveTemplateData(eventData);

      this.$rootEvent.showFullPageLoader();
      return this.$axios.postWithCsrf(calledUrl, {}, false, dataBag, SaveTemplate).then( (response: SaveTemplate) => {
        this.$rootEvent.hideFullPageLoader();

        if (!response.success){

          if(response.hasInvalidFields()){
            let violationMessages   = this._buildInvalidFieldsMessages(response);
            let notificationMessage = this.messagesArrayToString(violationMessages);
            this.$rootEvent.showNotification(ToastTypeEnum.warning, notificationMessage);
            return;
          }

          if(!response.isMessageSet()){
            this.$rootEvent.showNotification(ToastTypeEnum.error, this.$t('messages.internalServerError'))
            return;
          }

          this.$rootEvent.showNotification(ToastTypeEnum.error, response.message);

          return false;
        }

        this.$rootEvent.showNotification(ToastTypeEnum.success, response.message);
        return true;
      })

    },
    /**
     * @description will build array of violation messages (these will get displayed in notification)
     */
    _buildInvalidFieldsMessages(response: SaveTemplate): Array<string> {
      let violations        = this.normalizeViolations(response);
      let violationMessages = [] as Array<string>;
      for (let key of Object.keys(violations)) {
        for (let message of violations[key]) {
          violationMessages.push(`${toWords(key)}: ${message}`);
        }
      }

      return violationMessages;
    },
  }
}
</script>
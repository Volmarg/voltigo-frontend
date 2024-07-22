<template>

  <WarningMobileBrowser v-if="isMobileBrowser" />
  <top-nav-bar
      @new-template="onNewTemplate"
      @new-predefined-template="onNewPredefinedTemplate"
      @show-guide="isGuideModalVisible = true"
      :has-reached-max-templates="hasReachedMaxTemplates"
  />

  <AboutAccordion>
    <p v-html="$t('builder.about.description1.text')"/>
  </AboutAccordion>

  <HintsAccordion />

  <PredefinedTemplates
      @template-cloned="onTemplateCloned"
      @edit-template="onEditTemplate"
      @delete-template="onDeleteTemplate"
      :templates="predefinedTemplates"
  />

  <Container class="mb-4 flex justify-center md:flex-row flex-col">
    <span class="font-bold">{{ $t('stats.templatesAmount') }}: &nbsp;</span>
    <span>{{ currentTemplatesCount }} / {{ maxAllowedTemplates }}<small class="italic">&nbsp;({{ $t('stats.max') }})</small></span>
  </Container>

  <container>
    <h2 class="text-blue-500 font-extrabold text-center job-detail-title mb-4 text-xl">{{ $t('list.userTemplate.header') }}</h2>
    <templates-list @edit-template="onEditTemplate"
                    @delete-template="onDeleteTemplate"
                    @generate-pdf="onGeneratePdf"
                    @send-test="onSendTest"
                    :templates="templates"
                    :can-send-test="true"
                    :can-clone="false"
    />

    <!--
      - It's very important to only initially change the `visible` prop, due to performance issue of EasyEmail,
      - afterwards once it's opened, should only be shown/hid
      - the animation for closing is not working due to `v-show`, but `v-show` is a must here due to performance issue
    -->
    <easy-email-modal @save-template="onSaveTemplate"
                      @modal-closed="onEmailBuilderClosed"
                      :is-visible="isEasyEmailModalVisible"
                      :edited-template-id="editedTemplateId"
                      :templates="templates"
                      :predefined-templates="predefinedTemplates"
                      v-show="isEasyEmailModalVisible"
    />

    <StopEditingConfirmationModal
        :force-is-visible="isStopEditingConfirmationVisible"
        @confirm="onStopEditingConfirmed"
        @modal-closed="onStopEditingConfirmationClosed"
    />

    <NoResultsText v-if="templates.length === 0" >
      <p
          v-html="$t('builder.noResults.info')"
          class="mt-4 text-center"
      />
    </NoResultsText>
  </container>

  <RemoveTemplateConfirmationModal
      :force-is-visible="isRemovalConfirmationVisible"
      @confirm="deleteTemplate(removedTemplateId); isRemovalConfirmationVisible = false"
      @modal-closed="isRemovalConfirmationVisible = false"
  />

  <GeneratePdfModal
      v-if="htmlContentForPdf"
      :force-is-visible="isGeneratePdfModalVisible"
      :html-content="htmlContentForPdf"
      @modal-closed="isGeneratePdfModalVisible = false"
  />

  <SendTestEmailModal
      :force-is-visible="isSendTestEmailVisible"
      :template-id="sendTestTemplateId"
      :templates="templates"
      @modal-closed="isSendTestEmailVisible = false"
  />

  <GuideModal
      :force-is-visible="isGuideModalVisible"
      @modal-closed="isGuideModalVisible = false"
  />

</template>

<script lang="ts">
import RemoveTemplateConfirmationModal from "@/views/Email/Template/Builder/Modal/RemoveTemplateConfirmationModal.vue";
import StopEditingConfirmationModal    from "@/views/Email/Template/Builder/Modal/StopEditingConfirmationModal.vue";
import WarningMobileBrowser            from "@/views/Email/Template/Builder/WarningMobileBrowser.vue";
import PredefinedTemplates             from "@/views/Email/Template/Builder/PredefinedTemplates.vue";
import SendTestEmailModal              from "@/views/Email/Template/Builder/Modal/SendTestEmailModal.vue";
import GeneratePdfModal                from "@/views/Email/Template/Builder/Modal/GeneratePdfModal.vue";
import HintsAccordion                  from "@/views/Email/Template/Builder/HintsAccordion.vue";
import AboutAccordion                  from "@/components/Page/AboutAccordion.vue";
import EasyEmailModal                  from "@/views/Email/Template/Builder/Modal/EasyEmail.vue";
import TemplatesList                   from "@/views/Email/Template/Builder/TemplatesList.vue";
import NoResultsText                   from "@/components/Page/NoResultsText.vue";
import GuideModal                      from "@/views/Email/Template/Builder/Modal/GuideModal.vue";
import Container                       from "@/components/Ui/Containers/Container.vue";
import TopNavBar                       from "@/views/Email/Template/Builder/TopNavBar.vue";

import {ComponentData}                from "@/scripts/Vue/Types/Components/types";
import SymfonyRoutes                  from "@/router/SymfonyRoutes";
import Outgoing                       from "@/scripts/Core/Services/EasyEmail/Event/Outgoing";
import BaseError                      from "@/scripts/Core/Error/BaseError";
import EmailTemplate                  from "@/scripts/Entity/Email/EmailTemplate";
import BrowserDetection               from "@/scripts/Core/Services/View/BrowserDetection";
import SymfonySystemRoutes            from "@/router/SymfonyRoutes/SymfonySystemRoutes";
import EasyEmailSecretHandler         from "@/scripts/Core/Services/EasyEmail/EasyEmailSecretHandler";
import CheckEmailTemplateRestrictions from "@/scripts/Response/System/Restriction/CheckEmailTemplateRestrictions";


import SaveMixin          from "@/views/Email/Template/Builder/Mixin/SaveMixin.vue";
import LoadMixin          from "@/views/Email/Template/Builder/Mixin/LoadMixin.vue";
import DeleteMixin        from "@/views/Email/Template/Builder/Mixin/DeleteMixin.vue";
import LoadCloneableMixin from "@/views/Email/Template/Builder/Mixin/LoadCloneableMixin.vue";

import FailedBackendResponseHandler from "@/scripts/Vue/Mixins/FailedBackendResponseHandler.vue";

export default {
  name: "EmailTemplateBuilder",
  data(): ComponentData {
    return {
      isMobileBrowser: BrowserDetection.isMobileBrowser(),
      htmlContentForPdf: null,
      isGeneratePdfModalVisible: false,
      hasReachedMaxTemplates: false,
      maxAllowedTemplates: 0,
      currentTemplatesCount: 0,
      isPredefinedTemplate: false,
      removedTemplateId: null,
      isGuideModalVisible: false,
      isRemovalConfirmationVisible: false,
      isStopEditingConfirmationVisible: false,
      templates: [],
      predefinedTemplates: [],
      isEasyEmailModalVisible: false,
      showEasyModal: false,
      isPreviewModalVisible: false,
      isSendTestEmailVisible: false,
      sendTestTemplateId: null as null | number,
      editedTemplateId: null,
    }
  },
  components: {
    RemoveTemplateConfirmationModal,
    StopEditingConfirmationModal,
    WarningMobileBrowser,
    PredefinedTemplates,
    SendTestEmailModal,
    GeneratePdfModal,
    EasyEmailModal,
    AboutAccordion,
    HintsAccordion,
    TemplatesList,
    NoResultsText,
    GuideModal,
    Container,
    TopNavBar,
  },
  mixins: [
    SaveMixin,
    LoadMixin,
    DeleteMixin,
    LoadCloneableMixin,
    FailedBackendResponseHandler
  ],
  methods: {
    onSendTest(templateId: number) {
      this.isSendTestEmailVisible = true;
      this.sendTestTemplateId = templateId;
    },
    /**
     * @description fetch information about email template restrictions for the user
     */
    async checkEmailTemplateRestriction(): Promise<void> {
      let url = SymfonyRoutes.buildUrl(SymfonySystemRoutes.URL_CHECK_EMAIL_TEMPLATE_RESTRICTIONS);

      this.$axios.getWithCsrf(url, CheckEmailTemplateRestrictions).then( (response: CheckEmailTemplateRestrictions) => {
        if (!response.success) {
          this.handleFailedBackendResponse(response, url);
          return;
        }

        this.hasReachedMaxTemplates = response.maxReached;
        this.maxAllowedTemplates    = response.maxAllowed
        this.currentTemplatesCount  = response.count;
      })
    },
    /**
     * @description handles situation when template has been cloned:
     *             - reloads templates list
     */
    async onTemplateCloned(): Promise<void> {
      let fetchedTemplates = await this.getAllTemplates();
      await this.checkEmailTemplateRestriction();

      this.templates = [];
      this.$nextTick( () => {
        this.templates = fetchedTemplates;
      })
    },
    /**
     * @description handles user clicking on the "remove" button, on this step it will:
     * - set the removed template id,
     * - show confirmation modal,
     */
    onDeleteTemplate(templateId: number): void {
      this.isRemovalConfirmationVisible = true
      this.removedTemplateId = templateId;
    },
    /**
     * @description handler for creating new template
     */
    onNewTemplate(): void {
      this.isEasyEmailModalVisible = true
      this.editedTemplateId        = null;
    },
    /**
     * @description handler for clicking "generate pdf", shows the modal with pdf generation options
     */
    onGeneratePdf(templateId: number): void {
      let template    = this.templates.find((template: EmailTemplate) => template.id === templateId);
      let htmlContent = template?.exampleHtml;
      if (!htmlContent) {
        throw new BaseError(`Could not find template with id: ${templateId} in templates list`);
      }

      this.htmlContentForPdf         = htmlContent;
      this.isGeneratePdfModalVisible = true
    },
    /**
     * @description handler for creating new predefined template
     */
    onNewPredefinedTemplate(): void {
      this.onNewTemplate();
      this.isPredefinedTemplate = true;
    },
    /**
     * @description handler for editing the template,
     */
    onEditTemplate(templateId: number): void {
      this.isEasyEmailModalVisible = true;
      this.editedTemplateId        = templateId;
    },
    /**
     * @description handler for when the "stop editing" modal gets closed
     */
    onStopEditingConfirmationClosed(): void {
      this.isStopEditingConfirmationVisible = false
    },
    /**
     * @description handler for when "stop editing" modal gets confirmed,
     *              then it will close the email builder and do any additional logic for the
     *              "close" process
     */
    onStopEditingConfirmed(): void {
      this.isStopEditingConfirmationVisible = false
      this.isEasyEmailModalVisible          = false;
      this.isPredefinedTemplate             = false;

      /**
       * @description must be set to null to force rebuilding the template session id (used to identify the template on Editor side),
       *              also this ensures that the template content is sent anew each time that modal is opened
       *              so this might help reducing potential issues that wrong template content is stored on "Editor side"
       */
      this.editedTemplateId = null;
    },
    /**
     * @description handler for when email editor modal is closed
     */
    onEmailBuilderClosed(): void {
      this.isStopEditingConfirmationVisible = true;
    },
    /**
     * @description handler for "template saving"
     */
    async onSaveTemplate(eventData: Record<string, unknown>): Promise<void> {
      let isSuccess = await this.saveTemplate(eventData);
      if (!isSuccess) {
        return;
      }

      this.isPredefinedTemplate    = false;
      this.isEasyEmailModalVisible = false;
      this.editedTemplateId        = null;

      let fetchedTemplates     = await this.getAllTemplates();
      this.predefinedTemplates = await this.getCloneAbleTemplates();
      await this.checkEmailTemplateRestriction();

      this.templates = [];
      this.$nextTick( () => {
        this.templates = fetchedTemplates;
      })
    },
    /**
     * @description register before unload method, so that user will have to confirm the dialog even on unload
     */
    registerBeforeUnload(): void {

      /**
       * @description in general in "modern browsers" it's no longer possible to control the message on before unload
       *              so an empty string could be returned here at well, but in order to keep the support
       *              for old browsers, adding the same string that is added the same string that is showed in new ones.
       *
       *              Text will be always English for old browsers - not supporting translation for this - not worth it.
       */
      window.onbeforeunload = () => {
        if (this.isEasyEmailModalVisible) {
          return "Changes you made may not be saved.";
        }
      }
    },
    /**
     * @description will set the EasyEmail secret
     */
    setEasyEmailSecretInitially(): void {
      this.dispatchEasyEmailEvent(
          Outgoing.SET_SECRET,
          {
            i_gap : (new EasyEmailSecretHandler()).generateKey(),
          }
      )

    }
  },
  async created(): Promise<void> {
    this.templates           = await this.getAllTemplates();
    this.predefinedTemplates = await this.getCloneAbleTemplates();
    await this.checkEmailTemplateRestriction();
    this.registerBeforeUnload();
    this.setEasyEmailSecretInitially();
  },
}
</script>
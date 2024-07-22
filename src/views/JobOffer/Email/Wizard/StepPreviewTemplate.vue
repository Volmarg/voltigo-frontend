<template>
  <div>
    <div>

      <h1 class="text-blue-500 font-extrabold text-center job-detail-title mb-4 header">
        {{ $t('components.jobOfferEmailWizard.steps.previewTemplate.header') }}
      </h1>

      <hr/>

      <div class="flex flex-wrap">
        <p class="text-blue-500 font-extrabold text-lg">
          {{ $t('components.jobOfferEmailWizard.steps.previewTemplate.subject.label') }}:
        </p>
        <p
            v-if="subject"
            class="subject"
        >
          {{ subject }}
        </p>

        <p
            v-else
            class="subject text-gray-500"
        >
          ({{ $t('components.jobOfferEmailWizard.steps.previewTemplate.subject.isNotSet.text') }})
        </p>
      </div>

      <p class="text-blue-500 font-extrabold text-lg text-center">
        {{ $t('components.jobOfferEmailWizard.steps.previewTemplate.body.label') }}
      </p>
      <p class="text-xs text-center italic">
        {{ $t('components.jobOfferEmailWizard.steps.previewTemplate.body.info') }}
      </p>
      <hr class="mt-2"/>
      <div class="template-preview">
        <html-iframe :html="parsedContent"/>
      </div>

    </div>

    <hr class="mt-2"/>

  </div>
</template>

<script lang="ts">
import {ComponentData}    from "@/scripts/Vue/Types/Components/types";
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";

import DummyVariablesProviderMixin           from "@/views/JobOffer/Email/Mixin/DummyVariablesProviderMixin.vue";
import GenerateEmailMixin                    from "@/views/JobOffer/Email/Wizard/Common/Mixin/GenerateEmailMixin.vue";
import StepInterfaceMixin                    from "@/views/JobOffer/Email/Wizard/StepInterfaceMixin.vue";
import HtmlIframe                            from "@/components/Ui/HtmlIframe.vue";

import IframePostMessageControlService from "@/scripts/Core/Services/Security/IframePostMessageControlService";
import LocalStorageService             from "@/scripts/Core/Services/Storage/LocalStorageService";

/**
 * bug: the dual execution must be solved as the error message might be displayed twice,
 *      or some other logic in that will get added later over here, that's coming from the
 *      EmailWizard, this is not severe but might cause some performance issues (especially with EasyEmail calls)
 */
type ParsedContentForTemplate = {
  templateId    : number,
  parsedContent : string,
};

/**
 * @description with this step user can see how the E-Mail will look like for some example job offers
 */
export default {
  name: "JobOfferEmailWizardStepPreviewTemplate",
  components: {HtmlIframe},
  data(): ComponentData {
    return {
      parsedContentForTemplate: [] as Array<ParsedContentForTemplate>,
      isEmailPreviewModalVisible: false,
      parsedContent: "",
      rawContent: "",
      subject: null,
      stepName: 'previewTemplate',
    }
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    jobOffer: {
      type     : Object as unknown as JobOfferAnalyzed,
      required : true,
    },
    /** @param template {EmailTemplate} */
    template: {
      type     : Object,
      required : true,
    }
  },
  emits: [
    "getRandomSelectedJobOffer",
  ],
  mixins: [
    DummyVariablesProviderMixin,
    GenerateEmailMixin,
    StepInterfaceMixin,
    HtmlIframe
  ],
  computed: {
    /**
     * @description will look if given template was already parsed,
     *              - yes -> returns the already parsed content,
     *              - no  -> null is returned
     *
     * Info: this re-usage logic is added due to known issues of how unstable the EasyEmail iframes are (memory leakage)
     *       so rather than calling the EasyEmail to render things over and over, just re-using already parsed template
     */
    getAlreadyParsedContent(): string | null {
      let parsedContentEntry = this.parsedContentForTemplate.find( (parsedContentForTemplate: ParsedContentForTemplate) => {
        return (parsedContentForTemplate.templateId === this.template.id);
      })

      return parsedContentEntry?.parsedContent ?? null;
    }
  },
  methods: {
    /**
     * @description wipes all the parsed templates contents (for example when dummy variables with user data get updated)
     */
    clearParsedContents(): void {
      this.parsedContentForTemplate = [];
      this.parsedContent = '';
    },
    /**
     * @description triggers the logic after email preview modal closed event got emitted:
     *              - will just hide the modal
     */
    onEmailPreviewModalClosed(): void {
      this.isEmailPreviewModalVisible = false;
    },
    /**
     * @description will show the email preview dialog
     */
    showEmailPreviewDialog(): void {
      this.isEmailPreviewModalVisible = true;
    },
    /**
     * @description will build template data
     */
    async buildTemplateData(): Promise<void> {

      this.rawContent = this.template.body;
      this.subject    = this.template.subject;

      if (this.getAlreadyParsedContent) {
        this.parsedContent = this.getAlreadyParsedContent;
        return;
      }

      // this.$rootEvent.showFullPageLoader();

      let templateVariables = await this.provideDummyVariables();
      this.sendRenderEmailRequest(this.rawContent, templateVariables);
      let emailRenderedHandler = (response) => {
        IframePostMessageControlService.checkAndHandleMessageCheck(response);

        switch (response.data.event) {
          case this.event.renderEmails.get:

            this.parsedContent = response.data.html;
            // this.$rootEvent.hideFullPageLoader();

            this.parsedContentForTemplate.push({
              parsedContent : this.parsedContent,
              templateId    : this.template.id,
            });
          }
      };

      window.addEventListener("message", emailRenderedHandler, { once: true})
    },
    /**
     * @description check if the step state is valid
     */
    isValid(): boolean {
      return true;
    }
  },
  watch: {
    'template.id'(): void {
      this.buildTemplateData();
    },
    /**
     * @description this forces the parsed content to be re-rendered (helps when user data gets updated via jwt etc.)
     */
    isVisible(): void {
      if (!LocalStorageService.isSet(LocalStorageService.EMAIL_TEMPLATE_EDITOR_DUMMY_VARIABLES)) {
        this.clearParsedContents();
        this.buildTemplateData();
        return;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.subject {
  align-self: center !important;
  @apply ml-2
}

.template-preview {
  min-height: 400px;
  @apply text-left mt-10 lg:max-h-96 overflow-y-hidden
}
</style>
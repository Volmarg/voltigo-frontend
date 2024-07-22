<template>
  <modal :title="$t('builder.modal.builder.title')"
         :cancel-text="$t('builder.modal.builder.buttons.cancel')"
         :is-visible="showModal"
         size="full"
         @modal-closed="$emit('modalClosed')"
         class="easy-email-modal"
  >
    <template #content>

      <div class="flex justify-center">
        <!-- not using classes in this case because these won't get applied at all, that's probably some issue with fontawesome icons -->
        <QuestionMarkAbout
            :text="$t('builder.modal.infoText.keepInMindSet')"
            :style="{
              'font-size': '30px'
            }"
        />
      </div>

      <!-- info: while this works, it makes the loading of iframe look bad-->
      <iframe :src="emailBuilderUrl"
              class="w-full h-full email-builder-iframe"
              ref="easyEmailIframe"
      />
    </template>
  </modal>

  <RegulationsModal
      :force-is-visible="!isGeneralTermsRegulationAccepted && showModal"
  />

  <v-tour
      :name="tourName"
      :steps="searchTourSteps"
      :callbacks="searchTourCallbacks"
  />

</template>

<script lang="ts">
import Modal from "@/components/Modal/Modal.vue";

import EnvReader                            from "@/scripts/Core/System/EnvReader";
import Incoming                             from "@/scripts/Core/Services/EasyEmail/Event/Incoming";
import StringTypeProcessor                  from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";
import UserActivityListener                 from "@/scripts/Core/Listeners/UserActivityListener";
import IframePostMessageControlService      from "@/scripts/Core/Services/Security/IframePostMessageControlService";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import RegulationsModal            from "@/views/Email/Template/Builder/Modal/RegulationsModal.vue";
import QuestionMarkAbout           from "@/components/Ui/QuestionMarkAbout.vue";
import EasyEmailMixin              from "@/mixins/Libs/EasyEmailMixin.vue";
import DummyVariablesProviderMixin from "@/views/JobOffer/Email/Mixin/DummyVariablesProviderMixin.vue";

import EasyEmailTourMixin      from "@/views/Email/Template/Builder/Modal/EasyEmailTourMixin.vue";
import UserRegulationMixin     from "@/mixins/User/UserRegulationMixin.vue";
import {REGULATION_IDENTIFIER} from "@/router/SymfonyRoutes/User/Regulation/SymfonyUserRegulationsRoutes";

/**
 * [WARNING] SUPER IMPORTANT
 * This whole logic in here utilizes the {@link https://github.com/arco-design/easy-email/issues}
 * The problem is that it's VERY HEAVY, so it should be avoided to trigger loading of the iframe to often,
 * There was severe issue that upon quickly opening n closing the modal browser tab would just froze
 * - that is not Vue issue, that's the EasyEmail problem, this was tested even with plain html/js and simple .appendChild
 *
 * Info: In case the problems comes back in, something that could be considered:
 *       - not changing the url on each request, instead send the data via `post` and just reload the content of modal,
 *       - creating multiple iframes per visited url, and then switching between them if already opened,
 *       - delay modal closing so that user will not have time to quickly click on other template,
 *
 * At all cost!:
 * - avoid reloading the iframe if possible (it should just re-open when clicking previously clicked iframe)
 */
export default {
  name: "EmailTemplateBuilderModalEasyEmail",
  data(): ComponentData {
    return {
      tourConfig: {
        awaitCssSelectorBeforeStart: '.email-builder-iframe'
      },
      isGeneralTermsRegulationAccepted: false,
      showModal: false,
      templateEditSessionKey: null,
      url: {
        editor: "/editor"
      }
    }
  },
  props: {
    templates: {
      type     : Array,
      required : true,
    },
    predefinedTemplates: {
      type     : Array,
      required : true,
    },
    isVisible: {
      type     : Boolean,
      required : false,
    },
    // type is skipped here as for some reason vue throws some wierd error when it's set
    editedTemplateId: {
      required : false,
      default  : null,
    }
  },
  components: {
    Modal,
    RegulationsModal,
    QuestionMarkAbout
  },
  emits: [
    "saveTemplate",
  ],
  mixins: [
    EasyEmailMixin,
    EasyEmailTourMixin,
    UserRegulationMixin,
    DummyVariablesProviderMixin
  ],
  computed: {
    /**
     * @description provides the email builder url, either:
     *              - for new template,
     *              - editing existing template
     *
     * the `id=0` is set in order to force the editor (other project) to begin template loading process and then edit it
     * EasyEmail does not have access to the backend with templates and will not have such!
     *
     * Info: cannot use base64 here and put the base64 in url because of some special characters in the json
     */
    emailBuilderUrl(): string {
      if (StringTypeProcessor.isEmptyString(this.editedTemplateId)) {
        return EnvReader.getEmailBuilderUrl() + this.url.editor;
      }

      return EnvReader.getEmailBuilderUrl() + `${this.url.editor}?id=0&userId=0&templateDataSessionKey=${this.templateEditSessionKey}`;
    },
    /**
     * @description returns the edited template body - these body is parsed and loaded by EasyEmail
     */
    editedTemplateBody(): string|null {
      for (let template of this.templates) {
        if (template.id === this.editedTemplateId) {
          return template.body;
        }
      }

      for (let template of this.predefinedTemplates) {
        if (template.id === this.editedTemplateId) {
          return template.body;
        }
      }

      return null;
    }
  },
  methods: {
    /**
     * @description loads data necessary for the email builder to work (from backend),
     *              once loaded, sends them to EasyEmail via iframe
     */
    async getAndPushDataToEmailBuilder(): Promise<void> {
      if (
              null === this.editedTemplateBody
            /**
             * @description this is valid only when clicking on `new template`,
             *              the new template must have the data loaded too
             */
          &&  this.editedTemplateId !== null
      ) {
        return;
      }

      let variables               = await this.provideDummyVariables();
      this.templateEditSessionKey = this.generateTemplateSessionKey();

      await this.sendTemplateDummyVariables(variables);
      await this.sendTemplateDataToIframe(this.editedTemplateBody, this.templateEditSessionKey, variables);
    }
  },
  async created(): Promise<void> {
    this.templateEditSessionKey           = this.generateTemplateSessionKey();
    this.isGeneralTermsRegulationAccepted = await this.isUserRegulationAccepted(REGULATION_IDENTIFIER[REGULATION_IDENTIFIER.EMAIL_BUILDER_GENERAL_USAGE]);

    await this.getAndPushDataToEmailBuilder();
  },
  mounted(): void {
    /**
     * @description this is required in order to listen for post (event) coming from the iframe,
     *              this is also needed to bypass the CORS as the builder code is coming from other url
     */
    window.addEventListener("message", (messageContent) => {
      IframePostMessageControlService.checkAndHandleMessageCheck(messageContent);

      switch(messageContent.data.event){
        case Incoming.SAVE_TEMPLATE:
          this.$emit('saveTemplate', messageContent.data);
          break;

        case Incoming.WINDOW_CLICK:
          (new UserActivityListener()).storeUserActivityTimestamp();
          break;

        default:
          return;
      }

    });
  },
  watch: {
    async isVisible(newValue: unknown): Promise<void> {
      this.showModal = newValue;

      /**
       * This is actually not a mistake to fetch this each time that visibility changes. It's possible that
       * the regulation will get renewed and user will need to accept them once again (content of regulation would change)..
       */
      this.isGeneralTermsRegulationAccepted = await this.isUserRegulationAccepted(REGULATION_IDENTIFIER[REGULATION_IDENTIFIER.EMAIL_BUILDER_GENERAL_USAGE]);
    },
    /**
     * @description another solution for making the iframes work
     *
     *  This seems to make no sense, but it actually DOES:
     *  - on initial load the REAL iframe MUST wait for the dummy one to get loaded before any data get sent to it,
     *  - on the moment the DUMMY iframe is loaded the promise is resolved and first REAL modal is getting open
     *  - also upon resolving the promise, its code get never executed again, thus the `if` on beginning
     *    to load new content into the iframe each time that edited template id changes
     */
    async editedTemplateId(): Promise<void> {
      await this.getAndPushDataToEmailBuilder();
    }
  }
}
</script>

<style lang="scss" scoped>
.email-builder-iframe {
  min-height: 500px;
  height: 75vh;
}
</style>
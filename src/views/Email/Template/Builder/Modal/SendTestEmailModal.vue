<template>
  <div>
    <Modal
        :is-visible="isVisible"
        :title="$t('sendTest.modal.header')"
        :is-close-visible="true"
        :is-close-full-width="true"
        :has-body-padding="false"
        :size="isPhoneBreakingPoint ? 'full' : 'medium'"
        @modal-closed="$emit('modalClosed')"
    >
      <template #content>

        <div class="pl-2 sm:pl-4 pr-2 sm:pr-4">
          <div class="text-left">
            <p v-html="$t('sendTest.modal.content.info.general')" />
            <p class="mt-3 sm:mt-1">
              <span class="font-bold">{{ $t('sendTest.modal.content.info.recipient.label') }}: </span>
              <span>{{ userStateStore.user.email }}</span>
            </p>

            <p class="mt-3 sm:mt-1">
              <span class="font-bold">{{ $t('sendTest.modal.content.info.dailyLimit.label') }}: </span>

              <span>{{ restriction.sentToday }} <small>({{ $t('sendTest.modal.content.info.dailyLimit.sent') }})</small></span>
              <span> / </span>
              <span>{{ restriction.maxPerDay }} <small>({{ $t('sendTest.modal.content.info.dailyLimit.max') }})</small></span>
            </p>
          </div>

          <InformationBlock
              :text="$t('sendTest.modal.content.info.disclaimer.footer')"
              class="mt-5 mb-5"
          />

          <div>
            <div class="button-wrapper">
              <MediumButtonWithIcon
                  class="mb-4 w-full px-2 sm:px-0"
                  :disabled="isDailyLimitReached"
                  button-classes="email-send-test"
                  text-classes="email-send-test-text"
                  :text="$t('sendTest.modal.button.send')"
                  @button-click="onSendTest"
              />
            </div>

          </div>
        </div>

      </template>

    </Modal>

  </div>
</template>

<script lang="ts">
import ResponsiveVarsMixin          from "@/mixins/Responsive/ResponsiveVarsMixin.vue";
import GenerateEmailMixin           from "@/views/JobOffer/Email/Wizard/Common/Mixin/GenerateEmailMixin.vue";
import DummyVariablesProviderMixin  from "@/views/JobOffer/Email/Mixin/DummyVariablesProviderMixin.vue";
import FailedBackendResponseHandler from "@/scripts/Vue/Mixins/FailedBackendResponseHandler.vue";

import Modal                from "@/components/Modal/Modal.vue";
import MediumButtonWithIcon from "@/components/Navigation/Button/MediumButtonWithIcon.vue";
import InformationBlock     from "@/components/Page/InformationBlock.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";
import {ToastTypeEnum} from "@/scripts/Libs/ToastNotification";

import IframePostMessageControlService from "@/scripts/Core/Services/Security/IframePostMessageControlService";
import LocalStorageService             from "@/scripts/Core/Services/Storage/LocalStorageService";

import SymfonyRoutes       from "@/router/SymfonyRoutes";
import SymfonyEmailRoutes  from "@/router/SymfonyRoutes/SymfonyEmailRoutes";
import SymfonySystemRoutes from "@/router/SymfonyRoutes/SymfonySystemRoutes";
import EmailTemplate       from "@/scripts/Entity/Email/EmailTemplate";

import BaseError                    from "@/scripts/Core/Error/BaseError";
import BaseApiResponse              from "@/scripts/Response/BaseApiResponse";
import MaxTemplateTestEmailResponse from "@/scripts/Response/System/Restriction/MaxTemplateTestEmailResponse";

import {EmailTemplateVariables}         from "@/scripts/Core/Types/EmailTemplate";
import {UserStateStore, userStateStore} from "@/scripts/Vue/Store/UserState";

export default {
  data(): ComponentData {
    return {
      restriction: {
        sentToday: 0,
        maxPerDay: 0,
      },
      isVisible: false,
      userStateStore: null as null | UserStateStore,
    }
  },
  props: {
    forceIsVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    templateId: {
      type: [Number, null],
      required: true,
    },
    /** @var {Array<EmailTemplate>} */
    templates: {
      type: Array,
      required: true,
    }
  },
  mixins: [
    FailedBackendResponseHandler,
    DummyVariablesProviderMixin,
    ResponsiveVarsMixin,
    GenerateEmailMixin,
  ],
  components: {
    MediumButtonWithIcon,
    InformationBlock,
    Modal,
  },
  computed: {
    /**
     * @description check if user has reached max allowed test E-Mails per day
     */
    isDailyLimitReached(): boolean {
      return (this.restriction.maxPerDay === this.restriction.sentToday);
    }
  },
  methods: {
    /**
     * @description will generate the E-Mail with variables prefilled with dummy data.
     *              Such E-Mail is then sent on backend and eventually gets forwarded to user.
     */
    async onSendTest(): Promise<void> {
      if (this.isDailyLimitReached) {
        return;
      }

      if (!this.templateId) {
        throw new BaseError("Template id is not yet set for sending template test E-Mail");
      }

      let template : undefined | EmailTemplate = this.templates.find((template: EmailTemplate) => template.id === this.templateId);
      if (!template) {
        throw new BaseError(`Tried sending test E-Mail. No template has been found for id: ${this.templateId}`);
      }

      let templateVariablesJson = LocalStorageService.get(LocalStorageService.EMAIL_TEMPLATE_EDITOR_DUMMY_VARIABLES);
      let templateVariables: EmailTemplateVariables;

      if (templateVariablesJson) {
        templateVariables = JSON.parse(templateVariablesJson);
      } else {
        templateVariables = await this.provideDummyVariables();
      }

      this.sendRenderEmailRequest(template.body, templateVariables, this.templateId);
      window.addEventListener("message", this.testEmailGeneratedHandler);
    },
    /**
     * @description this function handles the EmailBuilder finishing generating the E-Mail,
     *              sends it further to the backend where it's going to be forwarded to user.
     */
    testEmailGeneratedHandler(event: MessageEvent): void {
      this.$rootEvent.showFullPageLoader();
      IframePostMessageControlService.checkAndHandleMessageCheck(event);

      if (event.data.event === this.event.renderEmails.get) {
        let dataBag = {
          'emailBody': event.data.html
        };

        let url = SymfonyRoutes.buildUrl(SymfonyEmailRoutes.URL_SEND_TEST_MAIl, {
              [SymfonyEmailRoutes.URL_SEND_TEST_MAIL_PARAMETER_TEMPLATE_ID]: event.data.trackerId,
            }
        );

        this.$axios.postWithCsrf(url, dataBag, false).then((response: BaseApiResponse) => {
          this.$rootEvent.hideFullPageLoader();
          if (!response.success) {
            this.handleFailedBackendResponse(response, url);
            return;
          }

          this.$rootEvent.showNotification(ToastTypeEnum.success, response.message);
        })
      } else {
        this.$rootEvent.hideFullPageLoader();
      }

      window.removeEventListener("message", this.testEmailGeneratedHandler);
      this.$emit('modalClosed');
    },
    /**
     * @description provides and sets the information about daily limit of sending E-Mails for "E-Mail template"
     */
    async getTestRestrictionInfo(): Promise<void> {
      let url = SymfonyRoutes.buildUrl(SymfonySystemRoutes.URL_CHECK_EMAIL_TEMPLATE_TEST_SENDING_RESTRICTION);

      this.$rootEvent.showFullPageLoader();
      this.$axios.getWithCsrf(url, MaxTemplateTestEmailResponse).then((response: MaxTemplateTestEmailResponse) => {
        this.$rootEvent.hideFullPageLoader();

        if (!response.success) {
          this.handleFailedBackendResponse(response, url);
          return;
        }

        this.restriction.maxPerDay = response.maxPerDay;
        this.restriction.sentToday = response.sentToday;
      })
    }
  },
  created(): void {
    this.isVisible = this.forceIsVisible;
    this.userStateStore = userStateStore();
    this.userStateStore.loadUserData();
  },
  watch: {
    async forceIsVisible(): Promise<void> {
      // prevent fetch when modal is getting closed
      if (this.forceIsVisible) {
        await this.getTestRestrictionInfo();
      }

      this.isVisible = this.forceIsVisible;
    },
  }
}
</script>

<style lang="scss" scoped>
.button-wrapper {
  @apply flex
}
</style>

<style lang="scss">
.email-send-test {
  @apply w-full md:w-1/3 lg:w-1/4 text-center
}

.email-send-test-text {
  @apply md:text-center w-full
}
</style>

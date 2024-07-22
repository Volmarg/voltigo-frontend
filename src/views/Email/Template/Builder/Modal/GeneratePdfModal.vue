<template>
  <div>

    <Modal
        :is-visible="isVisible"
        :title="$t('pdf.modal.header.label')"
        :is-close-visible="true"
        :is-close-full-width="true"
        :has-body-padding="false"
        :size="isPhoneBreakingPoint ? 'full' : 'medium'"
        @modal-closed="$emit('modalClosed')"
    >
      <template #content>

        <div
            class="p-2 sm:p-4"
            v-if="userStateStore?.user?.account?.canGeneratePdfFromTemplate ?? false"
        >
          <Accordion class="important-information-accordion mb-4">
            <AccordionPanel
                class="accordion-panel"
                :initially-open="!isMobileBrowser"
            >
              <template #title>
                <span class="underline">
                  {{ $t('pdf.modal.information.header') }}
                </span>
              </template>

              <template #content>
                <WarningBlock class="mb-6">
                  <p class="text-left">
                    {{ $t('pdf.modal.warning.text') }}
                  </p>
                </WarningBlock>

                <InformationBlock class="mb-6">
                  <p
                      v-html="$t('pdf.modal.description.general')"
                      class="text-left"
                  />
                </InformationBlock>
              </template>

            </AccordionPanel>
          </Accordion>

          <p class="button-description">{{ $t('pdf.modal.description.multiPage') }}</p>

          <div class="button-wrapper">
            <MediumButtonWithIcon
                class="mb-4 w-full px-2 sm:px-0"
                button-classes="email-generate-pdf-btn"
                text-classes="email-generate-pdf-btn-text"
                :text="$t('pdf.modal.button.multiPage')"
                @button-click="getPdf(getMultiPagePdfBas64(htmlContent, source.template))"
            />
          </div>

          <p class="button-description">{{ $t('pdf.modal.description.single') }}</p>

          <div class="button-wrapper">
            <MediumButtonWithIcon
                class="mb-4 w-full px-2 sm:px-0"
                button-classes="email-generate-pdf-btn"
                text-classes="email-generate-pdf-btn-text"
                :text="$t('pdf.modal.button.single')"
                @button-click="getPdf(getSinglePdfBase64(htmlContent, source.template), 200)"
            />
          </div>
        </div>

        <div
            class="p-2 sm:p-4"
            v-else
        >
          <p v-html="$t('pdf.modal.description.notAllowed')" />

          <div 
              class="mt-8 hover:opacity-70 cursor-pointer"
              @click="onChargeClicked"
          >
            <p class="italic">
              {{ $t('pdf.modal.description.notAllowedClickHereToCharge') }}
            </p>
            <div class="flex justify-center">
              <img src="/public/image/system/gem/gem-32.png"/>
            </div>
          </div>

        </div>

      </template>

    </Modal>

  </div>
</template>

<script lang="ts">
import HtmlToPdfBase64ProviderAwareMixin from "@/mixins/Awarness/HtmlToPdfBase64ProviderAwareMixin.vue";
import ResponsiveVarsMixin               from "@/mixins/Responsive/ResponsiveVarsMixin.vue";
import WarningBlock                      from "@/components/Page/WarningBlock.vue";

import Modal                from "@/components/Modal/Modal.vue";
import InformationBlock     from "@/components/Page/InformationBlock.vue";
import MediumButtonWithIcon from "@/components/Navigation/Button/MediumButtonWithIcon.vue";
import AccordionPanel       from "@/components/Ui/Accordion/Panel.vue";
import Accordion            from "@/components/Ui/Accordion/Accordion.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import Base64DownloadService    from "@/scripts/Core/Services/Download/Base64DownloadService";
import Base64PdfDownloadService from "@/scripts/Core/Services/Download/Base64PdfDownloadService";
import BrowserDetection         from "@/scripts/Core/Services/View/BrowserDetection";

import {UserStateStore, userStateStore} from "@/scripts/Vue/Store/UserState";

export default {
  data(): ComponentData {
    return {
      isMobileBrowser: BrowserDetection.isMobileBrowser(),
      userStateStore: null as null | UserStateStore,
      pdfService: Base64PdfDownloadService,
      isVisible: false,
    }
  },
  props: {
    htmlContent: {
      type: String,
      required: true,
    },
    forceIsVisible: {
      type: Boolean,
      required: true,
      default: false,
    }
  },
  mixins: [
    ResponsiveVarsMixin,
    HtmlToPdfBase64ProviderAwareMixin
  ],
  components: {
    Accordion,
    AccordionPanel,
    Modal,
    WarningBlock,
    InformationBlock,
    MediumButtonWithIcon
  },
  methods: {
    /**
     * @description will show the finances modal
     */
    onChargeClicked(): void {
      this.$root.$refs.appRouterView.$refs.topBarComponent.$refs.topNavbarFoundsStatus.$el.click();
    },
    /**
     * @description will wait for the pdf fetching promise to resolve and then will open
     *              new tab with an iframe that contains pdf preview with possibility to download it
     */
    async getPdf(promise: Promise<string>, zoom: number = 100): Promise<void> {
      let base64 = await promise;

      // iframe based preview won't open on mobile
      if (this.isMobileBrowser) {
        Base64DownloadService.downloadPdfFile(base64);
        return;
      }

      Base64PdfDownloadService.openDownloadableNewWindow(base64, zoom);
    }
  },
  created(): void {
    this.isVisible = this.forceIsVisible;
    this.userStateStore = userStateStore();
    this.userStateStore.loadUserData()
  },
  watch: {
    forceIsVisible(): void {
      this.isVisible = this.forceIsVisible;
    }
  }
}
</script>

<style lang="scss" scoped>
.button-description {
  @apply mb-2 text-left
}

.button-wrapper {
  @apply flex
}
</style>

<style lang="scss">
.email-generate-pdf-btn {
  @apply w-full md:w-1/3 lg:w-1/4 text-center
}

.email-generate-pdf-btn-text {
  @apply md:text-center w-full
}
</style>

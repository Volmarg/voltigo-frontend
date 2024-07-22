<template>
  <div>

    <Cv
        @cv-attachment-selection-change="$emit('cvAttachmentSelectionChange', $event)"
        ref="cvStepComponent"
    />

    <MediumButtonWithIcon :text="$t('components.jobOfferEmailWizard.steps.selectAttachments.cv.uploadCv.label')"
                          :is-icon-on-top="true"
                          @click="isCvModalVisible = true"
                          class="ml-4 flex"
                          button-classes="w-full md:w-auto"
                          margin-right-class-number="4"
    >
      <template #icon>
        <la svg-icon-name="file-pdf"
            color="white"
        />
      </template>
    </MediumButtonWithIcon>

    <CvModal :is-visible="isCvModalVisible"
             @modal-closed="isCvModalVisible = false"
             @upload-finished="handleCvListChange"
             @file-removed="handleCvListChange"
             @file-update="handleCvListChange"
    />

  </div>
</template>

<script lang="ts">
import Cv                   from "@/views/JobOffer/Email/Wizard/Attachments/Cv.vue";
import CvModal              from "@/views/User/Settings/Views/Files/components/Cv/components/CvModal.vue";
import MediumButtonWithIcon from "@/components/Navigation/Button/MediumButtonWithIcon.vue";

import StepInterfaceMixin     from "@/views/JobOffer/Email/Wizard/StepInterfaceMixin.vue";
import TemplatesProviderMixin from "@/scripts/Vue/Mixins/Email/TemplatesProviderMixin.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

/**
 * @description in this step user selects attachments that will be sent with E-Mail
 */
export default {
  name: "JobOfferEmailWizardStepSelectAttachments",
  data(): ComponentData {
    return {
      isCvModalVisible: false,
    };
  },
  mixins: [
    StepInterfaceMixin,
    TemplatesProviderMixin,
  ],
  components: {
    MediumButtonWithIcon,
    Cv,
    CvModal,
  },
  methods: {
    /**
     * @description check if the step state is valid
     */
    isValid(): boolean {
      return true;
    },
    /**
     * @description refresh cv files list,
     */
    handleCvListChange(): void {
      this.$refs.cvStepComponent.resetSelectedCvId(); // needed because user could have the removed file selected
      this.$refs.cvStepComponent.getUserCvFiles();
      this.$emit('cvAttachmentSelectionChange', null); // due to calling reset
    }
  },
}
</script>

<style lang="scss" scoped>
// defines proportions between left and right side
.template-n-preview-grid {
  grid-template-columns: 65% 35%;
}
</style>
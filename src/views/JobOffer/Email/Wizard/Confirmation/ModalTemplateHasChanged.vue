<template>
  <modal :title="$t('components.jobOfferEmailWizard.steps.confirmation.modal.templateHasChanged.title')"
         :is-visible="isVisible"
         :cancel-text="$t('components.jobOfferEmailWizard.steps.confirmation.modal.templateHasChanged.cancelButton')"
         @modal-closed="$emit('modalClosed')"
  >
    <template #content>
      <div class="flex flex-row">
        <div>
          <la svg-icon-name="exclamation-triangle-solid"
              color="orange"
              font-size="50"
          />
        </div>
        <div v-html="$t('components.jobOfferEmailWizard.steps.confirmation.modal.templateHasChanged.body')"></div>
      </div>

    </template>
  </modal>
</template>

<script lang="ts">
import Modal       from "@/components/Modal/Modal.vue";
import LineAwesome from "@/components/Ui/Icons/LineAwesome.vue";

export default {
  name: "JobOfferEmailWizardConfirmationModalEMailTemplateChanged",
  props: {
    isVisible: {
      type     : Boolean,
      required : true,
    }
  },
  emits: [
      'modalClosed'
  ],
  components: {
    Modal,
    "la": LineAwesome,
  }
}
</script>
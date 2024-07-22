<template>
  <div>

    <Modal
        :is-visible="isVisible"
        :title="$t('guide.modal.header')"
        :cancel-text="$t('guide.modal.buttons.close.label')"
        size="full"
        @modal-closed="$emit('modalClosed')"
    >
      <template #content>

        <div class="modal-body flex flex-col">

          <div class="information">
            <p class="section-name">
              {{ $t('guide.modal.sections.interface.header') }}
            </p>

            <p class="section-description">
              {{ $t('guide.modal.sections.interface.description.part1') }}
            </p>

            <div class="img-wrapper">
              <img src="/src/assets/img/email-builder/guide/details.png" class="details-img"/>
            </div>
          </div>

          <div class="information">
            <p class="section-description">
              <ul class="list-disc ml-5">
                <li
                    v-for="index in 12"
                    :key="index"
                > <b>({{ index }})</b>. {{ $t(`guide.modal.sections.interface.points.${index}`) }}</li>
              </ul>
            </p>
          </div>
          <div class="section-spacer"></div>






          <div class="information">
            <p class="section-name">
              {{ $t('guide.modal.sections.addingComponent.header') }}
            </p>

            <p class="section-description">
              {{ $t('guide.modal.sections.addingComponent.description.part1') }}
            </p>

            <p class="section-description">
              {{ $t('guide.modal.sections.addingComponent.description.part2') }}
            </p>

            <div class="img-wrapper">
              <img src="/src/assets/img/email-builder/guide/drag-components.gif" />
            </div>
          </div>

          <div class="section-spacer"></div>

          <div class="information">
            <p class="section-name">
              {{ $t('guide.modal.sections.movingRemovingComponent.header') }}
            </p>

            <p class="section-description">
              {{ $t('guide.modal.sections.movingRemovingComponent.description') }}
            </p>

            <div class="img-wrapper">
              <img src="/src/assets/img/email-builder/guide/drag-n-remove.gif" />
            </div>
          </div>

          <div class="section-spacer"></div>

          <div class="section-spacer"></div>

          <div class="information">
            <p class="section-name">
              {{ $t('guide.modal.sections.dynamicContentVariables.header') }}
            </p>
            <p class="section-description">
              {{ $t('guide.modal.sections.dynamicContentVariables.description') }}
            </p>

            <div class="img-wrapper">
              <img src="/src/assets/img/email-builder/guide/Variables.gif" />
            </div>
          </div>

          <div class="section-spacer"></div>

          <div class="information">
            <p class="section-name">
              {{ $t('guide.modal.sections.usingTemplate.header') }}
            </p>
            <p class="section-description">
              {{ $t('guide.modal.sections.usingTemplate.description') }}
            </p>

            <div class="img-wrapper">
              <img src="/src/assets/img/email-builder/guide/application-wizard-confirmation.png" class=" w-3/4"/>
            </div>
          </div>

        </div>

      </template>
    </Modal>

  </div>
</template>

<script lang="ts">
import Modal from "@/components/Modal/Modal.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

export default {
  data(): ComponentData {
    return {
      isVisible: false,
    }
  },
  props: {
    forceIsVisible: {
      type: Boolean,
      required: true,
      default: false,
    }
  },
  components: {
    Modal,
  },
  created(): void {
    this.isVisible = this.forceIsVisible;
  },
  watch: {
    forceIsVisible(): void {
      this.isVisible = this.forceIsVisible;
    }
  }
}
</script>

<style lang="scss" scoped>
.section-label {
  @apply font-bold
}

.section-text {
  @apply text-left
}

.section-spacer {
  @apply w-full border border-gray-100 mt-2 mb-2
}

.details-img {
  width: 80%;
}

.information {
  .section-name {
    @apply font-bold mb-2
  }

  .section-description {
    @apply mb-2 text-left
  }

  .img-wrapper {
    img {
      border-radius: 10px;
      @apply border border-gray-200
    }

    @apply flex justify-center mb-4
  }

}
</style>
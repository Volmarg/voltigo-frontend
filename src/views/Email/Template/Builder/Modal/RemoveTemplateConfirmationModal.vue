<template>
  <div>

    <WarningModal
        :is-visible="isVisible"
        :title="$t('removalConfirmationModal.title')"
        @modal-closed="$emit('modalClosed')"
        @confirm="$emit('confirm')"
    >
      <template #content>

        <div class="grid grid-cols-2 grid-cols-6">
          <la
              svg-icon-name="exclamation-triangle-solid"
              font-size="65"
              class="col-start-1 col-end-2"
              color="darkorange"
          />
          <div class="col-start-3 col-end-7 flex">
            <p class="align-self-center text-2md text-left"
               v-html="$t('removalConfirmationModal.text')"
            ></p>
          </div>
        </div>

      </template>
    </WarningModal>

  </div>
</template>

<script lang="ts">
import WarningModal  from "@/components/Modal/WarningModal.vue";

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
  emits: [
    "confirm"
  ],
  components: {
    WarningModal
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
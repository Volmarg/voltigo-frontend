<template>
  <div>
    <Modal
        :is-visible="isVisible"
        :title="$t('pointShop.modal.details.header.label')"
        :is-close-visible="true"
        :is-close-full-width="true"
        :has-body-padding="false"
        :size="isPhoneBreakingPoint ? 'full' : 'medium'"
        :cancel-text="$t('pointShop.modal.details.button.close.label')"
        @modal-closed="$emit('modalClosed')"
    >
      <template #content>
        <div class="text-gray-700">
          <div v-if="historyEntry.isJobSearchProduct()">
            <JobSearchProduct :job-search-product-data="historyEntry.getJobSearchProductData()" />
          </div>

          <div v-else-if="historyEntry.getEmailSendingProductData()">
            <EmailSending :email-sending-product-data="historyEntry.getEmailSendingProductData()" />
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import ResponsiveVarsMixin          from "@/mixins/Responsive/ResponsiveVarsMixin.vue";
import FailedBackendResponseHandler from "@/scripts/Vue/Mixins/FailedBackendResponseHandler.vue";

import Modal            from "@/components/Modal/Modal.vue";
import EmailSending     from "@/views/Payments/PointShopHistory/Components/Details/EmailSending.vue";
import JobSearchProduct from "@/views/Payments/PointShopHistory/Components/Details/JobSearchProduct.vue";

import {ComponentData}    from "@/scripts/Vue/Types/Components/types";
import {UserPointHistory} from "@/scripts/Response/PointShop/GetFullPointShopHistoryResponse";

export default {
  data(): ComponentData {
    return {
      isVisible: false,
    }
  },
  props: {
    /** @var {UserPointHistory} */
    historyEntry: {
      type: Object as unknown as UserPointHistory,
      required: true,
    },
    forceIsVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  mixins: [
    FailedBackendResponseHandler,
    ResponsiveVarsMixin,
  ],
  components: {
    JobSearchProduct,
    EmailSending,
    Modal,
  },
  created(): void {
    this.isVisible = this.forceIsVisible;
  },
  watch: {
    async forceIsVisible(): Promise<void> {
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

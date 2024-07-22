<template>
  <div>
    <!-- Order matters, as it's more strict this way -->

    <div v-if="isPaymentFailed(orderData.status)">
      <span class="status status-failed">{{ statusText }}</span>
    </div>

    <div v-else-if="isPaymentPending(orderData.status)">
      <span class="status status-pending">{{ statusText }}</span>
    </div>

    <div v-else-if="isPaymentCancelled(orderData.status)">
      <span class="status status-cancelled">{{ statusText }}</span>
    </div>

    <div v-else>
      <span class="status status-success">{{ statusText }}</span>
    </div>

  </div>
</template>

<script lang="ts">

import PaymentStatusMixin from "@/views/Payments/Mixin/PaymentStatusMixin.vue";

import {OrderData} from "@/scripts/Response/Order/GetOrdersDataResponse";

export default {
  props: {
    orderData: {
      type     : Object as unknown as OrderData,
      required : true,
    }
  },
  mixins: [
    PaymentStatusMixin,
  ],
  computed: {
    /**
     * @description returns status text
     */
    statusText(): string {
      return this.$t(`orderPaymentsOverview.filters.status.options.${this.orderData.status}`);
    }
  }
}
</script>


<style lang="scss">
.status {
  font-size: 20px;
}

.status-failed, .status-cancelled  {
  color: red;
}

.status-success {
  color: green;
}

.status-pending {
  color: orange;
}

</style>
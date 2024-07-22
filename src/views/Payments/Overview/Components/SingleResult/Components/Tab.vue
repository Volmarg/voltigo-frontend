<template>
  <div>
    <!-- tab -->
    <div class="w-full flex items-center justify-start p-4 bg-transparent shadow border-l-4 border-current p-4 mb-3 bg-white text-gray-500 text-2md"
         :class="{
            'border-green-600': isPaymentDone(orderData.status),
            'border-red-600'  : isPaymentFailed(orderData.status) || isPaymentCancelled(orderData.status),
            'orange'          : isPaymentPending(orderData.status),
           }"
    >
      <!-- tab content -->
      <div class="flex justify-start data-wrapper w-full sm:w-auto">
        <div class="grid grid-rows-1 grid-cols-2 gap-2 main-grid-wrapper w-full sm:w-auto">
          <StatusIcon :payment-status="orderData.status"/>

          <div class="grid grid-rows-1 grid-cols-1 gap-2">
            <StatusText :order-data="orderData"/>
            <Details :order-data="orderData"/>
            <Actions
                :order-data="orderData"
                v-if="isPaymentDone(orderData.status)"
            />
          </div>

        </div>
      </div>


    </div>

  </div>
</template>

<script lang="ts">

import StatusIcon from "@/views/Payments/Overview/Components/SingleResult/Components/StatusIcon.vue";
import StatusText from "@/views/Payments/Overview/Components/SingleResult/Components/StatusText.vue";
import Details    from "@/views/Payments/Overview/Components/SingleResult/Components/Details.vue";
import Actions    from "@/views/Payments/Overview/Components/SingleResult/Components/Actions.vue";

import PaymentStatusMixin from "@/views/Payments/Mixin/PaymentStatusMixin.vue";

import {OrderData} from "@/scripts/Response/Order/GetOrdersDataResponse";

export default {
  props: {
    orderData: {
      type     : Object as unknown as OrderData,
      required : true,
    }
  },
  components: {
    StatusIcon,
    StatusText,
    Details,
    Actions
  },
  mixins: [
    PaymentStatusMixin,
  ]
}
</script>

<style lang="scss" scoped>
.orange {
  border-color: orange
}

.main-grid-wrapper {
  grid-template-columns: 70px 1fr;
}
</style>
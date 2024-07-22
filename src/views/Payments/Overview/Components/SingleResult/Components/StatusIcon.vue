<template>
  <div class="status-icon-top-parent">

    <!-- Order matters, as it's more strict this way -->

    <div v-if="isPaymentFailed(paymentStatus)"
         class="status-icon-wrapper"
    >
      <la svg-icon-name="times-circle-solid"
          :font-size="config.iconSize"
          color="red"
          class="status-icon"
      />
    </div>

    <div v-else-if="isPaymentPending(paymentStatus)"
         class="status-icon-wrapper"
    >
      <la svg-icon-name="stopwatch-solid"
          :font-size="config.iconSize"
          color="orange"
          class="status-icon"
      />
    </div>

    <div v-else-if="isPaymentCancelled(paymentStatus)"
         class="status-icon-wrapper"
    >
      <la svg-icon-name="times-circle-solid"
          :font-size="config.iconSize"
          color="red"
          class="status-icon"
      />
    </div>

    <div v-else
         class="status-icon-wrapper"
    >
      <la svg-icon-name="check-circle-solid"
          :font-size="config.iconSize"
          color="green"
          class="status-icon"
      />
    </div>

  </div>
</template>

<script lang="ts">
import PaymentStatusMixin from "@/views/Payments/Mixin/PaymentStatusMixin.vue";

import LineAwesome from "@/components/Ui/Icons/LineAwesome.vue";

export default {
  data() {
    return {
      config: {
        iconSize: 50,
      }
    }
  },
  props: {
    paymentStatus: {
      type     : String,
      required : true,
    }
  },
  mixins: [
    PaymentStatusMixin,
  ],
  components: {
    "la" : LineAwesome,
  }
}
</script>

<style lang="scss" scoped>
.status-icon-top-parent {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 0;
}

</style>
<script lang="ts">

import {PAYMENT_STATUS_ENUM} from "@/scripts/Enum/PaymentStatusEnum";

export default {
  methods: {
    /**
     * @description check if payment is still in pending state
     */
    isPaymentPending(status: string): boolean {
      return !this.isPaymentFailed(status) && !this.isPaymentDone(status) && !this.isPaymentCancelled(status);
    },
    /**
     * @description check if payment is cancelled
     */
    isPaymentCancelled(status: string): boolean {
      return (status == PAYMENT_STATUS_ENUM[PAYMENT_STATUS_ENUM.CANCELLED]);
    },
    /**
     * @description check if payment is in failed state
     */
    isPaymentFailed(status: string): boolean {
      let failureKeys = [
          PAYMENT_STATUS_ENUM[PAYMENT_STATUS_ENUM.ERROR]
      ];
      return failureKeys.includes(status);
    },
    /**
     * @description check if payment can be considered done
     */
    isPaymentDone(status: string): boolean {
      let successKeys = [
        PAYMENT_STATUS_ENUM[PAYMENT_STATUS_ENUM.SUCCESS],
        PAYMENT_STATUS_ENUM[PAYMENT_STATUS_ENUM.SUCCESS_NOT_EQUAL_DEMANDED],
      ];
      return successKeys.includes(status);
    }
  }
}
</script>
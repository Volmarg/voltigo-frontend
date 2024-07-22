<script lang="ts">
import FailedBackendResponseHandler from "@/scripts/Vue/Mixins/FailedBackendResponseHandler.vue";

import SymfonyRoutes        from "@/router/SymfonyRoutes";
import SymfonyFinanceRoutes from "@/router/SymfonyRoutes/SymfonyFinanceRoutes";

import PrepareResponse from "@/scripts/Response/Payment/PrepareResponse";

import BaseError         from "@/scripts/Core/Error/BaseError";
import ToastNotification from "@/scripts/Libs/ToastNotification";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

type RequestDataBag = Record<string, string | number | Record<string, string | number>>;

/**
 * @description provides logic for handling so called 'prepared-payment'
 *              where payment can be created on one step and update on other independently.
 */
export default {
  data(): ComponentData {
    return {
      preparedOrderId: null,
    }
  },
  mixins: [
    FailedBackendResponseHandler
  ],
  methods: {
    /**
     * @description sends all the necessary payment data to backend without triggering it, only saving the information
     */
    async preparePayment(dataBag: RequestDataBag): Promise<void> {
      let calledUrl = SymfonyRoutes.buildUrl(SymfonyFinanceRoutes.PAYMENT_PREPARED_PREPARE);

      this.$rootEvent.showFullPageLoader();
      return this.$axios.postWithCsrf(calledUrl, dataBag, true, {}, PrepareResponse).then( (response: PrepareResponse) => {
        this.$rootEvent.hideFullPageLoader();
        if (!response.success) {
          this.handleFailedBackendResponse(response, calledUrl);
          throw new BaseError(this.$t('messages.internalServerError'));
        }

        this.preparedOrderId = response.orderId;
      })
    },
    /**
     * @description cancel the earlier prepared order
     */
    cancelPreparedPayment(): void {
      this.ensurePreparedOrderExist();

      let calledUrl = SymfonyRoutes.buildUrl(SymfonyFinanceRoutes.PAYMENT_PREPARED_CANCEL, {
        [SymfonyFinanceRoutes.PAYMENT_PREPARED_CANCEL_PARAM_ORDER_ID]: this.preparedOrderId,
      });

      this.$rootEvent.showFullPageLoader();
      this.$axios.getWithCsrf(calledUrl).then( (response) => {
        let notificationType = ToastNotification.getTypeFromCode(response.code)
        this.$rootEvent.showNotification(notificationType, response.message);
        this.$rootEvent.hideFullPageLoader();
        this.$emit('paymentFinished');
      })

      this.preparedOrderId = null;
    },
    /**
     * @description sends all the necessary data to backend and triggers the earlier prepared payment,
     */
    finishPreparedPayment(dataBag: RequestDataBag): void {
      this.ensurePreparedOrderExist();

      let calledUrl = SymfonyRoutes.buildUrl(SymfonyFinanceRoutes.PAYMENT_PREPARED_FINISH, {
        [SymfonyFinanceRoutes.PAYMENT_PREPARED_FINISH_PARAM_ORDER_ID]: this.preparedOrderId,
      });

      this.$rootEvent.showFullPageLoader();
      this.$axios.postWithCsrf(calledUrl, dataBag).then( (response) => {
        let notificationType = ToastNotification.getTypeFromCode(response.code)
        this.$rootEvent.showNotification(notificationType, response.message);
        this.$rootEvent.hideFullPageLoader();
        this.$emit('paymentFinished');
      })

      this.preparedOrderId = null;
    },
    /**
     * @description handle payment error, send error data to backend
     */
    handlePaymentError(errorData: unknown): void {
      this.ensurePreparedOrderExist();

      let calledUrl = SymfonyRoutes.buildUrl(SymfonyFinanceRoutes.PAYMENT_PREPARED_HANDLE_ERROR, {
        [SymfonyFinanceRoutes.PAYMENT_PREPARED_HANDLE_ERROR_PARAM_ORDER_ID]: this.preparedOrderId,
      });

      let dataBag = {
        paymentToolData: errorData,
      }

      this.$rootEvent.showFullPageLoader();

      // skipping encryption as otherwise the message is too long to transfer and encryptor fails
      this.$axios.postWithCsrf(calledUrl, dataBag, false).then( (response) => {
        let notificationType = ToastNotification.getTypeFromCode(response.code)
        this.$rootEvent.showNotification(notificationType, response.message);
        this.$rootEvent.hideFullPageLoader();
        this.$emit('paymentFinished');
      })

      this.preparedOrderId = null;
    },
    /**
     * @description takes some payment tool data and updates the information attached to the order, but without
     *              changing the state of the order. This method exists purely just to send payment tool data to
     *              the prepared order.
     */
    async updateToolDataForPreparedOrder(paymentToolData: Record<string, unknown>): Promise<void> {
      this.ensurePreparedOrderExist();

      let calledUrl = SymfonyRoutes.buildUrl(
          SymfonyFinanceRoutes.PAYMENT_PREPARED_UPDATE_PAYMENT_TOOL, {
            [SymfonyFinanceRoutes.PAYMENT_PREPARED_UPDATE_PAYMENT_TOOL_PARAM_ORDER_ID]: this.preparedOrderId
          }
      )

      let dataBag = {
        paymentToolData: {...paymentToolData}
      };

      this.$rootEvent.showFullPageLoader();
      await this.$axios.postWithCsrf(calledUrl, dataBag);
      this.$rootEvent.hideFullPageLoader();
    },
    /**
     * @description checks if prepared order data was fetched from backend and is still present on front
     */
    ensurePreparedOrderExist(): void {
      if (!this.preparedOrderId) {
        throw new BaseError("Prepared order id is not set!");
      }
    }
  },
}
</script>
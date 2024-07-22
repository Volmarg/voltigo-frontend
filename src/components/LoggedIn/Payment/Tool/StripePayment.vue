<template>
  <div class="ml-5 mr-5 mt-10 mb-10 payment-form-wrapper">
    <!-- Display a payment form -->
    <form
        id="payment-form"
        ref="paymentForm"
    >

      <!--Stripe.js injects the Payment Element-->
      <div id="payment-element" />

      <div class="mt-4 flex justify-center flex-col sm:flex-row">
        <Checkbox
            v-model="isConfirmedByUser"
            class="transform scale-75"
        />
        <span class="ml-2 align-self-center">{{ $t('paymentModal.confirm.text') }}</span>
        <AsteriskRequired />

      </div>

      <div class="flex justify-center">
        <PayNowButton
            @click="handlePayment"
            class="pay-now-button"
            :amount="priceWithTax"
            :currency="targetCurrencyCode"
            :is-disabled="!isConfirmedByUser"
        />
      </div>
    </form>
  </div>
</template>


<script lang="ts">

import Checkbox         from "@/components/Form/Checkbox.vue";
import PayNowButton     from "@/components/Ui/Payment/PayNowButton.vue";
import AsteriskRequired from "@/components/Form/AsteriskRequired.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import {ToastTypeEnum}                    from "@/scripts/Libs/ToastNotification";
import SymfonyRoutes                      from "@/router/SymfonyRoutes";
import SymfonyFinanceRoutes               from "@/router/SymfonyRoutes/SymfonyFinanceRoutes";
import GlobalWebsocketActionExecutor      from "@/scripts/Core/Services/Websocket/ActionExecutor/GlobalWebsocketActionExecutor";
import BackendErrorStorageService         from "@/scripts/Core/Services/Storage/BackendErrorStorageService";
import {systemDisabledStore}              from "@/scripts/Vue/Store/SystemDisabledState";
import EnvReader                          from "@/scripts/Core/System/EnvReader";
import Logger                             from "@/scripts/Core/Logger";

import GetPaymentIntentResponse from "@/scripts/Response/Payment/Stripe/GetPaymentIntentResponse";

import PreparedPaymentMixin         from "@/mixins/Payment/PreparedPaymentMixin.vue";
import MaxAllowedPaymentDataMixin   from "@/mixins/System/Restriction/MaxAllowedPaymentDataMixin.vue";
import FailedBackendResponseHandler from "@/scripts/Vue/Mixins/FailedBackendResponseHandler.vue";

import BaseError from "@/scripts/Core/Error/BaseError";

/**
 * @description NEVER, EVER load types from stripe, something is wrong with them and these break the building process,
 *              even on dev. There is just blank page afterward with no errors anywhere. If You need to use the types
 *              the OK use them, but DO REMOVE them from Your code before pushing it to repo.
 */
import {loadStripe} from '@stripe/stripe-js'

/**
 * {@link https://github.com/ectoflow/vue-stripe-js}
 * {@link https://stripe.dev/elements-examples/}
 * - see that example with just credit card information? That's literally how they propose to implement it
 */
export default {
  data():ComponentData {
    return {
      formElements: null,
      stripeInstance: null as null,
      paymentIntentToken: null,
      checkoutInstance: null,
      isConfirmedByUser: false,
      toolName: "STRIPE",
      stripeKey: EnvReader.getStripeKey(),
      instanceOptions: {},
      elementsOptions: {},
      stripeLoaded: false,
      elms: {},
      card: {},
      /**
       * {@link https://stripe.com/docs/js/element/other_methods/update?type=card#element_update-options}
       **/
      cardOptions: {
        hidePostalCode: true,
      }
    }
  },
  props: {
    productId: {
      type: Number,
      required: true,
    },
    targetCurrencyCode: {
      type: String,
      required: true,
    },
    priceWithoutTax: {
      type: Number,
      required: true,
    },
    priceWithTax: {
      type: Number,
      required: true,
    },
  },
  emits: [
    "paymentFinished"
  ],
  mixins: [
    MaxAllowedPaymentDataMixin,
    FailedBackendResponseHandler,
    PreparedPaymentMixin
  ],
  components: {
    Checkbox,
    PayNowButton,
    AsteriskRequired,
  },
  methods: {
    /**
     * @description provides the token for payment form, without this token the payment is not possible
     */
    async getPaymentIntentToken(): Promise<string> {
      await this.validateCanBuy();

      let paymentData = {
        "paymentTool"                : this.toolName,
        "productId"                  : this.productId,
        "currencyCode"               : this.targetCurrencyCode,
        "calculatedUnitPrice"        : this.priceWithoutTax,
        "calculatedUnitPriceWithTax" : this.priceWithTax,
        "quantity"                   : 1,
      };

      this.$rootEvent.showFullPageLoader();
      let calledUrl = SymfonyRoutes.buildUrl(SymfonyFinanceRoutes.PAYMENT_STRIPE_GET_PAYMENT_INTENT_TOKEN);
      return this.$axios.postWithCsrf(calledUrl, paymentData, false, {}, GetPaymentIntentResponse).then((response: GetPaymentIntentResponse) => {
        this.$rootEvent.hideFullPageLoader();

        if (!response.success) {
          this.handleFailedBackendResponse(response, calledUrl);
          throw new BaseError("Could not get payment intent token", {
            responseMessage: response.message,
            responseCode: response.code,
          })
        }

        return response.intentToken;
      })
    },
    /**
     * @description build the data bag that will be sent to the backend to
     *              handle the payment
     */
    buildRequestData(): Record<string | number, unknown> {
      return {
        "paymentTool"                : this.toolName,
        "productId"                  : this.productId,
        "currencyCode"               : this.targetCurrencyCode,
        "calculatedUnitPrice"        : this.priceWithoutTax,
        "calculatedUnitPriceWithTax" : this.priceWithTax,
        "quantity"                   : 1,
        "paymentToolData" : {
          "paymentToken": this.paymentIntentToken
        }
      };
    },
    /**
     * @description builds / configures / renders the payment form.
     *              Here is the place to include any configuration that is necessary,
     *              or to add any extra elements that are needed.
     */
    async buildForm(): Promise<void> {
      this.formElements = this.stripeInstance.elements({
        clientSecret: this.paymentIntentToken
      });

      const paymentElementOptions = {
        layout: "tabs",
      };

      const paymentElement = this.formElements.create("payment", paymentElementOptions);
      paymentElement.mount("#payment-element");
    },
    /**
     * @description triggered when user clicks on the "pay"
     */
    async handlePayment(): Promise<void> {

      if (!this.isConfirmedByUser) {
        return;
      }

      GlobalWebsocketActionExecutor.ping();
      if (systemDisabledStore().isDisabled) {
        this.$rootEvent.hideFullPageLoader();
        return;
      }

      this.$rootEvent.showFullPageLoader();
      await this.stripeInstance.confirmPayment({
        elements: this.formElements,
        redirect: 'if_required',
      }).then(async (response) => {
        if (!this.handleReturnUrlRequirement(response)) {
          return;
        }

        if (response.error) {
          this.$rootEvent.hideFullPageLoader();
          this.$rootEvent.showNotification(ToastTypeEnum.warning, response.error.message);
          return;
        }

        this.paymentToken
        let paymentDataBag = this.buildRequestData();
        await this.preparePayment(paymentDataBag);

        this.$rootEvent.showFullPageLoader();
        this.handlePaymentStatus(response);
        this.$rootEvent.hideFullPageLoader();
      }).catch((error) => {
        this.$rootEvent.hideFullPageLoader();

        let msg = `Got error in promise catch block while handling the payment. Msg: ${error.message}, type: ${error.type}`;
        throw new BaseError(msg);
      });

    },
    /**
     * @description this is special handling for payment methods that require `return_url`.
     *              These are such as for example PayPal. Stripe documentation is not listing
     *              anywhere which methods require `return_url` so in case any of the available
     *              one require it, then capturing such case and reporting it on backend.
     *              This way the payment method can be later turned off.
     *
     *              This could be implemented in future if needed, but for now it's just to much
     *              effort, so once that error is detected user will just get an info that
     *              "payment method is not supported".
     *
     * @return {boolean} where `false` means that url is required, and `true` indicates that everything is ok
     */
    handleReturnUrlRequirement(response): boolean {
      if (response?.error?.message?.includes("return_url")) {
        this.$rootEvent.hideFullPageLoader();

        let msg = this.$t('paymentProcess.message.methodNotSupported');
        this.$rootEvent.showNotification(ToastTypeEnum.warning, msg);
        BackendErrorStorageService.storeData({
          msg: msg,
          error: response?.error?.message,
          paymentIntentId: response?.error?.payment_intent?.id,
        })
        return false;
      }

      return true;
    },
    /**
     * @description process the payment based on the stripe response
     */
    async handlePaymentStatus(response) {
      let paymentIntent = response.paymentIntent;
      if (!paymentIntent) {
        let msg = "Payment intent was not returned with Stripe response!";
        Logger.error(msg);
        throw new BaseError(msg);
      }

      let paymentDataBag = this.buildRequestData();
      switch (paymentIntent.status) {
        case "succeeded":
        case "processing":
          this.finishPreparedPayment(paymentDataBag);
          break;
        case "canceled":
          this.cancelPreparedPayment();
          break;
        default:
          Logger.error("Payment error", {data: response});
          let flatResponse = JSON.stringify(response);
          this.handlePaymentError(flatResponse);
          this.$rootEvent.showNotification(ToastTypeEnum.warning, this.$t("paymentProcess.message.couldNotHandleThePayment"));
          break;
      }
    }
  },
  async mounted() {
    this.$rootEvent.showFullPageLoader();

    this.stripeInstance     = await loadStripe(this.stripeKey);
    this.paymentIntentToken = await this.getPaymentIntentToken();

    this.$rootEvent.hideFullPageLoader();
    await this.buildForm();
  },
}
</script>

<style lang="scss">
.card-data-wrapper {
  .card {
    &::after {
      // hide weird black hard behind modal
      @apply content-none
    }
    @apply w-full sm:w-96
  }

  @apply flex flex-col justify-center
}

.card-elements-wrapper {
  @apply max-w-md w-full self-center
}

.pay-now-button {
  @apply self-center mt-6 mb-6
}
</style>
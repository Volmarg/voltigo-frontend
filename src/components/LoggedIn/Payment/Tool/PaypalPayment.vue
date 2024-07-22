<template>
  <div class="block sm:grid sm:grid-cols-3">
    <div id="paypal-button" />
  </div>
</template>

<script lang="ts">

import { loadScript }                     from "@paypal/paypal-js";
import EnvReader                          from "@/scripts/Core/System/EnvReader";
import {ToastTypeEnum}                    from "@/scripts/Libs/ToastNotification";
import BackendErrorStorageService         from "@/scripts/Core/Services/Storage/BackendErrorStorageService";
import UserController                     from "@/scripts/Core/Controller/UserController";

import MaxAllowedPaymentDataMixin   from "@/mixins/System/Restriction/MaxAllowedPaymentDataMixin.vue";
import PreparedPaymentMixin         from "@/mixins/Payment/PreparedPaymentMixin.vue";

import GlobalWebsocketActionExecutor from "@/scripts/Core/Services/Websocket/ActionExecutor/GlobalWebsocketActionExecutor";
import {systemDisabledStore}         from "@/scripts/Vue/Store/SystemDisabledState";

export default {
  data() {
    return {
      response: {
        error: {
          partial: {
            currencyNotSupported: "CURRENCY_NOT_SUPPORTED",
            decimalsNotSupported: "DECIMALS_NOT_SUPPORTED"
          }
        }
      },
      toolName: "PAYPAL",
      paypal: {
        clientId: EnvReader.getPayPalClientId(),
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
    PreparedPaymentMixin,
  ],
  computed: {
    /**
     * Options set upon loading the PayPal checkout panel
     * {@link https://developer.paypal.com/sdk/js/configuration/}
     */
    loadedScriptOptions(): Record<string, unknown> {
      return {
        "client-id": this.paypal.clientId,
        "currency": this.targetCurrencyCode
      };
    },
    /**
     * Events handlers for the PayPal buttons
     * {@link https://developer.paypal.com/sdk/js/reference/#onapprove}
     */
    buttonsEvents(): Record<string, CallableFunction> {
      return {
        createOrder: async (data, actions) => {
          await this.validateCanBuy();

          GlobalWebsocketActionExecutor.ping()
          if (systemDisabledStore().isDisabled) {
            return;
          }

          /**
           * For tracking on PayPal side in case transaction fails getting saved on backend
           * Min 1 character, max 127
           * This is visible as "Note" int the payment details for the Business account
           */
          let descriptionEntries = [
            `User.id: ${(new UserController()).getLoggedInUserData().userId}`,
            `Product.id: ${this.productId}`,
            `Currency: ${this.targetCurrencyCode}`,
            `PriceWithTax: ${this.priceWithTax}`,
          ];

          /**
           * @description it's needed this way, else PayPal receives also the spaces/tabs used for formatting the entry
           *              when it's a string and has indentations on left (to make it look fine in-code).
           */
          let productDescription = descriptionEntries.join(", ");
          let requestData        = this.buildPaymentRequestData();

          await this.preparePayment(requestData);
          if (!this.preparedOrderId) {
            return;
          }

          // Set up the transaction
          let orderPromise = await actions.order.create({
            /** @link https://developer.paypal.com/docs/api/orders/v2/#definition-purchase_unit */
            purchase_units: [{
              amount: {
                value: this.priceWithTax
              },
              description: productDescription
            }]
          });

          let paymentId: string = await orderPromise;
          await this.updateToolDataForPreparedOrder({
            paymentId: paymentId,
          });

          return orderPromise;
        },
        /**
         * @description triggered when the payment has been confirmed and approved
         *              The returned response data will be stored on backend.
         *
         *              Request data is not getting saved in DB on purpose due to the fact that it contains
         *              way to sensitive data like card number, ccv etc. this is just a no, because
         *              it's literally asking for troubles if these leak out
         */
        onApprove: (data, actions) => {
          return actions.order.capture().then(() => {
            let dataBag = this.buildPaymentRequestData();
            this.finishPreparedPayment(dataBag);
          });
        },
        /**
         * @description will cancel the prepared order
         */
        onCancel: () => {
          this.cancelPreparedPayment();
        },
        /**
         * @description contains information about error when for some reason the payment could not be handled
         *              it's not fully known when this happens and how to handle it so at least showing some error
         *              message and sending the error data on backend
         *
         *              [Simulating]
         *              None of these work:
         *              - https://developer.paypal.com/api/rest/sandbox/card-testing/#link-rejectiontriggers,
         *              - setting payment value equal to expected error code,
         *
         *              [Works]
         *              - using unsupported currency (in 2024 it's VND),
         */
        onError: (error) => {

          this.handlePaymentError(error.message);
          this.$rootEvent.hideFullPageLoader();

          // tried with "includes" but that is not working, dunno why
          if (
                  -1 !== String(error.message).indexOf(this.response.error.partial.currencyNotSupported)
              /**
               * @description that's lazy solution, but I just don't care about all the decimals etc. on front
               *              this will force user to select other currency
              */
              ||  -1 !== String(error.message).indexOf(this.response.error.partial.decimalsNotSupported)
          ) {
            this.$rootEvent.showNotification(ToastTypeEnum.info, this.$t('paymentProcess.message.currencyNotSupported'));
            return;
          }

          this.$rootEvent.showNotification(ToastTypeEnum.warning, this.$t("paymentProcess.message.couldNotHandleThePayment"));

        },
      }
    }
  },
  methods: {
    /**
     * @description data sent to backend for handling the whole payment process
     *              Not all the data is getting sent, because even if the frontend response is "SUCCESS"
     *              then it's just frontend, so it cannot be trusted, thus real status will be obtained
     *              on backend
     */
    buildPaymentRequestData(): Record<string, string | number | Record<string, string | number>> {
      return {
        "paymentTool"                : this.toolName,
        "productId"                  : this.productId,
        "currencyCode"               : this.targetCurrencyCode,
        "calculatedUnitPrice"        : this.priceWithoutTax,
        "calculatedUnitPriceWithTax" : this.priceWithTax,
        "quantity"                   : 1,
      };
    },
  },
  mounted() {
    loadScript(this.loadedScriptOptions)
        .then((paypal) => {
          this.$rootEvent.hideFullPageLoader();

          // @ts-ignore
          paypal
              .Buttons(this.buttonsEvents)
              .render("#paypal-button")
              .catch((error) => {
                BackendErrorStorageService.storeData({
                  "message": "Failed to render the PayPal Buttons",
                  error: error
                });
              });
        })
        .catch((error) => {
          this.$rootEvent.hideFullPageLoader();
          BackendErrorStorageService.storeData({
            "message": "Failed to load the PayPal JS SDK script",
            error: error
          });
        });
  }
}
</script>

<style lang="scss" scoped>
#paypal-button {
  @apply col-start-2 col-end-2
}
</style>
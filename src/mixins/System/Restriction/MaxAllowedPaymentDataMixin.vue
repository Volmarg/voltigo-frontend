<script lang="ts">
import SymfonySystemRoutes   from "@/router/SymfonyRoutes/SymfonySystemRoutes";
import SymfonyRoutes         from "@/router/SymfonyRoutes";

import ExchangeRateMixin from "@/mixins/Finances/Currency/ExchangeRateMixin.vue";

import GetMaxAllowedPaymentDataResponse from "@/scripts/Response/System/Restriction/GetMaxAllowedPaymentDataResponse";

import {ToastTypeEnum} from "@/scripts/Libs/ToastNotification";
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import BaseError       from "@/scripts/Core/Error/BaseError";
import UserController  from "@/scripts/Core/Controller/UserController";
import PromiseService  from "@/scripts/Core/Services/Promise/PromiseService";

export default {
  data(): ComponentData {
    return {
      paymentRestriction: {
        max: {
          unit: null,
          currency: null
        }
      },
    }
  },
  mixins: [
    ExchangeRateMixin,
  ],
  methods: {
    /**
     * @description will return the response that contains payments restrictions data
     */
    async getPaymentRestrictionData(): Promise<GetMaxAllowedPaymentDataResponse> {
      let calledRoute = SymfonyRoutes.buildUrl(SymfonySystemRoutes.GET_MAX_ALLOWED_PAYMENT_DATA);
      return await this.$axios.getWithCsrf(calledRoute, GetMaxAllowedPaymentDataResponse).then((response: GetMaxAllowedPaymentDataResponse) => {
        return response;
      });

    },
    /**
     * @description check if user can buy product:
     *              - checking if the billed price won't be higher than system based restrictions
     */
    async validateCanBuy(): Promise<void> {
      let exchangeRate = 1;

      await PromiseService.buildPeriodicallyCheckedPromise(() => {
        return (null !== this.paymentRestriction.max.currency);
      });

      if (this.targetCurrencyCode !== this.paymentRestriction.max.currency) {
        exchangeRate = await this.getExchangeRate(this.targetCurrencyCode, this.paymentRestriction.max.currency);
      }

      let targetPrice = this.priceWithTax * exchangeRate;
      if (targetPrice > this.paymentRestriction.max.unit) {
        let notificationMsg = this.$t('system.restriction.payment.orderExceedsMax', {
          userPayment          : `${this.priceWithTax} ${this.targetCurrencyCode}`,
          userPaymentConverted : `${targetPrice.toFixed(2)} ${this.paymentRestriction.max.currency}`,
          maxPayment           : `${this.paymentRestriction.max.unit} ${this.paymentRestriction.max.currency}`,
        });

        this.$rootEvent.showNotification(ToastTypeEnum.warning, notificationMsg);
        throw new BaseError("Tried to order product for more than current allowed max system-wide value", {
          'userId'    : (new UserController()).getLoggedInUserData().userId,
          'productId' : this.productId,
          'currency'  : this.targetCurrencyCode,
          'price'     : this.priceWithTax,
        });
      }
    },
  },
  async created(): Promise<void> {
    let response = await this.getPaymentRestrictionData();
    this.paymentRestriction.max.unit     = response.unit;
    this.paymentRestriction.max.currency = response.currency;
  },
}
</script>

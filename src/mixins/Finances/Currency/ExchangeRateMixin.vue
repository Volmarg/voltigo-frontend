<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import SymfonyRoutes           from "@/router/SymfonyRoutes";
import SymfonyFinanceRoutes    from "@/router/SymfonyRoutes/SymfonyFinanceRoutes";
import GetExchangeRateResponse from "@/scripts/Response/Currency/GetExchangeRateResponse";

export default {
  data(): ComponentData {
    return {
      exchangeRate: null as null | number,
    }
  },
  methods: {
    /**
     * @description calls backend to get the exchange rate between 2 currencies
     */
    async getExchangeRate(fromCurrency: string, targetCurrency: string): Promise<number> {
      let calledUrl = SymfonyRoutes.buildUrl(
          SymfonyFinanceRoutes.GET_CURRENCY_EXCHANGE_RATE, {
            [SymfonyFinanceRoutes.GET_CURRENCY_EXCHANGE_RATE_PARAM_FROM_CURRENCY]: fromCurrency,
            [SymfonyFinanceRoutes.GET_CURRENCY_EXCHANGE_RATE_PARAM_TARGET_CURRENCY]: targetCurrency,
          }
      )

      this.$rootEvent.showFullPageLoader();
      return this.$axios.getWithCsrf(calledUrl, GetExchangeRateResponse).then ( (response: GetExchangeRateResponse) => {
        this.$rootEvent.hideFullPageLoader();

        this.exchangeRate = response.exchangeRate;

        return response.exchangeRate;
      })
    }
  }
}
</script>
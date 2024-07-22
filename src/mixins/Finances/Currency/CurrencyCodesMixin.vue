<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import SymfonyRoutes               from "@/router/SymfonyRoutes";
import SymfonyFinanceRoutes        from "@/router/SymfonyRoutes/SymfonyFinanceRoutes";
import GetAllCurrencyCodesResponse from "@/scripts/Response/Currency/GetAllCurrencyCodesResponse";

export default {
  data(): ComponentData {
    return {
      currencyCodes: [] as Array<string>,
    }
  },
  methods: {
    /**
     * @description calls backend to get all the currency codes
     */
    async getAllCurrencyCodes(): Promise<number> {
      let calledUrl = SymfonyRoutes.buildUrl(SymfonyFinanceRoutes.GET_ALL_CURRENCY_CODES)

      this.$rootEvent.showFullPageLoader();
      return this.$axios.getWithCsrf(calledUrl, GetAllCurrencyCodesResponse).then( (response: GetAllCurrencyCodesResponse) => {
        this.$rootEvent.hideFullPageLoader();

        this.currencyCodes = response.currencyCodes;

        return response.currencyCodes;
      })
    }
  }
}
</script>
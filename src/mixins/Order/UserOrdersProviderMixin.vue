<script lang="ts">
import BaseError             from "@/scripts/Core/Error/BaseError";
import SymfonyRoutes         from "@/router/SymfonyRoutes";
import SymfonyOrderRoutes    from "@/router/SymfonyRoutes/SymfonyOrderRoutes";
import GetOrdersDataResponse from "@/scripts/Response/Order/GetOrdersDataResponse";

import FailedBackendResponseHandler from "@/scripts/Vue/Mixins/FailedBackendResponseHandler.vue";
import {ComponentData}              from "@/scripts/Vue/Types/Components/types";

export default {
  data(): ComponentData {
    return {
      ordersData: null,
    }
  },
  mixins: [
    FailedBackendResponseHandler
  ],
  methods: {
    /**
     * @description will call backend to get the orders data
     */
    async getOrdersData(): Promise<void> {
      let calledUrl = SymfonyRoutes.buildUrl(SymfonyOrderRoutes.GET_ORDERS);

      this.$rootEvent.showFullPageLoader();
      return this.$axios.getWithCsrf(calledUrl, GetOrdersDataResponse).then( (response: GetOrdersDataResponse) => {
        this.$rootEvent.hideFullPageLoader();

        if (!this.handleFailedBackendResponse(response, calledUrl)) {
          throw new BaseError("Could not get orders data", {
            responseMessage: response.message,
            responseCode: response.code,
          })
        }

        this.ordersData = response.ordersData;
      })
    }
  }
}
</script>
<script lang="ts">
import BaseError                       from "@/scripts/Core/Error/BaseError";
import SymfonyRoutes                   from "@/router/SymfonyRoutes";
import SymfonyPointShopRoutes          from "@/router/SymfonyRoutes/SymfonyPointShopRoutes";
import GetFullPointShopHistoryResponse from "@/scripts/Response/PointShop/GetFullPointShopHistoryResponse";

import FailedBackendResponseHandler from "@/scripts/Vue/Mixins/FailedBackendResponseHandler.vue";

import {ComponentData}    from "@/scripts/Vue/Types/Components/types";
import {UserPointHistory} from "@/scripts/Response/PointShop/GetFullPointShopHistoryResponse";

export default {
  data(): ComponentData {
    return {
      historyEntries: [] as Array<UserPointHistory>,
    }
  },
  mixins: [
    FailedBackendResponseHandler
  ],
  methods: {
    /**
     * @description will call backend to get all point shop history entries
     */
    async getAllPointShopHistoryEntries(): Promise<void> {
      let calledUrl = SymfonyRoutes.buildUrl(SymfonyPointShopRoutes.GET_ALL_POINT_SHOP_HISTORY_ENTRIES);

      this.$rootEvent.showFullPageLoader();
      return this.$axios.getWithCsrf(calledUrl, GetFullPointShopHistoryResponse).then( (response: GetFullPointShopHistoryResponse) => {
        this.$rootEvent.hideFullPageLoader();

        if (!this.handleFailedBackendResponse(response, calledUrl)) {
          throw new BaseError("Could not get point shop history entries", {
            responseMessage: response.message,
            responseCode: response.code,
          })
        }

        this.historyEntries = response.historyEntries;
      })
    }
  }
}
</script>
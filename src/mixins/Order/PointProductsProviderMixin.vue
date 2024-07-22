<script lang="ts">
import BaseError                      from "@/scripts/Core/Error/BaseError";
import SymfonyRoutes                  from "@/router/SymfonyRoutes";
import SymfonyProductRoutes           from "@/router/SymfonyRoutes/SymfonyProductRoutes";
import GetAllPointProductDataResponse from "@/scripts/Response/Product/GetAllPointProductDataResponse";

import FailedBackendResponseHandler from "@/scripts/Vue/Mixins/FailedBackendResponseHandler.vue";

import {ComponentData}    from "@/scripts/Vue/Types/Components/types";
import {PointProductData} from "@/scripts/Response/Product/GetAllPointProductDataResponse";

export default {
  data(): ComponentData {
    return {
      pointProductsData: [] as Array<PointProductData>,
      blockedProductIds: [] as Array<number>,
    }
  },
  mixins: [
    FailedBackendResponseHandler
  ],
  methods: {
    /**
     * @description will call backend to get all available point products data
     */
    async getAllPointProducts(): Promise<void> {
      let calledUrl = SymfonyRoutes.buildUrl(SymfonyProductRoutes.GET_ALL_AVAILABLE_POINT_PRODUCTS);

      this.$rootEvent.showFullPageLoader();
      return this.$axios.getWithCsrf(calledUrl, GetAllPointProductDataResponse).then( (response: GetAllPointProductDataResponse) => {
        this.$rootEvent.hideFullPageLoader();

        if (!this.handleFailedBackendResponse(response, calledUrl)) {
          throw new BaseError("Could not get point products data", {
            responseMessage: response.message,
            responseCode: response.code,
          })
        }

        this.pointProductsData = response.productsData;
        this.blockedProductIds = response.blockedProductIds;
      })
    }
  }
}
</script>
<script lang="ts">
import BaseError            from "@/scripts/Core/Error/BaseError";
import EnvReader            from "@/scripts/Core/System/EnvReader";
import SymfonyRoutes        from "@/router/SymfonyRoutes";
import SymfonyInvoiceRoutes from "@/router/SymfonyRoutes/SymfonyInvoiceRoutes";
import GetInvoiceResponse   from "@/scripts/Response/Invoice/GetInvoiceResponse";

import FailedBackendResponseHandler from "@/scripts/Vue/Mixins/FailedBackendResponseHandler.vue";
import {ComponentData}              from "@/scripts/Vue/Types/Components/types";

export default {
  data(): ComponentData {
    return {
      invoiceDownloadPath: null,
    }
  },
  mixins: [
    FailedBackendResponseHandler
  ],
  methods: {
    /**
     * @description will call backend to get the invoice file path
     */
    async getInvoiceDownloadPath(orderId: number): Promise<string> {
      let calledUrl = SymfonyRoutes.buildUrl(
          SymfonyInvoiceRoutes.GET_INVOICE_PDF_PATH_IN_PUBLIC, {
            [SymfonyInvoiceRoutes.GET_INVOICE_PDF_PATH_IN_PUBLIC_PARAM_ID]: orderId,
      });

      this.$rootEvent.showFullPageLoader();
      return this.$axios.getWithCsrf(calledUrl, GetInvoiceResponse).then( (response: GetInvoiceResponse) => {
        this.$rootEvent.hideFullPageLoader();

        if (!this.handleFailedBackendResponse(response, calledUrl)) {
          throw new BaseError("Could not get invoice pdf path", {
            responseMessage: response.message,
            responseCode: response.code,
            orderId: orderId,
          })
        }

        this.invoiceDownloadPath = EnvReader.getBackendBaseUrl() + response.invoicePathInPublic;
        return this.invoiceDownloadPath;
      })
    }
  }
}
</script>
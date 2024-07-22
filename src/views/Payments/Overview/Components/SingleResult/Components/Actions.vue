<template>
  <div class="justify-start flex flex-row hover:opacity-50 cursor-pointer">

    <a class="align-self-center hover:opacity-50 cursor-pointer w-full sm:w-auto"
       @click.prevent="downloadInvoice"
       target="_blank"
    >
      <MediumButtonWithIcon :text="$t('orderPaymentsOverview.singleEntry.actions.invoice.label')"
                            button-classes="w-full sm:w-auto flex justify-center"
      >
        <template #icon>
          <fa icon="file-pdf"
              :class="{
                'text-lg': isPhoneBreakingPoint
              }"
          />
        </template>
      </MediumButtonWithIcon>
    </a>
  </div>
</template>

<script lang="ts">
import {OrderData}         from "@/scripts/Response/Order/GetOrdersDataResponse";
import PublicFolderService from "@/scripts/Core/Services/PublicFolder/PublicFolderService";

import InvoicePdfProviderMixin from "@/mixins/Invoice/InvoicePdfProviderMixin.vue";
import ResponsiveVarsMixin     from "@/mixins/Responsive/ResponsiveVarsMixin.vue";

import MediumButtonWithIcon from "@/components/Navigation/Button/MediumButtonWithIcon.vue";

export default {
  components: {
    MediumButtonWithIcon
  },
  props: {
    orderData: {
      type     : Object as unknown as OrderData,
      required : true,
    }
  },
  mixins: [
    ResponsiveVarsMixin,
    InvoicePdfProviderMixin
  ],
  methods: {
    /**
     * @description fetch invoice from the server, push it as the actual href in order to force browser to download
     */
    async downloadInvoice(): Promise<void> {
      await this.getInvoiceDownloadPath(this.orderData.id);
      location.href = PublicFolderService.buildPathWithToken(this.invoiceDownloadPath);
    }
  },
}
</script>
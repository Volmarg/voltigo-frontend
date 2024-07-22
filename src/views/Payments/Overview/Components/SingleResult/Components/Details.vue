<template>
  <div>
    <span class="data-chunk">
      <b> {{ $t('orderPaymentsOverview.singleEntry.totalWithoutTax.label')}}: </b>
      {{ orderData.totalWithoutTax }} {{ currencyCode }}
    </span>
    <span class="data-chunk">
      <b> {{ $t('orderPaymentsOverview.singleEntry.totalWithTax.label')}}: </b>
      {{ orderData.totalWithTax }} {{ currencyCode }}
    </span>
    <span class="data-chunk">
      <b> {{ $t('orderPaymentsOverview.singleEntry.products.label')}}: </b>
      <span v-for="productInfo of orderData.productsData">
        {{ productInfo }},
      </span>
    </span>
    <span class="data-chunk">
      <b> {{ $t('orderPaymentsOverview.singleEntry.created.label')}}: </b>
      {{ orderData.created }}
    </span>

  </div>
</template>

<script lang="ts">
import {OrderData} from "@/scripts/Response/Order/GetOrdersDataResponse";

export default {
  props: {
    /** @var {OrderData} */
    orderData: {
      type     : Object as unknown as OrderData,
      required : true,
    }
  },
  computed: {
    /**
     * @description provides the payment currency code
     */
    currencyCode(): string {
      return this.orderData.targetCurrencyCode.toUpperCase();
    }
  }
}
</script>

<style lang="scss" scoped>
.data-chunk {
  display: block;
  text-align: left;
}
</style>

<template>
  <div>
    <span class="data-chunk">
      <b> {{ $t('foundsModal.products.price.label')}}: </b>
      <span class="price-info">
        {{ priceWithoutTax }} {{ currencyCode }}
        ({{ $t('foundsModal.products.includingTax.label') }} {{ priceWithTax }} {{ currencyCode }})
      </span>
    </span>

    <span class="data-chunk">
      <b> {{ $t('foundsModal.products.description.label')}}: </b>
      {{ pointProduct.description }}
    </span>

  </div>
</template>

<script lang="ts">
import {PointProductData} from "@/scripts/Response/Product/GetAllPointProductDataResponse";

import MathService from "@/scripts/Core/Services/Math/MathService";

export default {
  props: {
    exchangeRate: {
      type: [Number, null],
      required: true,
    },
    pointProduct: {
      type: Object as unknown as PointProductData,
      required: true,
    },
    targetCurrency: {
      type: String,
      required: false,
      default: null,
    }
  },
  emits: [
    "usedCurrencyCodeChanged",
    "usedPriceWithTaxChanged",
    "usedPriceWithoutTaxChanged"
  ],
  computed: {
    /**
     * @description used currency code
     */
    currencyCode(): string {
      if (this.targetCurrency && this.exchangeRate) {
        this.$emit('usedCurrencyCodeChanged', {currency: this.targetCurrency});
        return this.targetCurrency;
      }

      this.$emit('usedCurrencyCodeChanged', {currency: this.pointProduct.currencyCode});
      return this.pointProduct.currencyCode;
    },
    /**
     * @description used price with tax
     */
    priceWithTax(): number {
      return 0; // open source
      if (this.targetCurrency && this.exchangeRate) {
        let price = MathService.round(this.pointProduct.priceWithTax * this.exchangeRate, 2);

        this.$emit('usedPriceWithTaxChanged', {price: price});
        return price;
      }

      this.$emit('usedPriceWithTaxChanged', {price: this.pointProduct.priceWithTax});
      return this.pointProduct.priceWithTax;
    },
    /**
     * @description used price without tax
     */
    priceWithoutTax(): number {
      return 0; // open source
      if (this.targetCurrency && this.exchangeRate) {

        let price = MathService.round(this.pointProduct.priceWithoutTax * this.exchangeRate,2);
        this.$emit('usedPriceWithoutTaxChanged', {price: price});
        return price;
      }

      this.$emit('usedPriceWithoutTaxChanged', {price: this.pointProduct.priceWithoutTax});
      return this.pointProduct.priceWithoutTax;
    }
  },
}
</script>

<style lang="scss" scoped>
.data-chunk {
  display: block;
  text-align: left;
}
</style>

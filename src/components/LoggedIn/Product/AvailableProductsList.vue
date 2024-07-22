<template>
  <div>
    <PointProduct
        v-for="productData in visiblePointProducts"
        :blocked-product-ids="blockedProductIds"
        :key="JSON.stringify(productData)"
        :exchange-rate="exchangeRate"
        :product-data="productData"
        :target-currency="targetCurrency"
        @product-clicked="$emit('productSelected', $event)"
    />

    <Pagination :number-of-results="pointProductsData.length"
                :initial-count-of-result-per-page="config.pagination.resultPerPage"
                :initial-current-page="config.pagination.currentPage"
                @page-number-changes="onPaginationChange"/>

  </div>
</template>

<script lang="ts">
import PaginationMixin            from "@/scripts/Vue/Mixins/Ui/PaginationMixin.vue";
import ExchangeRateMixin          from "@/mixins/Finances/Currency/ExchangeRateMixin.vue";
import PointProductsProviderMixin from "@/mixins/Order/PointProductsProviderMixin.vue";

import Pagination   from "@/components/Ui/Pagination.vue";
import PointProduct from "@/components/LoggedIn/Product/PointProduct/PointProduct.vue";

import {UserStateStore, userStateStore} from "@/scripts/Vue/Store/UserState";

import {ComponentData}    from "@/scripts/Vue/Types/Components/types";
import {PointProductData} from "@/scripts/Response/Product/GetAllPointProductDataResponse";

type ExchangeRate = {
  fromCurrency: string,
  toCurrency: string,
  rate: number
};

export default {
  data(): ComponentData {
    return {
      userStateStore: null as null | UserStateStore,
      exchangeRate: this.defaultExchangeRate,
      defaultExchangeRate: 1,
      currencyExchangeRates: [] as Array<ExchangeRate>,
      visiblePointProducts: [] as Array<PointProductData>,
      config: {
        pagination: {
          resultPerPage : 3,
          currentPage   : 1,
        }
      },
    }
  },
  props: {
    targetCurrency: {
      type: [String, null],
      required: false,
      default: null,
    }
  },
  mixins: [
    PaginationMixin,
    ExchangeRateMixin,
    PointProductsProviderMixin,
  ],
  emits: [
    'productSelected'
  ],
  components: {
    PointProduct,
    Pagination
  },
  methods: {
    /**
     * @description returns the exchange rate used for products data and the user selected currency
     *              this is based on the fact that all the products got the same BASE currency code,
     *              so the exchange rate will be the same for all products, what matters in fact is
     *              the selected currency.
     */
    async getUsedExchangeRate(): Promise<void> {
      if (this.pointProductsData.length === 0 || this.targetCurrency === null) {
        this.exchangeRate = this.defaultExchangeRate;
        return;
      }

      for (let fetchedRate of this.currencyExchangeRates) {
        if (fetchedRate.toCurrency === this.targetCurrency) {
          this.exchangeRate = fetchedRate.rate;
          return;
        }
      }

      let firstProductData = this.pointProductsData[0];

      let rate = await this.getExchangeRate(firstProductData.currencyCode, this.targetCurrency);
      this.currencyExchangeRates.push({
        fromCurrency: firstProductData.currencyCode,
        toCurrency: this.targetCurrency,
        rate: rate
      })

      this.exchangeRate = rate;
      return;
    },
    /**
     * @description will handle the event when page number changes on pagination
     */
    onPaginationChange(currentPage: number, countOfResultsPerPage: number): void {
      this.config.pagination.currentPage = currentPage;
      this.visiblePointProducts          = this.filterShownResultByPagination(currentPage, countOfResultsPerPage, this.pointProductsData);
    },
  },
  async mounted(): Promise<void> {
    this.userStateStore = userStateStore();
    this.userStateStore.loadUserData();

    await this.getAllPointProducts();
    this.visiblePointProducts = this.filterShownResultByPagination(this.config.pagination.currentPage, this.config.pagination.resultPerPage, this.pointProductsData);
  },
  watch: {
    async targetCurrency(): Promise<void> {
      await this.getUsedExchangeRate();
    },
    /**
     * @description user points changed, so need to fetch the products since backend also decide which one are blocked from ordering
     */
    'userStateStore.user.points'() {
      this.visiblePointProducts = this.filterShownResultByPagination(this.config.pagination.currentPage, this.config.pagination.resultPerPage, this.pointProductsData);
    }
  }
}
</script>

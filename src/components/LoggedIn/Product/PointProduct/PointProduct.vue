<template>
  <!-- Event must be emitted here, because the :before & :after css pseudo-elements on `Details` are breaking click handling -->
  <div
      @click="onProductClick"
      class="point-product"
      v-tippy="{
        content   : isProductBlocked ? $t('foundsModal.products.messages.disabled.label') : $t('foundsModal.products.messages.buy.label'),
        placement : 'top'
      }"
      :class="{
        'hover:opacity-90 cursor-pointer'    : !isProductBlocked,
        'cursor-not-allowed blocked-product' : isProductBlocked,
      }"
  >
    <!-- tab -->
    <div
        class="w-full flex items-center justify-start p-4 bg-transparent shadow mb-3 bg-white text-gray-500 text-2md"
        :class="{
          'styled-border'         : !isProductBlocked,
          'styled-border-blocked' : isProductBlocked
        }"
    >
      <!-- tab content -->
      <div class="flex justify-start data-wrapper w-full">
        <div class="grid grid-rows-1 grid-cols-3 gap-2 main-grid-wrapper w-full">
          <Icon :is-product-blocked="isProductBlocked" />

          <div class="grid grid-rows-1 grid-cols-1 gap-2 col-span-2">
            <Name
                :text="productData.name"
                :is-product-blocked="isProductBlocked"
            />
            <Details
                :exchange-rate="exchangeRate"
                :point-product="productData"
                :target-currency="targetCurrency"
                @usedCurrencyCodeChanged="usedCurrencyCode = $event.currency"
                @usedPriceWithTaxChanged="usedPriceWithTax = $event.price"
                @usedPriceWithoutTaxChanged="usedPriceWithoutTax = $event.price"
            />
          </div>

        </div>
      </div>


    </div>

  </div>
</template>

<script lang="ts">

import Icon    from "@/components/LoggedIn/Product/PointProduct/Components/Icon.vue";
import Name    from "@/components/LoggedIn/Product/PointProduct/Components/Name.vue";
import Details from "@/components/LoggedIn/Product/PointProduct/Components/Details.vue";


import {PointProductData} from "@/scripts/Response/Product/GetAllPointProductDataResponse";
import {ComponentData}    from "@/scripts/Vue/Types/Components/types";

export default {
  data(): ComponentData {
    return {
      usedCurrencyCode: this.producData?.currencyCode,
      usedPriceWithTax: this.producData?.priceWithTax,
      usedPriceWithoutTax: this.producData?.priceWithoutTax,
    }
  },
  props: {
    exchangeRate: {
      type: [Number, null],
      required: true,
    },
    productData: {
      type     : Object as unknown as PointProductData,
      required : true,
    },
    blockedProductIds: {
      type: Array,
      required: false,
      default: () => [],
    },
    targetCurrency: {
      type: String,
      required: false,
      default: null,
    }
  },
  emits: [
    'productClicked'
  ],
  components: {
    Icon,
    Name,
    Details,
  },
  computed: {
    /**
     * @description check if product is blocked for some reason
     */
    isProductBlocked(): boolean {
      return this.blockedProductIds.includes(this.productData.id);
    }
  },
  methods: {
    /**
     * @description handles product click, emits event with data
     */
    onProductClick(): void {
      if (this.isProductBlocked) {
        return;
      }

      this.$emit('productClicked', {
        productData        : this.productData,
        usedCurrencyCode   : this.usedCurrencyCode,
        usedPriceWithTax   : this.usedPriceWithTax,
        usedPriceWithoutTax: this.usedPriceWithoutTax,
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.orange {
  border-color: orange
}

.main-grid-wrapper {
  grid-template-columns: 70px 1fr 1fr;
}

.styled-border {
  @apply  border-l-4 border-current p-4 border-blue-500
}

.styled-border-blocked {
  @extend .styled-border;
  @apply border-gray-500
}

.point-product:not(.blocked-product) {
  position: relative;
  &:hover:before {
    content: '';
    vertical-align: center;
    background-color: rgba(255, 255, 255, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &:hover:after {
    content: url('data:image/svg+xml,<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="50.000000pt" height="50.000000pt" viewBox="0 0 238.000000 211.000000" preserveAspectRatio="xMidYMid meet"> <metadata> Created by potrace 1.16, written by Peter Selinger 2001-2019 </metadata> <g transform="translate(0.000000,211.000000) scale(0.100000,-0.100000)" fill="rgba(0,0,0,0.25)" stroke="none"> <path d="M174 2038 c-38 -18 -55 -79 -34 -118 18 -33 51 -43 164 -49 l110 -6 33 -175 c19 -96 49 -258 69 -360 113 -597 115 -601 198 -665 72 -55 65 -54 694 -55 l583 0 24 25 c35 34 34 93 -1 126 l-26 24 -577 5 c-461 4 -581 8 -594 18 -18 15 -32 56 -42 119 l-7 42 574 3 c639 3 605 0 688 75 24 21 51 56 61 78 24 55 189 677 189 714 0 43 -9 60 -41 76 -61 32 -111 3 -133 -78 -8 -29 -51 -185 -96 -347 -67 -246 -85 -299 -106 -318 l-25 -22 -569 0 c-313 0 -571 4 -574 9 -5 7 -25 108 -115 587 -38 199 -66 252 -153 289 -44 18 -259 20 -294 3z"/> <path d="M1282 1953 c-27 -11 -42 -62 -42 -148 l0 -85 -91 0 c-87 0 -92 -1 -120 -29 -36 -37 -38 -79 -5 -118 23 -26 29 -28 120 -31 l96 -4 0 -88 c0 -78 3 -92 23 -115 30 -35 88 -37 122 -5 22 20 25 33 27 114 l3 91 90 5 c93 6 128 17 139 46 12 31 6 82 -13 105 -17 21 -29 24 -118 29 l-98 5 -5 98 c-4 89 -7 101 -29 118 -22 18 -70 24 -99 12z"/> <path d="M710 468 c-132 -68 -132 -248 0 -316 118 -61 250 23 250 158 0 135 -132 219 -250 158z"/> <path d="M1782 469 c-59 -30 -85 -70 -90 -141 -5 -70 9 -108 54 -148 116 -101 293 -20 294 135 0 128 -142 213 -258 154z"/> </g> </svg>');
    position: absolute;
    top: 25%;
    left: 50%;
    font-size: 45px;
  }

}

.blocked-product {
  @apply opacity-60
}

</style>
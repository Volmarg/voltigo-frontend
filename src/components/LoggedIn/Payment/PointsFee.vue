<template>
  <div v-if="count">
    <Layout
        :amount="fee"
        :is-missing-points="isMissingPoints"
        :missing-amount="missingAmount"
        :about-text="aboutText"
        @gem-clicked="onGemClicked"
        :is-gem-clickable="true"
    />
  </div>
</template>

<script lang="ts">

import {UserStateStore, userStateStore} from "@/scripts/Vue/Store/UserState";
import FailedBackendResponseHandler     from "@/scripts/Vue/Mixins/FailedBackendResponseHandler.vue";

import Layout from "@/components/LoggedIn/Payment/PointsFee/Layout.vue";

import {ComponentData}  from "@/scripts/Vue/Types/Components/types";
import PointShopProduct from "@/scripts/Entity/PointShop/PointShopProduct";

import GetPointShopProductResponse from "@/scripts/Response/PointShop/GetPointShopProductResponse";

import BaseError from "@/scripts/Core/Error/BaseError";

export default {
  data(): ComponentData {
    return {
      userStateStore: null as null | UserStateStore,
      product: null as null | PointShopProduct,
    }
  },
  props: {
    count: {
      type: Number,
      required: true,
    },
    aboutText: {
      type: null, String,
      required: false,
      default: null,
    },
    productFetchUrl: {
      type: String,
      required: false,
    },
    productData: {
      type: [null, Object] as unknown as null | PointShopProduct,
      required: false,
    }
  },
  emits: [
    'missingPointsCheck',
    'failure',
  ],
  mixins: [
    FailedBackendResponseHandler,
  ],
  components: {
    Layout
  },
  computed: {
    /**
     * @description will calculate the total points based fee
     */
    fee(): number {
      if (!this.product) {
        return 0;
      }

      return this.product.cost * this.count;
    },
    /**
     * @description check if points are missing
     */
    isMissingPoints(): boolean {
      let isMissing = (this.missingAmount != 0);
      this.$emit('missingPointsCheck', {isMissingPoints: isMissing});
      return isMissing;
    },
    /**
     * @description calculate amount of missing points
     */
    missingAmount(): number {
      if (this.userStateStore && this.userStateStore.user.points < this.fee) {
        return (this.userStateStore.user.points - this.fee);
      }

      return 0;
    }
  },
  methods: {
    /**
     * @description will fetch the {@see PointShopProduct} used later to determine the "price" (base multiplied by count)
     */
    async getProductData(): Promise<void> {
      this.$rootEvent.showFullPageLoader();
      this.$axios.getWithCsrf(this.productFetchUrl, GetPointShopProductResponse).then( (response: GetPointShopProductResponse) => {

        if (!response.success) {
          this.handleFailedBackendResponse(response, this.productFetchUrl);
          this.$emit('failure');
          return;
        }

        this.$rootEvent.hideFullPageLoader();
        this.product = response.pointShopProduct;
      })
    },
    /**
     * @description handler when gem icon is clicked, will open the founds dialog
     */
    onGemClicked(): void {
      this.$root.$refs.appRouterView.$refs.topBarComponent.$refs.topNavbarFoundsStatus.$el.click();
    }
  },
  async created(): Promise<void> {
    if (!this.productFetchUrl && !this.productData) {
      throw new BaseError("Both fetch url and product data are empty! At least one of these must be set.");
    }

    if (this.productFetchUrl && this.productData) {
      throw new BaseError("You've provided both product data and fetch url, only one can be set at time!");
    }

    if (this.productFetchUrl) {
      await this.getProductData();
    } else {
      this.product = this.productData;
    }

    this.userStateStore = userStateStore();
    this.userStateStore.loadUserData()
  },
  watch: {
    /**
     * @description forces the product info fetch each time that url is changed via prop
     */
    async productFetchUrl(): Promise<void> {
      return this.getProductData();
    },
    productData: {
      deep: true,
      handler: function (): void {
        this.product = this.productData;
      }
    }
  }
}
</script>
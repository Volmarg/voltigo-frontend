<template>
  <div>
    <Modal :is-visible="showModal"
           :title="$t('foundsModal.state.header')"
           :size="modalSize"
           @modal-closed="$emit('modalClosed')"
           modal-main-wrapper-classes="z-40"
           backdrop-classes="z-30"
    >
      <template #content>

        <div class="flex justify-center text-lg flex-col sm:flex-row mb-8">
          <span>{{ $t('foundsModal.state.partials.currentBalance') }}:&nbsp;</span>

          <p class="flex justify-center sm:justify-start pt-1">
            <span class="text-blue-600 font-bold mr-1 flex flex-col md:block">
              <span>
                {{ userStateStore.user.points }}
              </span>
              <span v-if="!!userStateStore?.user?.pendingPoints">
                (<small>+{{ userStateStore?.user?.pendingPoints }} {{ $t('paymentProcess.message.foundsPending') }}</small>)
              </span>
            </span>

            <span class="font-bold mr-1"> /</span>

            <span class="font-bold mr-1 flex flex-col md:block">
              <span>{{ userStateStore.user.account.maxPointsAllowed }}</span>
              <small>(max.)</small>
            </span>

            <span class="currency-symbol text-blue-600 font-bold flex flex-col justify-center">
              <img src="/public/image/system/gem/gem-16.png" />
            </span>
          </p>
        </div>

        <AvailableProductsList
            @product-selected="grantPoints"
            :target-currency="targetCurrency"
        />

      </template>
    </Modal>

    <PaymentModal
        v-if="selectedProduct.data !== null"
        :is-visible="isPaymentModalVisible"
        :price-with-tax="usedPriceWithTax"
        :price-without-tax="usedPriceWithoutTax"
        :target-currency-code="usedCurrency"
        :product-id="selectedProduct.data.id"
        @modal-closed="isPaymentModalVisible = false"
        modal-main-wrapper-classes="z-60"
        backdrop-classes="z-50"
    />

  </div>
</template>

<script lang="ts">
import {UserStateStore, userStateStore} from "@/scripts/Vue/Store/UserState";

import BaseApiResponse   from "@/scripts/Response/BaseApiResponse";
import BrowserDetection  from "@/scripts/Core/Services/View/BrowserDetection";
import ToastNotification from "@/scripts/Libs/ToastNotification";

import AvailableProductsList      from "@/components/LoggedIn/Product/AvailableProductsList.vue";
import Modal                      from "@/components/Modal/Modal.vue";
import PaymentModal               from "@/components/LoggedIn/Payment/PaymentModal.vue";

import FailedBackendResponseHandler from "@/scripts/Vue/Mixins/FailedBackendResponseHandler.vue";
import ResponsiveModalSizeMixin     from "@/mixins/Responsive/ResponsiveModalSizeMixin.vue";

import {ComponentData}     from "@/scripts/Vue/Types/Components/types";
import {PointProductData}  from "@/scripts/Response/Product/GetAllPointProductDataResponse";
import SymfonyRoutes       from "@/router/SymfonyRoutes";
import SymfonyPointsRoutes from "@/router/SymfonyRoutes/SymfonyPointsRoutes";

import AuthenticatedUserWebsocketCallable from "@/scripts/Core/Services/Websocket/Callable/AuthenticatedUserWebsocketCallable";

export default {
  data(): ComponentData {
    return {
      isMobileBrowser: BrowserDetection.isMobileBrowser(),
      userStateStore: null as null | UserStateStore,
      targetCurrency: null,
      isPaymentModalVisible: false,
      selectedProduct: {
        data: null as null | PointProductData,
        usedPriceWithTax: null as null | number,
        usedPriceWithoutTax: null as null | number
      },
      remindPasswordEmail : "",
      showModal: false,
      violations          : {
        remindPasswordEmail: []
      }
    }
  },
  emits: [
    "modalClosed"
  ],
  props: {
    isModalVisible: {
      type     : Boolean,
      required : true,
      default  : false,
    }
  },
  components: {
    AvailableProductsList,
    PaymentModal,
    Modal
  },
  mixins: [
    ResponsiveModalSizeMixin,
    FailedBackendResponseHandler
  ],
  computed: {
    /**
     * @description decides which currency is currently taken for payment, the default one on product or user selected one
     */
    usedCurrency(): string {
      return this.selectedProduct.usedCurrencyCode ?? this.selectedProduct.data.currencyCode;
    },
    /**
     * @description decides which price without tax is currently taken for payment,
     *              the default one on product or the one based user selected currency
     */
    usedPriceWithoutTax(): number {
      return this.selectedProduct.usedPriceWithoutTax ?? this.selectedProduct.data.priceWithoutTax;
    },
    /**
     * @description decides which price with tax is currently taken for payment,
     *              the default one on product or the one based user selected currency
     */
    usedPriceWithTax(): number {
      return this.selectedProduct.usedPriceWithTax ?? this.selectedProduct.data.priceWithTax;
    },
  },
  methods: {
    /**
     * @description will grant points to user, without calling any ordering process, transaction etc.
     *              it's just simple "on click - grant points", some rules still apply (like max points allowed),
     */
    grantPoints(data: Record<string, string | number>): void {
      let url = SymfonyRoutes.buildUrl(SymfonyPointsRoutes.GRANT_POINTS_BY_PRODUCT, {
        [SymfonyPointsRoutes.GRANT_POINTS_BY_PRODUCT_PARAM_ID]: data.productData.id,
      });

      this.$rootEvent.showFullPageLoader();
      this.$axios.getWithCsrf(url, BaseApiResponse).then((response: BaseApiResponse) => {
        this.$rootEvent.hideFullPageLoader();

        if (response.success) {
          this.$emit('modalClosed');

          AuthenticatedUserWebsocketCallable.requestJwtToken();
          if (response.message) {
            this.$rootEvent.showNotification(ToastNotification.getTypeFromCode(response.code), response.message);
          }

          return;
        }

        this.handleFailedBackendResponse(response, url);
      })
    },
    /**
     * @description handler activated when product to buy is selected
     */
    onProductSelected(data: Record<string, string | number>): void {
      this.selectedProduct.data                = data.productData;
      this.selectedProduct.usedCurrencyCode    = data.usedCurrencyCode;
      this.selectedProduct.usedPriceWithTax    = data.usedPriceWithTax;
      this.selectedProduct.usedPriceWithoutTax = data.usedPriceWithoutTax;

      this.isPaymentModalVisible = true;
    }
  },
  created(): void {
    this.userStateStore = userStateStore();
    this.userStateStore.loadUserData()

    this.initialSmallSizeModal = "medium";
  },
  updated(): void{
    this.showModal = this.isModalVisible;
  },
}
</script>
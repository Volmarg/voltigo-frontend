<template>
  <div>

    <Modal
        :is-visible="isVisible"
        :title="$t('jobOfferSearch.page.modal.advancedSetting.header')"
        :is-close-visible="false"
        :size="dialogSize"
        @modal-closed="$emit('modalClosed')"
    >
      <template #content>
        <div class="modal-body flex flex-col mt-6">
          <div class="flex flex-row-reverse">

            <QuestionMarkAbout
                :text="$t('jobOfferSearch.page.modal.advancedSetting.info')"
                class="align-self-center ml-2"
            />

            <LimitSelect
                v-model="offersLimit"
                :options="allProducts"
            />
          </div>

          <!-- v-if is set on purpose as first the products must be loaded to get active product data-->
          <PointsFee
              :count="jobSearchKeywords.length"
              :about-text="$t('jobOfferSearch.fee.about')"
              :product-data="usedProduct"
              @missing-points-check="isMissingPoints = $event.isMissingPoints"
              @failure="pointsFeeCheckSuccess = false"
              v-if="this.allProducts"
          />

        </div>

      </template>

      <template #footerRightSection>
        <MediumButtonWithIcon
            :text="$t('jobOfferSearch.page.modal.advancedSetting.buttons.cancel')"
            :is-mobile-full-width="true"
            @click="$emit('modalClosed')"
        />

        <MediumButtonWithIcon
            :text="$t('jobOfferSearch.page.modal.advancedSetting.buttons.ok')"
            :is-mobile-full-width="true"
            :background-color-class="(isMissingPoints ? 'bg-gray-400' : 'bg-blue-500')"
            class="m-0-force"
            :class="{
              'pointer-events-none touch-action-none': isMissingPoints
            }"
            @click="onSubmitClick"
        />
      </template>

    </Modal>

  </div>
</template>

<script lang="ts">
import MediumButtonWithIcon from "@/components/Navigation/Button/MediumButtonWithIcon.vue";
import QuestionMarkAbout    from "@/components/Ui/QuestionMarkAbout.vue";
import LimitSelect          from "@/views/JobOffer/Search/AdvancedSettingModal/LimitSelect.vue";
import PointsFee            from "@/components/LoggedIn/Payment/PointsFee.vue";
import Modal                from "@/components/Modal/Modal.vue";

import ResponsiveVarsMixin from "@/mixins/Responsive/ResponsiveVarsMixin.vue";

import GetAllJobSearchTagProductResponse from "@/scripts/Response/PointShop/GetAllJobSearchTagProductResponse";
import SymfonyPointShopRoutes            from "@/router/SymfonyRoutes/SymfonyPointShopRoutes";
import SymfonyRoutes                     from "@/router/SymfonyRoutes";
import BaseError                         from "@/scripts/Core/Error/BaseError";

import {ComponentData}               from "@/scripts/Vue/Types/Components/types";
import PointShopProduct              from "@/scripts/Entity/PointShop/PointShopProduct";
import {PointShopSearchTagLimitEnum} from "@/scripts/Enum/PointShopProductEnum";

export default {
  data(): ComponentData {
    return {
      pointsFeeCheckSuccess: true,
      isMissingPoints: false,
      isVisible: false,
      offersLimit: 0, // 0 = no limit
      allProducts: [] as unknown as Array<PointShopProduct>
    }
  },
  props: {
    jobSearchKeywords: {
      type: Array,
      required: true,
    },
    forceIsVisible: {
      type: Boolean,
      required: true,
      default: false,
    }
  },
  emits: [
    'submitted',
    'modalClosed',
  ],
  mixins: [
    ResponsiveVarsMixin,
  ],
  components: {
    PointsFee,
    QuestionMarkAbout,
    MediumButtonWithIcon,
    LimitSelect,
    Modal,
  },
  computed: {
    /**
     * @description returns the product that is going to be selected in the limit list by default
     */
    usedProduct(): PointShopProduct | null {
      for (let product of this.allProducts) {
        let limit = PointShopSearchTagLimitEnum[product.internalIdentifier] ?? undefined;
        if (limit == this.offersLimit) {
          return product
        }
      }

      throw new BaseError("No product defined for this limit: " + this.offersLimit);
    },
    /**
     * @description will decide size of the dialog
     */
    dialogSize(): string {
      return (this.isPhoneBreakingPoint ? 'full' : 'small');
    },
  },
  methods: {
    /**
     * @description fetches all available search products
     */
    async getAllProducts(): Promise<void> {
      let url = SymfonyRoutes.buildUrl(SymfonyPointShopRoutes.GET_JOB_SEARCH_PRODUCTS);
      this.$axios.getWithCsrf(url, GetAllJobSearchTagProductResponse).then((response: GetAllJobSearchTagProductResponse) => {
        this.allProducts = response.pointShopProducts;
      })
    },
    /**
     * @description handle user clicking on submit, will just pass the even further and turn "0" into "null"
     */
    onSubmitClick(): void {
      this.$emit('submitted', {offersLimit: this.offersLimit})
    },
  },
  created(): void {
    this.isVisible = this.forceIsVisible;
    this.getAllProducts();
  },
  watch: {
    /**
     * @description the offersLimit reset in here is needed else there is useless 2nd ajax call made for previously selected value
     */
    forceIsVisible(): void {
      this.isVisible = this.forceIsVisible;
      this.offersLimit = 0;
    },
    'jobSearchKeywords.length'() {
      this.isMissingPoints = false;
    },
  }
}
</script>

<template>

  <Modal :title="$t('paymentModal.header.label')"
         :is-visible="isModalVisible"

         size="medium"
  >
    <template #cancelButton>
      <MediumButtonWithIcon
          :text="$t('userSettings.personalDataModal.buttons.close.label')"
          margin-right-class="mr-0"
          @click="closeModal"
      />
    </template>

    <template #content>

      <div v-if="activePaymentToolComponent !== null">
        <div class="italic mb-4 text-xs">
          <p>{{ $t('paymentModal.info.dontClose.line1') }}</p>
          <QuestionMarkAbout :text="$t('paymentModal.info.dontClose.popupInfo')" />
        </div>

        <component
            :is="activePaymentToolComponent"
            v-bind="$props"
            @payment-finished="closeModal"
        />
      </div>

      <div class="flex flex-col sm:flex-row gap-4">
        <StripeButton @click="setActivePaymentToolComponent(toolNames.stripe)"/>
        <PaypalButton @click="setActivePaymentToolComponent(toolNames.paypal)"/>
      </div>

      <!-- add support for closing the warning block -->
      <WarningBlock
          v-if="activePaymentToolComponent !== null"
          class="mb-4 mt-4 text-left"
      >
        <div>
          <p class="font-bold text-center text-lg">{{ $t('paymentModal.disclaimers.disclaimerItself') }}</p>
          <p
              v-html="$t('paymentModal.disclaimers.notSavingRequest.content.line1')"
              class="mb-2"
          />
          <p
              v-html="$t('paymentModal.disclaimers.notSavingRequest.content.line2')"
              class="mb-2"
          />

          <p v-html="$t('paymentModal.disclaimers.notSavingRequest.content.line3')"/>
        </div>
      </WarningBlock>

    </template>
  </Modal>

</template>

<script lang="ts">

import MediumButtonWithIcon from "@/components/Navigation/Button/MediumButtonWithIcon.vue";
import WarningBlock         from "@/components/Page/WarningBlock.vue";
import StripeButton         from "@/components/LoggedIn/Payment/Tool/Button/StripeButton.vue";
import PaypalButton         from "@/components/LoggedIn/Payment/Tool/Button/PaypalButton.vue";
import StripePayment        from "@/components/LoggedIn/Payment/Tool/StripePayment.vue";
import PaypalPayment        from "@/components/LoggedIn/Payment/Tool/PaypalPayment.vue";
import Modal                from "@/components/Modal/Modal.vue";
import QuestionMarkAbout    from "@/components/Ui/QuestionMarkAbout.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import BaseError    from "@/scripts/Core/Error/BaseError";
import {shallowRef} from "vue";

export default {
  data(): ComponentData {
    return {
      toolNames: {
        paypal: "Paypal",
        stripe: "Stripe"
      },
      activePaymentToolComponent: null,
      activePaymentTool: null,
      isModalVisible: false,
    }
  },
  props: {
    productId: {
      type: Number,
      required: true,
    },
    priceWithoutTax: {
      type: Number,
      required: true,
    },
    priceWithTax: {
      type: Number,
      required: true,
    },
    targetCurrencyCode: {
      type: String,
      required: true,
    },
    isVisible: {
      type     : Boolean,
      required : false,
    }
  },
  components: {
    MediumButtonWithIcon,
    QuestionMarkAbout,
    WarningBlock,
    StripeButton,
    PaypalPayment,
    PaypalButton,
    Modal,
  },
  methods: {
    closeModal(): void {
      this.$emit('modalClosed');

      /**
       * @description this was added due to PayPal issues.
       *              PayPal throws "Can not send postrobot_method" on any click made (after closing transaction),
       *              there is no real solution to this at all. Therefore, showing the loader which will deny user
       *              from clicking anywhere at all. After fixed amount of time (where PayPal problem resolves itself magically)
       *              user can continue on clicking.
       */
      this.$rootEvent.showFullPageLoader();
      this.$nextTick(() => {
        setTimeout(() => {
          this.$rootEvent.hideFullPageLoader();
        },500)
      });
    },
    setActivePaymentToolComponent(toolName: string): void {
      /**
       * @description this check is needed else picking again the same payment tool causes some frontend issues.
       */
      if (this.activePaymentTool === toolName) {
        return;
      }

      this.activePaymentTool = toolName;

      this.$rootEvent.showFullPageLoader();
      switch (toolName) {
        case this.toolNames.paypal:
          this.activePaymentToolComponent = shallowRef(PaypalPayment);
          break;
        case this.toolNames.stripe:
          this.activePaymentToolComponent = shallowRef(StripePayment);
          break;
        default:
          throw new BaseError(`This payment tool is not supported: ${toolName}, cannot render payment modal view`);
      }
    }
  },
  mounted(): void {
    this.isModalVisible = this.isVisible;
  },
  watch: {
    isVisible() {
      if (!this.isVisible) {
        this.activePaymentTool = null;
        this.activePaymentToolComponent = null;
      }
      this.isModalVisible = this.isVisible;
    }
  }
}
</script>
<template>
  <div class="cs-btn-container hover:opacity-70">
    <div class="block"></div>
    <div
        class="cs-stp-one"
        :class="{
          'cs-btn': !isDisabled,
          'cs-btn-disabled': isDisabled,
        }"
    >
      <div
          class="cs-btn-content"
          :class="{
            'w-full': isPaymentDataSet
          }"
      >

        <div class="cs-copy-icon">
          <p class="cs-btn-text">
            {{ $t('paymentModal.buttons.pay.label') }}
            <span v-if="isPaymentDataSet">
              {{ amount }} {{ currency }}
            </span>
          </p>
          <svg xmlns="http://www.w3.org/2000/svg"
               width="24"
               height="24"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               stroke-width="2"
               stroke-linecap="round"
               stroke-linejoin="round"
               class="feather feather-credit-card cs-btn-icon">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    amount: {
      type: [Number, null],
      required: false,
      default: null
    },
    currency: {
      type: [String, null],
      required: false,
      default: null,
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  computed: {
    /**
     * @description check if all the payment data is set, meaning:
     *              - amount,
     *              - currency
     */
    isPaymentDataSet(): boolean {
      return (this.amount && this.currency);
    },
    /**
     * @description get the button width
     */
    buttonWidth(): string {
      if (this.isPaymentDataSet) {
        return '250px';
      }

      return '170px';
    }
  }
}
</script>

<style lang="scss" scoped>
// Based on https://codepen.io/coswise/pen/yLYyEKv

// VARIABLES
// $canvasBg: #f7f7f7; Grey
$canvasBg: #F1F3F9; // Bright #d5dbed

$textC: #333333;
$col1: #FF8C69;
$col2: ff696c;
$col3: #1462FF;
$col4: #F0F1F5;

$svgC: rgba(#929cd0, .8);
// $shadowC: #d1d4e1;
$shadowC: #D5DBED;
$shadowDef: 0 3px 20px -3px $shadowC;
$shadowDefTwo: 0 6px 30px -10px $shadowC;

// Variables
$col3s: #4A74C9;

$t: 249ms;
$cB: cubic-bezier(.63, .01, .26, 1);
$cB2: cubic-bezier(.28, .01, 0, .98);

// Front Icon
.front .path {
  stroke: rgb(255, 255, 255);
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
}

// Container
.cs-btn-container {
  position: relative;
  width: 250px;
}

// Block
.block {
  width: v-bind(buttonWidth);
  height: 50px;
  background: transparent;
  position: absolute;
  z-index: 9;
  display: none;
}

// Button
.cs-btn {
  // width: 170px;
  // height: 50px;
  background: lighten($col3, 0%);
  // background: lighten($col3, 10%);
  border-radius: 9px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  cursor: pointer;
  box-shadow: 0 6px 30px -10px rgba($col3s, 1);
  transition: background $t*2 $cB;
}

.cs-btn-disabled {
  @extend .cs-btn;
  box-shadow: 0 6px 30px -10px rgba(#7b7979, 1);
  @apply bg-gray-400 cursor-not-allowed
}

%btn-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  position: absolute;
  opacity: 1;
}

.cs-btn-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  position: relative;
  opacity: 1;
}

.cs-copy-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  position: absolute;
  opacity: 1;
  transition: opacity 449ms $cB;
}

.cs-btn-text {
  font-size: 1.2em;
  color: #FFFFFF;
  margin: 0 10px 0 0;
}

.cs-btn-icon {
  color: #FFFFFF;
  width: 20px;
  margin: 2px 0 0 10px;
  display: block;
}

.cs-checked-icon {
  display: none;
}

// Behaviours

.cs-stp-one {
  width: v-bind(buttonWidth);
  height: 50px;
}

.cs-stp-one {
  width: v-bind(buttonWidth);
  height: 50px;
}

.cs-stp-two {
  width: v-bind(buttonWidth);
  height: 75px;
}

.cs-stp-three {
  width: v-bind(buttonWidth);
  height: 50px;
}

.cs-btn-act {
  animation: btn-act-one 299ms $cB forwards;
}

.cs-btn-act-two {
  animation: btn-act-two 299ms $cB forwards;
}

// Content Copy+Icon
.cs-copy-icon-op {
  opacity: 0;
  transition: opacity 249ms $cB;
}

// Fingerprint Icon
.icon-op-1 {
  opacity: 1;
  transition: opacity 249ms $cB;
}
</style>
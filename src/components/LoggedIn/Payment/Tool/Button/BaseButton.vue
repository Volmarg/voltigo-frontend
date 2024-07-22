<template>
  <div class="wrapper p-5 max-w-paypal flex justify-center flex-row hover:opacity-70">
    <slot>

    </slot>
  </div>
</template>

<script lang="ts">
export default {

}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/responsive.scss';

.wrapper {
  border-collapse: collapse;
  white-space: nowrap;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  text-transform: none;
  font-weight: 500;
  font-size: 0;
  user-select: none;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  border: none;
  vertical-align: top;
  cursor: pointer;
  overflow: hidden;
  text-align: center;
  height: 100%;
  color: #2C2E2F;
  border-radius: 4px;
  max-width: 200px !important;
}

@media screen and (max-width: $phoneBreakingPoint + 'px') {
  .wrapper {
    max-width: 100% !important;
  }
}
</style>
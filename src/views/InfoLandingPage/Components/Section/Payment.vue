<template>
  <section
      class="pt-0"
      id="pricing"
  >
    <div class="container">
      <div class="row">
        <div class="lg:w-full pr-3 pl-3 flex justify-center w-full">
          <div class="title-box text-center"><h2>
            {{ $t('infoPage.section.payment.header') }}
          </h2>
            <p>
              {{ $t('infoPage.section.payment.desc') }}
            </p>
          </div>
        </div>
      </div>
      <div class="row justify-content-center flex flex-col">
        <img
            src="/src/assets/img/info-page/section/info/payment/screen.png"
            class="slider-single-image w-full md:w-3/4 lg:w-2/3 lg:pl-0 lg:pr-0 pl-2 pr-2 payment-image self-center"
        >
        <small class="italic">{{ $t('infoPage.section.payment.caption') }}</small>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
export default {}
</script>

<style lang="scss" scoped>
.payment-image {
  border:        1px solid rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  margin-top:    0px;
}
</style>
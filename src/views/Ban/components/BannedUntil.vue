<template>
  <div class="lg:flex justify-center">

    <h2 class="headline danger-text ">{{ $t('ban.bannedUntil') }}:&nbsp;</h2>

    <div v-if="0 === banResponse.activeBanTypes.length"
         class="align-self-end"
    >

      <p class="danger-text-detail">
        <span class="danger-text-detail"> {{ $t('ban.banValidity.unknown') }} </span>
      </p>
    </div>

    <div v-else
         class="align-self-end"
    >

      <div v-if="!!banResponse.validTill">
        <p class="danger-text-detail"> {{ banResponse.validTill }} </p>
      </div>

      <div v-else>
        <p class="danger-text-detail"> {{ $t('ban.banValidity.perma') }} </p>
      </div>

    </div>

  </div>
</template>

<script lang="ts">
import BanResponse from "@/scripts/Response/Ban/BanResponse";

import BanTypeMixin from "@/views/Ban/mixin/BanTypeMixin.vue";

export default {
  props: {
    banResponse: {
      type     : BanResponse,
      required : true,
    }
  },
  mixins: [
    BanTypeMixin
  ]
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/vue/view/info-page.scss';
</style>

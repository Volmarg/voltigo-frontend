<template>
  <div class="lg:flex justify-center">

    <h2 class="headline danger-text ">{{ $t('ban.banReason') }}:&nbsp;</h2>

    <div v-if="isBanTypeSet(ban.type.user)"
         class="align-self-end"
    >
      <p class="danger-text-detail"
      >
        "{{ $t('ban.type.user.description') }}"
      </p>

    </div>

    <div v-if="isBanTypeSet(ban.type.ip)"
         class="align-self-end"
    >
      <p class="danger-text-detail">
        "{{ $t('ban.type.ip.description') }}"
      </p>

    </div>

    <div v-if="0 === banResponse.activeBanTypes.length"
         class="align-self-end"
    >

      <p class="danger-text-detail">
        "{{ $t('ban.type.unknown.description') }}"
      </p>

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
  ],
  methods: {
    /**
     * @description will check if given ban type is set now
     */
    isBanTypeSet(type: string): boolean {
      return this.banResponse.activeBanTypes.includes(type);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/vue/view/info-page.scss';
</style>

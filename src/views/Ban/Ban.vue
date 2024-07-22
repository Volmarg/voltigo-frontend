<template>
  <section>
    <img src="/public/image/landing-pages/ban/ban.png">
    <h2 class="headline">{{ $t('ban.headline') }}</h2>
    <br/>
    <p class="text" v-html="$t('ban.description')"></p>

    <BanReason :ban-response="banResponse"/>
    <BannedUntil :ban-response="banResponse"/>

    <ButtonRounded :text="$t('ban.nav.tryAgain')"
                   class="ban-try-again-button mt-5"
                   @click="goToLoginPage"
    />

  </section>
</template>

<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import BanResponse     from "@/scripts/Response/Ban/BanResponse";
import Base64Service   from "@/scripts/Core/Services/Crypto/Base64Service";
import VueRouter       from "@/router/VueRouter";

import ButtonRounded   from "@/components/Navigation/Button/ButtonRounded.vue";
import BanTypeMixin    from "@/views/Ban/mixin/BanTypeMixin.vue";
import BanReason       from "@/views/Ban/components/BanReason.vue";
import BannedUntil     from "@/views/Ban/components/BannedUntil.vue";

export default {
  data(): ComponentData {
    return {
      banResponse : null as BanResponse | null,
    }
  },
  components: {
    ButtonRounded,
    BannedUntil,
    BanReason
  },
  mixins: [
    BanTypeMixin
  ],
  methods: {
    goToLoginPage(): void {
      location.href = `/#${VueRouter.ROUTE_PATH_LOGIN}`;
    }
  },
  created(): void {
    let banResponseJson = Base64Service.base64ToUtf8(this.$route.params.hash);
    this.banResponse    = BanResponse.fromJson(banResponseJson);
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/vue/view/info-page.scss';
</style>

<style lang="scss">
.ban-try-again-button {
  @apply text-xl sm:text-2xl md:w-auto w-full p-4 rounded-none md:rounded-xl
}
</style>

<template>
  <section>
    <img src="/public/image/landing-pages/account-activate/activate.png"
         class="main-image"
    >
    <h2 class="headline">{{ $t('landingPage.activateAccount.headline.label') }}</h2>
    <br/>
    <p class="text" v-html="$t('landingPage.activateAccount.info.value')"></p>

    <MediumButtonWithIcon :text="$t('landingPage.activateAccount.button.label')"
                          :is-icon-on-top="true"
                          button-classes="text-2xl mb-10 w-full md:w-auto text-2xl mb-10"
                          :default-rounded="!isTabletBreakingPoint"
                          top-wrapper-classes="action-button-wrapper rounded-none md:rounded-lg"
                          @click="activateProfile"
                          :margin-right-class-number="0"
    />

    <NavButtons class="mt-10" />
    <div class="mt-10">&nbsp;</div>

  </section>
</template>
<script lang="ts">
import JwtService                   from "@/scripts/Core/Services/Security/JwtService";
import EventDispatcherService       from "@/scripts/Core/Services/Dispatcher/EventDispatcherService";
import SymfonyRoutes                from "@/router/SymfonyRoutes";
import VueRouter                    from "@/router/VueRouter";
import {ToastTypeEnum}              from "@/scripts/Libs/ToastNotification";

let jwtService = new JwtService();

import ResponsiveVarsMixin from "@/mixins/Responsive/ResponsiveVarsMixin.vue";

import NavButtons                   from "@/views/User/InfoPage/Components/NavButtons.vue";
import MediumButtonWithIcon         from "@/components/Navigation/Button/MediumButtonWithIcon.vue";
import FailedBackendResponseHandler from "@/scripts/Vue/Mixins/FailedBackendResponseHandler.vue";

export default {
  name: "ProfileActivationConfirmation",
  mixins: [
    FailedBackendResponseHandler,
    ResponsiveVarsMixin
  ],
  components: {
    MediumButtonWithIcon,
    NavButtons,
  },
  methods: {
    /**
     * @description will handle profile activation
     */
    activateProfile(): void {
      let jwtToken = this.$route.params.token;
      let payload  = jwtService.decodeUsingSignature(jwtToken, false);

      if(null === payload){
        EventDispatcherService.emitShowNotification(ToastTypeEnum.error, this.$t('views.activate.texts.invalidToken'));
        return;
      }

      let calledBackendUrl = SymfonyRoutes.buildUrl(
          SymfonyRoutes.URL_ACTIVATE_USER,
          {
            [SymfonyRoutes.URL_ACTIVATE_USER_PARAM_TOKEN]: jwtToken
          }
      );

      this.$axios.getWithCsrf(calledBackendUrl).then( (response) => {
        if(!response.success){
          this.handleFailedBackendResponse(response, SymfonyRoutes.URL_ACTIVATE_USER);
          return;
        }

        this.$rootEvent.showNotification(ToastTypeEnum.success, this.$t("views.activate.texts.accountHasBeenActivated"));

        // give user time to ready message
        setTimeout(() =>{
          location.href = `/#${VueRouter.ROUTE_PATH_LOGIN}`;
        }, 2000);
      });

    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/vue/view/info-page.scss';
</style>
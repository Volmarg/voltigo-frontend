<template>
  <section>
    <img src="/public/image/landing-pages/account-activate/activate.png"
         class="main-image"
    >
    <h2 class="headline">{{ $t('landingPage.userNotActivated.headline.label') }}</h2>
    <br/>
    <p class="text" v-html="$t('landingPage.userNotActivated.info.value')"></p>

    <MediumButtonWithIcon :text="$t('landingPage.userNotActivated.button.label')"
                          :is-icon-on-top="true"
                          button-classes="text-2xl mb-10 w-full md:w-auto text-2xl mb-10"
                          :default-rounded="!isTabletBreakingPoint"
                          top-wrapper-classes="action-button-wrapper rounded-none md:rounded-lg"
                          @click="requestLink"
                          :margin-right-class-number="0"
    />

    <NavButtons />
  </section>
</template>
<script lang="ts">
import SymfonyRoutes                from "@/router/SymfonyRoutes";
import {ToastTypeEnum}              from "@/scripts/Libs/ToastNotification";

import ResponsiveVarsMixin from "@/mixins/Responsive/ResponsiveVarsMixin.vue";

import MediumButtonWithIcon         from "@/components/Navigation/Button/MediumButtonWithIcon.vue";
import FailedBackendResponseHandler from "@/scripts/Vue/Mixins/FailedBackendResponseHandler.vue";
import LocalStorageService          from "@/scripts/Core/Services/Storage/LocalStorageService";
import Logger                       from "@/scripts/Core/Logger";
import NavButtons                   from "@/views/User/InfoPage/Components/NavButtons.vue";

export default {
  name: "ProfileActivationConfirmation",
  mixins: [
    FailedBackendResponseHandler,
    ResponsiveVarsMixin
  ],
  components: {
    NavButtons,
    MediumButtonWithIcon,
  },
  methods: {
    /**
     * @description calls backend to send the Activation E-Mail
     */
    requestLink(): void {

      /**
       * @description that's a bit dirty but the logic for requesting activation link was already there
       *              ,so it's easier to set back the token before doing request.
       *              Once request is handled, the token will be removed.
       */
      LocalStorageService.set(LocalStorageService.AUTHENTICATION_TOKEN, this.$route.params.token);
      this.$rootEvent.showBarPageLoader();

      this.$axios.postWithCsrf(SymfonyRoutes.buildUrl(SymfonyRoutes.URL_REQUEST_USER_ACTIVATION_LINK)).then( (response) => {
        this.$rootEvent.hideBarPageLoader();
        LocalStorageService.remove(LocalStorageService.AUTHENTICATION_TOKEN);

        if (!response.success) {
          this.handleFailedBackendResponse(response, SymfonyRoutes.URL_REQUEST_USER_ACTIVATION_LINK);
          return;
        }

        this.$rootEvent.showNotification(ToastTypeEnum.success, this.$t('views.settings.requestUserActivationLink.messages.emailHaBeenSent'));
      }).catch((error) => {
        this.$rootEvent.hideBarPageLoader();
        LocalStorageService.remove(LocalStorageService.AUTHENTICATION_TOKEN);
        Logger.error("Got error while trying to request activation E-Mail", {
          error: error
        });

        let message = this.$t('messages.internalServerError');
        this.$rootEvent.showNotification(ToastTypeEnum.error, message);
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/vue/view/info-page.scss';
</style>
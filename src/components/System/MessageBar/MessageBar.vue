<template>
  <div v-if="isVisible">
    <Alert :is-shown="true"
           :text="text"
           :type="type"
    />
  </div>
</template>

<script lang="ts">
import Alert from '@/components/Notification/Alert.vue';

import EnvReader              from '@/scripts/Core/System/EnvReader';
import VueRouter              from "@/router/VueRouter";
import VueRouterAccessControl from "@/router/VueRouterAccessControl";

export default {
  name: "MaintenanceBar",
  components: {
    Alert,
  },
  computed: {
    /**
     * @description check if message bar is visible
     */
    isVisible(): boolean {
      return (
              EnvReader.isMessageBarOn()
          &&  !EnvReader.isMaintenance()
          &&  this.$route.name !== VueRouter.ROUTE_NAME_404
          &&  this.$route.name !== VueRouter.ROUTE_NAME_INFO
          &&  this.$route.name !== VueRouterAccessControl.ROUTE_PATH_BANNED_FULL
          &&  this.$route.name !== VueRouter.ROUTE_NAME_USER_NOT_ACTIVATED
          &&  this.$route.name !== VueRouter.ROUTE_NAME_USER_PROFILE_ACTIVATION_CONFIRMATION
          &&  this.$route.name !== VueRouter.ROUTE_NAME_USER_PROFILE_PASSWORD_RESET_CONFIRMATION
      )
    },
    /**
     * @description will return type of the message bar {@see AlertTypesEnums}
     */
    type(): string {
      return EnvReader.messageBarType();
    },
    /**
     * @description text shown in the bar
     */
    text(): string {
      return EnvReader.messageBarText();
    }
  }
}
</script>
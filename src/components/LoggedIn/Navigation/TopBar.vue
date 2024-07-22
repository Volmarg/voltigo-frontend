<template>
  <div>

    <div class="navbar navbar-1 border-b">
      <div class="navbar-inner w-full flex items-center justify-start">
        <hamburger @click="$emit('toggleSidebarSize')"/>

        <!-- This span moves all elements after it `to right side` -->
        <span class="ml-auto"></span>

        <FoundsStatus
            @click="isFoundsModalVisible = true"
            ref="topNavbarFoundsStatus"
        />
        <Timer />

        <user-menu @toggle-right-sidebar="$emit('toggleRightSidebar', $event)"
                   @right-sidebar-content-changed="onRightSidebarContentChanged"
                   ref="userMenuComponent"
        />
      </div>
    </div>

    <FoundsStateModal
        :is-modal-visible="isFoundsModalVisible"
        @modal-closed="isFoundsModalVisible = false"
    />

  </div>
</template>

<script lang="ts">
import Hamburger        from "@/components/Navigation/Hamburger.vue";
import UserMenu         from "@/components/LoggedIn/Navigation/TopBarComponents/UserMenu.vue";
import Timer            from "@/components/LoggedIn/Navigation/Timer/Timer.vue";
import FoundsStatus     from "@/components/LoggedIn/Navigation/Founds/FoundsStatus.vue";
import FoundsStateModal from "@/components/LoggedIn/Navigation/Founds/Modal/FoundsStateModal.vue";

import {RightSidebarComponentData} from "@/scripts/Vue/Types/Components/Sidebar";
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

export default {
  name: "NavigationTopBar",
  data(): ComponentData {
    return {
      isFoundsModalVisible: false,
    }
  },
  emits: [
      'toggleSidebarSize',
      'rightSidebarContentChanged',
  ],
  components: {
    "hamburger"    : Hamburger,
    "user-menu"    : UserMenu,
    Timer,
    FoundsStatus,
    FoundsStateModal
  },
  methods: {
    /**
     * @description passing forward the sidebar component data as Vue3 does not support passing forward
     *              multiple data via $event (only the first one gets forwarded),
     */
    onRightSidebarContentChanged(sidebarData: RightSidebarComponentData, widthPercent: string): void {
      this.$emit("rightSidebarContentChanged", sidebarData, widthPercent);
    }
  }
}
</script>
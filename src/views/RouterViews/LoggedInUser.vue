<template>
  <div>

    <div data-layout="layout-1"
         :data-collapsed="isDataCollapsed()"
         data-background="light"
         data-navbar="light"
         data-left-sidebar="light"
         data-right-sidebar="light"
         class="font-sans antialiased text-sm disable-scrollbars logged-in-user-layout">

        <div class="modal-backdrop cursor-default"
             :class="{
              'fade-out': !isRightSidebarVisible,
              'fade-in' :  isRightSidebarVisible
           }"
        ></div>

        <right-sidebar ref="rightSidebar"
                       :content-data="sidebarData"
                       :sidebar-width-percent="sidebarWidthPercent"
                       :sidebar-z-index="sidebarZIndex.value"
                       @sidebar-hidden="isRightSidebarVisible = false"
                       @offer-apply-clicked="onSidebarOfferApplyClick"
        ></right-sidebar>
        <div class="wrapper">

          <sidebar/>
          <div class="main w-full bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">

            <top-bar @toggle-sidebar-size="toggleLeftSidebarSize()"
                     @toggle-right-sidebar="onToggleRightSidebar"
                     @right-sidebar-content-changed="onRightSidebarContentChanged"
                     ref="topBarComponent"
            />
            <div class="min-h-screen w-full p-4">
              <page-title-section/>

              <router-view @toggle-right-sidebar="onToggleRightSidebar"
                           @right-sidebar-content-changed="onRightSidebarContentChanged"
                           @profile-image-changed="onProfileImageChange()"
                           :is-right-sidebar-visible="isRightSidebarVisible"
                           :right-sidebar-applied-offer="rightSidebarAppliedOffer"
                           :right-sidebar-applied-offers-clicks="rightSidebarAppliedOffersClicks"
                           v-slot="{ Component }"
              >
                <component :is="Component"
                           ref="loggedInRouterViewComponent"
                 />
                <TermsOfUseModal :force-is-visible="isTermsOfUseVisible" />
              </router-view>
            </div>

          </div>

        </div>
    </div>

    <dispatcher-listener
        :id="dispatcherId"
        :supported-events="supportedEvents"
    />

    <Footer />

  </div>
</template>

<script lang="ts">
import TopBar              from "@/components/LoggedIn/Navigation/TopBar.vue";
import Sidebar             from "@/components/LoggedIn/Navigation/Sidebar.vue";
import Footer              from "@/components/LoggedIn/Navigation/Footer/Footer.vue";
import RightSidebar        from "@/components/LoggedIn/Navigation/RightSidebar.vue";
import TermsOfUseModal     from "@/views/RouterViews/Components/LoggedInUser/TermsOfUseModal.vue";
import PageTitleSection    from "@/components/LoggedIn/Navigation/PageTitleSection.vue";
import ResponsiveVarsMixin from "@/mixins/Responsive/ResponsiveVarsMixin.vue";
import DispatcherListener  from "@/components/App/DispatcherListener.vue";
import UserRegulationMixin from "@/mixins/User/UserRegulationMixin.vue";

import {ComponentData}    from "@/scripts/Vue/Types/Components/types";
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";

import EventDispatcherLoggedUserService from "@/scripts/Core/Services/Dispatcher/EventDispatcherLoggedUserService";
import StringTypeProcessor              from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";
import JwtTokenHandler                  from "@/scripts/Core/Security/JwtTokenHandler";
import {REGULATION_IDENTIFIER}          from "@/router/SymfonyRoutes/User/Regulation/SymfonyUserRegulationsRoutes";

export default {
  name: "LoggedInBasePageContent",
  data(): ComponentData {
    return {
      rightSidebarAppliedOffer: null as null | JobOfferAnalyzed,
      rightSidebarAppliedOffersClicks: {},
      isBackdropShown: false,
      isTermsOfUseVisible: false,
      sidebarZIndex: {
        value: 1,
        default: 50, // must be high enough to be shown over some modals etc.
      },
      isInitiallyCollapsedByResponsiveDesign: false,
      isLeftSidebarFullSize   : true,
      isRightSidebarVisible   : false,
      sidebarData             : {},
      sidebarWidthPercent     : null,
      selectedEmailTemplateId : null,
      deletedTemplateId       : null,
      dispatcherId    : EventDispatcherLoggedUserService.TYPESCRIPT_LOGGED_USER_DISPATCHER_LISTENER_DOM_ID,
      supportedEvents : EventDispatcherLoggedUserService.ALL_SUPPORTED_EVENTS,
    }
  },
  mixins: [
    ResponsiveVarsMixin,
    UserRegulationMixin
  ],
  components: {
    TermsOfUseModal,
    Footer,
    "top-bar"             : TopBar,
    "sidebar"             : Sidebar,
    "right-sidebar"       : RightSidebar,
    "page-title-section"  : PageTitleSection,
    "dispatcher-listener" : DispatcherListener,
  },
  methods: {
    /**
     * @description handles user clicking the "Apply" on the right sidebar.
     *              Will increment data which thanks to the reactivity, will also be updated
     *              in the proper view via props.
     */
    onSidebarOfferApplyClick(eventData: Record<string, JobOfferAnalyzed | undefined>): void {
      if (!eventData) {
        return;
      }

      let jobOffer = eventData.jobOffer ?? null;
      if (!jobOffer) {
        return;
      }

      this.rightSidebarAppliedOffer = jobOffer;
      this.$nextTick(() => {

        // this is literally stupid but linter cries about it
        if (!jobOffer) {
          return;
        }

        if (this.rightSidebarAppliedOffersClicks[jobOffer.identifier]) {
          this.rightSidebarAppliedOffersClicks[jobOffer.identifier]++;
        } else {
          this.rightSidebarAppliedOffersClicks[jobOffer.identifier] = 1;
        }
      })
    },
    /**
     * @description Handler for when user profile image changes
     *              - will call for loading profile picture,
     */
    async onProfileImageChange(): Promise<void> {
      await JwtTokenHandler.requestJwtTokenAndWaitForIt();
      this.$refs.topBarComponent.$refs.userMenuComponent.loadProfilePicturePath();
    },
    /**
     * @description check if data (sidebar etc.) is collapsed or not
     *              tbh. the data-collapse was just shipped, and im just using it to toggle the sidebar
     */
    isDataCollapsed(): boolean {
      if (!this.isInitiallyCollapsedByResponsiveDesign && this.isTabletBreakingPoint) {
        this.isInitiallyCollapsedByResponsiveDesign = true;
        this.isLeftSidebarFullSize                  = false;
        return true;
      }

      let isCollapsed = !this.isLeftSidebarFullSize;
      return isCollapsed;
    },
    /**
     * @description will toggle right sidebar visibility
     */
    onToggleRightSidebar(eventData: Record<string|number, boolean | number | undefined | null>): void {
      this.isRightSidebarVisible = eventData.isSidebarVisible;
      this.sidebarZIndex.value   = StringTypeProcessor.isEmptyString(eventData.sidebarZIndex) ? this.sidebarZIndex.default :eventData.sidebarZIndex;

      if (this.isRightSidebarVisible) {
        this.$view.scrollContentOfElement(this.$refs.rightSidebar.$refs.firstChild, 0, "auto");
      }
    },
    /**
     * @description handles setting new sidebar content
     */
    onRightSidebarContentChanged(sidebarContent: Record<string | number, unknown>, sidebarWidthPercent?: string | null): void {
      this.sidebarData         = sidebarContent;
      this.sidebarWidthPercent = sidebarWidthPercent;
    },
    /**
     * @description will either make the sidebar small or big
     */
    toggleLeftSidebarSize(): void {
      this.isLeftSidebarFullSize = !this.isLeftSidebarFullSize
    },
  },
  async mounted(): Promise<void> {
    /**
     * This is actually not a mistake to fetch this each time component gets mounted. It's possible that
     * the regulation will get renewed and user will need to accept them once again (content of regulation would change)..
     */
    this.isTermsOfUseVisible = !(await this.isUserRegulationAccepted(REGULATION_IDENTIFIER[REGULATION_IDENTIFIER.PLATFORM_TERMS_OF_USAGE]));
  },
  watch: {
    /**
     * @description checks and controls the right sidebar visibility
     */
    isRightSidebarVisible(value: unknown): void {

      if (value) {
        /**
         * @description this is added only due to dev-sidebar being glitchy, everything works fine with this
         *              there is literally no other reason for this setTimeout code here
         */
        setTimeout(() => {
          this.$refs.rightSidebar.showSidebar();
        }, 100)
        return;
      }

      this.$refs.rightSidebar.hideSidebar();
    }
  }
}
</script>

<style lang="scss" scoped>
.logged-in-user-layout {
  position: relative;
  z-index: 2 !important;
}
</style>
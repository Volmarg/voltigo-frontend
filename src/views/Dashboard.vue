<template>
  <div v-if="dashboardData">
    <TopDataBlocks :dashboard-data="dashboardData" />
    <JobApplicationsSent :data-grouped-by-day="dashboardData.jobApplicationsPerDay" />
    <UniqueOffersFound
        :data-grouped-by-day="dashboardData.uniqueOffersFoundPerDay"
        class="mt-5"
    />
  </div>

  <v-tour
      :name="tourName"
      :steps="searchTourSteps"
      :callbacks="searchTourCallbacks"
  />
</template>

<script lang="ts">

import JobApplicationsSent from "@/views/Dashboard/Components/JobApplicationsSent.vue";
import UniqueOffersFound   from "@/views/Dashboard/Components/UniqueOffersFound.vue";
import TopDataBlocks       from "@/views/Dashboard/Components/TopDataBlocks.vue";

import TourMixin                    from "@/views/Dashboard/Components/Mixin/TourMixin.vue";
import FailedBackendResponseHandler from "@/scripts/Vue/Mixins/FailedBackendResponseHandler.vue";

import {ComponentData}          from "@/scripts/Vue/Types/Components/types";
import GetDashboardDataResponse from "@/scripts/Response/Dashboard/GetDashboardDataResponse";
import SymfonyRoutes            from "@/router/SymfonyRoutes";
import SymfonyDashboardRoutes   from "@/router/SymfonyRoutes/SymfonyDashboardRoutes";
import BaseError                from "@/scripts/Core/Error/BaseError";
import LocalStorageService      from "@/scripts/Core/Services/Storage/LocalStorageService";
import {UserStateStore, userStateStore} from "@/scripts/Vue/Store/UserState";

export default  {
  name: "DashboardPage",
  data(): ComponentData {
    return {
      userStateStore: null as null | UserStateStore,
      tourName: LocalStorageService.TOUR_DASHBOARD,
      dashboardData: null as unknown as GetDashboardDataResponse,
    }
  },
  mixins: [
    TourMixin,
    FailedBackendResponseHandler,
  ],
  components: {
    TopDataBlocks,
    UniqueOffersFound,
    JobApplicationsSent
  },
  methods: {
    /**
     * @description fetches the dashboard data
     */
    async getDashboardData(): Promise<GetDashboardDataResponse> {

      let url = SymfonyRoutes.buildUrl(SymfonyDashboardRoutes.URL_GET_DASHBOARD_DATA);
      return this.$axios.getWithCsrf(url, GetDashboardDataResponse).then( (response: GetDashboardDataResponse) => {
        if (!response.success) {
          this.handleFailedBackendResponse(response, url);
          throw new BaseError("Could not get dashboard data", {
            responseMessage: response.message,
            responseCode: response.code,
          })
        }

        return response;
      })
    }
  },
  async created(): Promise<void> {
    this.userStateStore = userStateStore();
    this.userStateStore.loadUserData();

    this.dashboardData = await this.getDashboardData();
  },
  /**
   * @description user points changed, so need to update dashboard state
   */
  watch: {
    async 'userStateStore.user.points'(): Promise<void> {
      /**
       * @description the loader is added here explicitly on purpose else it breaks when used inside the fetching method
       *              and that's because there are many ajax calls happening on same time on dashboard
       */
      this.$rootEvent.showFullPageLoader();
      this.dashboardData = await this.getDashboardData();
      this.$rootEvent.hideFullPageLoader();

    }
  }
}
</script>

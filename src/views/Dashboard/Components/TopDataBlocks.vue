<template>
  <div>

    <!-- More important for user -->
    <div class="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-4">

      <SmallDataDisplayBlock
          :label="$t('homeDashboard.offersFoundToday.label')"
          :value="jobOffersFoundToday"
      >
        <template #icon>
          <la
              svg-icon-name="briefcase-solid"
              color="rgb(59, 130, 246)"
              font-size="35"
          />
        </template>
      </SmallDataDisplayBlock>

      <SmallDataDisplayBlock
          :label="$t('homeDashboard.applicationsSentToday.label')"
          :value="jobApplicationsToday"
      >
        <template #icon>
          <la
              svg-icon-name="envelope-open"
              color="rgb(59, 130, 246)"
              font-size="35"
          />
        </template>
      </SmallDataDisplayBlock>

    </div>

    <!-- less important -->
    <div class="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-4">
      <SmallDataDisplayBlock
          :label="$t('homeDashboard.allPendingJobSearches.label')"
          :value="dashboardData.pendingJobSearchesCount.toString()"
      >
        <template #icon>
          <la
              svg-icon-name="clock"
              color="orange"
              font-size="35"
          />
        </template>
      </SmallDataDisplayBlock>

      <SmallDataDisplayBlock
          :label="$t('homeDashboard.recentFailedJobSearches.label', {'hours' : dashboardData.recentFailedJobSearchesHoursOffset})"
          :value="dashboardData.recentFailedJobSearchesCount.toString()"
      >
        <template #icon>
          <la
              svg-icon-name="times-circle"
              color="red"
              font-size="35"
          />
        </template>
      </SmallDataDisplayBlock>

      <SmallDataDisplayBlock
          :label="$t('homeDashboard.pointsSpent.label')"
          :value="pointsLeftToSpent"
      >
        <template #icon>
          <img src="/public/image/system/gem/gem-32.png">
        </template>
      </SmallDataDisplayBlock>

    </div>

  </div>
</template>

<script lang="ts">
import SmallDataDisplayBlock from "@/components/Dashboard/SmallDataDisplayBlock.vue";

import GetDashboardDataResponse from "@/scripts/Response/Dashboard/GetDashboardDataResponse";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

export default {
  data(): ComponentData {
    return {
      currYear: new Date().getFullYear(),
      currMonth: new Date().getMonth() + 1,
      currDay: new Date().getDate(),
    }
  },
  props: {
    dashboardData: {
      type: null as unknown as GetDashboardDataResponse | null,
      required: true,
    },
  },
  components: {
    SmallDataDisplayBlock
  },
  computed: {
    /**
     * @description returns amount of job applications sent today
     */
    jobApplicationsToday(): number {
      let value = 0;
      for (let applicationData of this.dashboardData.jobApplicationsPerDay) {
        if (applicationData.year == this.currYear && applicationData.month == this.currMonth && applicationData.day == this.currDay){
          value = applicationData.count;
          break;
        }
      }

      return value;
    },
    /**
     * @description returns amount of job offers found today
     */
    jobOffersFoundToday(): number {
      let value = 0;
      for (let applicationData of this.dashboardData.uniqueOffersFoundPerDay) {
        if (applicationData.year == this.currYear && applicationData.month == this.currMonth && applicationData.day == this.currDay){
          value = applicationData.count;
          break;
        }
      }

      return value;
    },
    /**
     * Get "points spent overall / points left"
     */
    pointsLeftToSpent(): string {
      if (!this.dashboardData) {
        return "";
      }

      return `${this.dashboardData.pointsSpentTotally} / ${this.dashboardData.pointsAvailable}`;
    }
  },
}
</script>
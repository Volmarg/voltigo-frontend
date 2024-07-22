<template>
  <div class="flex justify-center sm:justify-start">
    <span :class="jobApplicationStatusClasses"
          class="status"
    >
      {{ $t(`applications.statuses.${application.status}`)}}
    </span>
  </div>
</template>

<script lang="ts">
import {JobApplication, jobApplicationStatus} from "@/scripts/Entity/Job/JobApplications";
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

export default {
  data: (): ComponentData => {
    return {
      jobApplicationStatusEnum: jobApplicationStatus,
    }
  },
  props: {
    application: {
      type     : Object as JobApplication,
      required : true,
    },
  },
  computed: {
    /**
     * @description returns the classes used to style the job application status {@see JobApplication.status}
     */
    jobApplicationStatusClasses(): string {
      if (this.jobApplicationStatusEnum[this.jobApplicationStatusEnum.SENT] === this.application.status) {
        return "text-green-500";
      }

      return "text-orange-700";
    }
  }
}
</script>

<style lang="scss" scoped>
.status {
  font-size: 20px;
  text-transform: uppercase;
}
</style>
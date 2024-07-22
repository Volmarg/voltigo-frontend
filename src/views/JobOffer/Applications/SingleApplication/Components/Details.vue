<template>
  <div class="details">

    <div class="w-full min-w-0 items-start flex flex-row justify-start">
      <div class="flex flex-row justify-between ">
        <!-- details themselves -->
        <section class="text-left">

          <span class="job-title">{{ application.jobOffer.title }}</span>

          <div class="text-sm">
            <span class="data-chunk-label">
              {{ $t('applications.singleApplication.labels.company')}}
            </span>
            {{ application.jobOffer.companyName }}
          </div>

          <small class="italic block">
            <span class="data-chunk-label">
              {{ $t('applications.singleApplication.labels.sentTo')}}
            </span>
            {{ application.email }}
          </small>

          <small class="italic">
            <span class="data-chunk-label">
              {{ $t('applications.singleApplication.labels.appliedAt')}}
            </span>
            {{ application.created }}
          </small>

        </section>

      </div>

    </div>

  </div>
</template>

<script lang="ts">
import {JobApplication} from "@/scripts/Entity/Job/JobApplications";

export default {
  props: {
    /** @var {JobApplication} */
    application: {
      type     : Object as JobApplication,
      required : true,
    },
  },
}
</script>

<style lang="scss" scoped>
.details span {
  white-space: break-spaces;
}

.job-title {
  font-weight: bold;
}

.data-chunk-label {
  font-weight: bold;
}
</style>
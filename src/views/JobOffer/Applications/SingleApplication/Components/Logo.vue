<template>
  <div class="align-self-center">

    <a class="hover:opacity-50 cursor-pointer"
       :content="$t('applications.singleApplication.hoverText.offerService')"
       :href="`//${offerServiceData.homePageUrl}`"
       target="_blank"
       v-tippy="{placement: 'top'}"
    >
      <div class="flex-shrink-0 w-16">
        <img :src="iconRelativePath"
             alt="media"
             class="h-16 w-full shadow-lg rounded-full"
        >
      </div>
    </a>

  </div>
</template>

<script lang="ts">
import {JobApplication} from "@/scripts/Entity/Job/JobApplications";

import JobServiceDataProvider, {ServiceData} from "@/scripts/Core/Services/Job/JobServiceDataProvider";

export default {
  props: {
    /** @var {JobApplication} */
    application: {
      type     : Object as JobApplication,
      required : true,
    },
  },
  computed: {
    /**
     * @description provide job offer source service data
     */
    offerServiceData(): ServiceData {
      return JobServiceDataProvider.getData(this.application.jobOffer.originalUrl)
    },
    /**
     * @description will provide job service logo path or placeholder with `not found` if given service is not yet handled
     */
    iconRelativePath(): string {
      return JobServiceDataProvider.LOGO_RELATIVE_PATH + this.offerServiceData.logoFileName;
    },
  }
}
</script>
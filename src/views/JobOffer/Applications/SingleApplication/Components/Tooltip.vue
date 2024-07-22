<template>
  <div class="flex justify-start application-tooltip-wrapper">

    <SeeOffer :offer-url="application.jobOffer.originalUrl" />

  </div>
</template>

<script lang="ts">
import {JobApplication} from "@/scripts/Entity/Job/JobApplications";

import SeeOffer from "@/views/JobOffer/Applications/SingleApplication/Components/Tooltip/Components/SeeOffer.vue";

export default {
  props: {
    application: {
      type     : Object as JobApplication,
      required : true,
    },
  },
  components: {
    SeeOffer,
  }
}
</script>

<style lang="scss">
.application-tooltip-action + .application-tooltip-action {
  @apply ml-0 sm:ml-1 mt-3 sm:mt-0
}

.application-tooltip-wrapper {
  @apply mt-2 sm:mt-0 flex-col sm:flex-row
}
</style>
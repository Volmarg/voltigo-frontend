<template>

  <div class="border-blue-500 w-full flex items-center justify-start p-4 bg-transparent shadow border-l-4 border-current p-4 mb-3 bg-white text-gray-500 text-2md">

    <section class="w-full">
    <div class="grid grid-rows-1 grid-cols-1 w-full sm:w-auto sm:grid-cols-2 gap-4 truncate overall-grid">

      <div class="grid grid-rows-1 grid-cols-1">
        <div class="flex justify-center align-self-center flex-col">
          <Logo :application="application" />
          <OfferServiceData :offer-url="application.jobOffer.originalUrl" />
        </div>
      </div>

      <div class="grid grid-rows-3 grid-cols-1 information-grid">
        <Status :application="application" />
        <Details :application="application" />
        <Tooltip :application="application" />
      </div>

      </div>
    </section>

  </div>
</template>

<script lang="ts">
import {JobApplication} from "@/scripts/Entity/Job/JobApplications";

import Logo    from "@/views/JobOffer/Applications/SingleApplication/Components/Logo.vue";
import Status  from "@/views/JobOffer/Applications/SingleApplication/Components/Status.vue";
import Details from "@/views/JobOffer/Applications/SingleApplication/Components/Details.vue";
import Tooltip from "@/views/JobOffer/Applications/SingleApplication/Components/Tooltip.vue";

import OfferServiceData from "@/views/JobOffer/Applications/SingleApplication/Components/OfferServiceData.vue";

export default {
  name: "JobOfferApplicationSingleApplication",
  props: {
    /** @var {JobApplication} */
    application: {
      type     : Object as JobApplication,
      required : true,
    },
  },
  components: {
    Logo,
    Status,
    Details,
    Tooltip,
    OfferServiceData,
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/responsive.scss';

@media screen and (min-width: $phoneBreakingPoint + 'px') {
  .overall-grid {
    grid-template-columns: 100px 1fr;
  }
}

@media screen and (max-width: $phoneBreakingPoint + 'px') {
  .information-grid {
    grid-template-rows: 40px 1fr 60px !important;
  }
}

.information-grid {
  grid-template-rows: 40px 1fr 60px;
}

</style>
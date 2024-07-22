<template>
  <div class="grid lg:block grid-cols-12">
    <p class="text-gray-200 text-center text-sm hidden lg:block">{{ $t('searchResults.singleCard.serviceData.header') }}</p>
    <hr class="border-gray-200 hidden lg:block"/>

    <!-- Logo & Name -->
    <div class="col-start-1 col-end-4 mt-0 ml-0 p-0 m-0 lg:grid lg:grid-cols-9 grid-cols-7 flex flex-row relative z-1">
      <div class="lg:col-start-4 lg:grid col-start-4 lg:grid-rows-1 top-grid-rows flex justify-start ml-5 lg:ml-0 flex-col sm:flex-row">
        <JobOfferServiceThumb :service-data="serviceData"
                              class="z-10 opacity-75 mt-5 lg:ml-2"
        />
      </div>

      <div class="col-start-1 col-end-12 align-self-center">
        <p
            v-if="serviceData.name"
            class="ml-2 lg:ml-0 lg:-m-4 -m-0 lg:text-center text-gray-200 align-self-center hidden sm:block w-full"
        >
          <b>{{ serviceData.name }}</b>
        </p>
      </div>
    </div>


    <!-- Data listing & description -->
    <div class="ml-2 lg:block flex justify-center col-start-5 col-end-13">

      <!-- Listing -->
      <div class="z-10 text-gray-200 text-xs md:col-start-5 md:col-end-12 justify-center hidden lg:block">
        <ul class="text-left mt-2">
          <li class="mt-1" v-if="serviceData.target">
            <b>{{ $t('searchResults.singleCard.serviceData.target.label') }}</b>:
            <span>{{ serviceData.target }}</span>
          </li>
          <li class="mt-1" v-if="serviceData.homePageUrl">
            <b>{{ $t('searchResults.singleCard.serviceData.homePage.label')}}</b>:
            <a :href="`//${serviceData.homePageUrl}`" target="_blank" class="underline">
              {{$t('searchResults.singleCard.serviceData.homePage.button.clickHere.label')}}
            </a>
          </li>
        </ul>
      </div>

      <!-- Description -->
      <p class="mt-2 lg:mt-6 pr-1 break-all text-gray-200 text-xs mr-1">
        {{ $t(serviceData.description) }}
      </p>

    </div>
  </div>
</template>

<script lang="ts">
import JobOfferServiceThumb from "@/views/JobOffer/SearchResult/Details/Components/Cards/SingleCard/JobOfferServiceThumb.vue";

import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";

import JobServiceDataProvider, {ServiceData} from "@/scripts/Core/Services/Job/JobServiceDataProvider";

export default {
  props: {
    /** @type JobOfferAnalyzed */
    jobOffer: {
      type     : Object as unknown as JobOfferAnalyzed,
      required : true,
    },
  },
  computed: {
    /**
     * @description provides information about service from which the offer was extracted
     */
    serviceData(): ServiceData {
      return JobServiceDataProvider.getData(this.jobOffer.jobOfferUrl);
    }
  },
  components: {
    JobOfferServiceThumb
  }
}
</script>

<style lang="scss" scoped>
.top-grid-rows {
  grid-template-rows: 1fr 20px;
}
</style>
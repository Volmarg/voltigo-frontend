<template>
  <div class="text-2md">

    <div class="widget w-full p-4 mb-4 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800">

      <div>
        <!-- name (logically, no name = no data) -->
        <div v-if="companyData.companyName">
          <div class="text-center text-lg border-l-0 border-r-0 border-t-0 border-b-2 border-gray-200">
            <p class="font-bold">{{ $t('searchResults.fullInfo.tabs.companyDetails.data.details.headers.details') }}</p>
          </div>

          <h3 class="text-left company-name mb-5 mt-3">
            <b>{{ $t('searchResults.fullInfo.tabs.companyDetails.data.details.texts.name') }}: </b>{{ companyData.companyName }}
          </h3>

          <company-data :company-data="companyData"/>
        </div>

        <CompanyWebsites
            :company-data="companyData"
            class="mt-4"
          />

        <company-industries
            :company-data="companyData"
            class="mt-4"
        />

        <company-locations
            :company-data="companyData"
            class="mt-4"
        />

      </div>

    </div>
  </div>
</template>

<script lang="ts">
import CompanyData       from "@/components/LoggedIn/JobOffer/Sidebar/FullInfo/CompanyDetail/CompanyData.vue";
import CompanyLocations  from "@/components/LoggedIn/JobOffer/Sidebar/FullInfo/CompanyDetail/CompanyLocations.vue";
import CompanyIndustries from "@/components/LoggedIn/JobOffer/Sidebar/FullInfo/CompanyDetail/CompanyIndustries.vue";
import CompanyWebsites   from "@/components/LoggedIn/JobOffer/Sidebar/FullInfo/CompanyDetail/CompanyWebsites.vue";

import CompanyDetail from "@/scripts/Entity/Job/CompanyDetail";

export default {
  name: "AnalyseResultFullInfoTabCompanyDetail",
  props: {
    /** @var {CompanyDetail} */
    companyData: {
      type     : Object as unknown as CompanyDetail,
      required : true,
    },
  },
  components: {
    CompanyData,
    CompanyWebsites,
    CompanyLocations,
    CompanyIndustries,
  },
}
</script>

<style lang="scss" scoped>
.company-name {
  font-size: 1.1rem;
}

</style>
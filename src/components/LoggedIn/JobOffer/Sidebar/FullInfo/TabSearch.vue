<template>
  <div class="text-2md">
    <div class="widget w-full p-4 mb-4 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800">
      <SearchOnGoogle :company-data="companyData" />
    </div>
  </div>
</template>

<script lang="ts">
import CompanyDetail   from "@/scripts/Entity/Job/CompanyDetail";

import SearchOnGoogle from "@/components/LoggedIn/JobOffer/Sidebar/FullInfo/Search/SearchOnGoogle.vue";

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
    SearchOnGoogle
  },
}
</script>

<style lang="scss" scoped>
.company-name {
  font-size: 1.1rem;
}

</style>
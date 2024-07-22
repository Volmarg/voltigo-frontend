<template>
  <div v-if="companyData.industries.length !== 0"
       class="mb-4"
  >

    <div class="text-center mb-8 text-lg border-l-0 border-r-0 border-t-0 border-b-2 border-gray-200">
      <p class="font-bold">
        {{ $t('searchResults.fullInfo.tabs.companyDetails.data.industries.label') }}
      </p>
    </div>

    <badge class="ml-2 mb-2"
           v-for="(industry, index) of companyData.industries"
           :key="index"
    >
      {{ industry }}
    </badge>
  </div>
</template>

<script lang="ts">
import CompanyDetail from "@/scripts/Entity/Job/CompanyDetail";
import Badge         from "@/components/Ui/Badge/Badge.vue";

export default {
  name: "OfferFullInfoCompanyDetailIndustries",
  props: {
    companyData: {
      type     : Object as unknown as CompanyDetail,
      required : true,
    },
  },
  components: {
    Badge
  }

}
</script>
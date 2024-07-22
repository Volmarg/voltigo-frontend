<template>
  <div>
    <span class="company-details">
      <!-- years old -->
      <span v-if="companyData.ageOld">
        <la svg-icon-name="birthday-cake-solid"/>
        <span class="icon-label">{{ $t('searchResults.fullInfo.tabs.companyDetails.data.details.texts.age' )}}</span>
        <span class="chunk-value-holder"> {{ companyData.ageOld }}</span>
      </span>

      <!-- employees -->
      <span v-if="companyData.employeesRange">
        <la svg-icon-name="user-friends-solid"/>
        <span class="icon-label">{{ $t('searchResults.fullInfo.tabs.companyDetails.data.details.texts.employees' )}}</span>
        <span class="chunk-value-holder">{{ companyData.employeesRange }}</span>
      </span>
    </span>
  </div>
</template>

<script lang="ts">
import CompanyDetail from "@/scripts/Entity/Job/CompanyDetail";

export default {
  name: "OfferFullInfoCompanyDetailData",
  props: {
    companyData: {
      type     : Object as unknown as CompanyDetail,
      required : true,
    },
  }
}
</script>

<style lang="scss" scoped>
.company-details {
  display: flex;
  justify-content: start;
  flex-direction: column;

  span {
    align-self: start;
  }

  .icon-label {
    margin-left: 10px;
    font-weight: bold;
  }

  .chunk-value-holder {
    @apply ml-2;
  }
}
</style>
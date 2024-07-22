<template>
  <span class="flex justify-center m-0 p-0">
  <!-- years old -->
    <span v-if="jobOffer.companyDetail.ageOld"
          class="company-detail-data-chunk"
    >
      <la svg-icon-name="birthday-cake-solid"
          :font-size="iconSizePx"
          v-tippy="{
          content   : $t('searchResults.singleCard.company.age'),
          placement : 'top'
        }"
      />
      <span class="chunk-text flex">
        <span class="align-self-end">
          {{ jobOffer.companyDetail.ageOld }}
        </span>
      </span>
    </span>

    <!-- employees -->
    <span v-if="jobOffer.companyDetail.employeesRange"
          class="company-detail-data-chunk"
    >
      <la svg-icon-name="user-friends-solid"
          :font-size="iconSizePx"
          v-tippy="{
          content   : $t('searchResults.singleCard.company.employees'),
          placement : 'top'
        }"
      />
      <span class="chunk-text">
        {{ jobOffer.companyDetail.employeesRange }}
      </span>
    </span>

    <!-- website -->
    <span v-if="companyWebsite"
          class="company-detail-data-chunk"
    >
      <a :href="companyWebsite"
         target="_blank"
         class="hover:opacity-50"
      >
          <la svg-icon-name="link-solid"
              :font-size="iconSizePx"
              v-tippy="{
              content   : $t('searchResults.singleCard.company.website'),
              placement : 'top'
            }"
          />
      </a>
    </span>

    <!-- linkedin profile -->
    <span v-if="linkedinWebsite"
          class="company-detail-data-chunk"
    >
      <a :href="linkedinWebsite"
         target="_blank"
         class="hover:opacity-50"
      >
        <la svg-icon-name="linkedin"
            :font-size="iconSizePx"
            v-tippy="{
            content   : $t('searchResults.singleCard.company.linkedin'),
            placement : 'top'
          }"
        />
      </a>
    </span>

    <Search :company-name="jobOffer.companyDetail.companyName"
            :icon-size-px="iconSizePx"
    />

  </span>

</template>

<script lang="ts">
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";
import {ComponentData}    from "@/scripts/Vue/Types/Components/types";

import Search      from "@/views/JobOffer/SearchResult/Details/Components/Cards/SingleCard/Search.vue";
import LineAwesome from "@/components/Ui/Icons/LineAwesome.vue";

import UrlService from "@/scripts/Core/Services/Url/UrlService";

export default {
  data(): ComponentData {
    return {
      iconSizePx: 40,
    }
  },
  name: "OfferSingleCardCompanyData",
  props: {
    jobOffer: {
      type: Object as unknown as JobOfferAnalyzed
    }
  },
  computed: {
    /**
     * @description get normalized company website
     */
    companyWebsite(): string | null {
      if (!this.jobOffer.companyDetail.websiteUrl) {
        return null;
      }
      return `//${UrlService.removeWwwAndProtocol(this.jobOffer.companyDetail.websiteUrl)}`;
    },
    /**
     * @description get normalized company LinkedIn url
     */
    linkedinWebsite(): string | null {
      if (!this.jobOffer.companyDetail.linkedinProfileUrl) {
        return null;
      }
      return `//${UrlService.removeWwwAndProtocol(this.jobOffer.companyDetail.linkedinProfileUrl)}`;
    }
  },
  components: {
    Search,
    "la" : LineAwesome,
  }
}
</script>

<style lang="scss" scoped>
.company-detail-data-chunk {
  @apply ml-2 h-full inline-flex;
  .chunk-text {
    display: inline-block;
    align-self: self-end;
    font-size: 1rem;
    margin-left: 2px;
  }
}
</style>
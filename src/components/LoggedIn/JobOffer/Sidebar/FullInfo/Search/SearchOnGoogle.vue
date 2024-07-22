<template>
  <div
      class="search-on-google"
      v-if="companyData.companyName"
  >

    <div>
      <div class="text-center mb-8 text-lg border-l-0 border-r-0 border-t-0 border-b-2 border-gray-200">
        <p class="font-bold">{{ $t('searchResults.fullInfo.tabs.search.google.label') }}</p>
      </div>

    </div>

    <!-- Company website-->
    <a :href="homePageUrl"
       target="_blank"
       class="single-link"
    >
      <MediumButtonWithIcon
          :text="$t('searchResults.fullInfo.tabs.companyDetails.data.details.texts.homePage' )"
          button-classes="single-button"
      >
        <template #icon>
          <la
              svg-icon-name="link-solid"
              color="white"
          />
        </template>
      </MediumButtonWithIcon>
    </a>

    <!-- linkedin -->
    <a :href="linkedinUrl"
       target="_blank"
       class="single-link"
    >
      <MediumButtonWithIcon
          :text="$t('searchResults.fullInfo.tabs.companyDetails.data.details.texts.linkedin' )"
          button-classes="single-button"
      >
        <template #icon>
          <la
              svg-icon-name="linkedin"
              color="white"
          />
        </template>
      </MediumButtonWithIcon>
    </a>

  </div>
</template>

<script lang="ts">
import CompanyDetail from "@/scripts/Entity/Job/CompanyDetail";

import MediumButtonWithIcon from "@/components/Navigation/Button/MediumButtonWithIcon.vue";

import GoogleSearchService from "@/scripts/Core/Services/External/GoogleSearchService";

export default {
  props: {
    /** @var {CompanyDetail} */
    companyData: {
      type: Object as unknown as CompanyDetail,
      required: true,
    },
  },
  components: {
    MediumButtonWithIcon
  },
  computed: {
    /**
     * @description returns the url used for searching company on the Google
     */
    homePageUrl(): string {
      return GoogleSearchService.buildSearchLink(this.companyData.companyName);
    },
    /**
     * @description returns the url used for searching company linkedin profile on the Google
     */
    linkedinUrl(): string {
      return GoogleSearchService.buildSearchLink(this.companyData.companyName + " Linkedin");
    }
  }
}
</script>

<style lang="scss" scoped>
.single-link {
  + .single-link {
    @apply mt-3
  }

  @apply block
}

</style>

<style lang="scss">
.search-on-google {
  .single-button {
    min-width: 200px;
    @apply flex justify-center sm:w-auto sm:block w-full md:w-auto
  }
}
</style>
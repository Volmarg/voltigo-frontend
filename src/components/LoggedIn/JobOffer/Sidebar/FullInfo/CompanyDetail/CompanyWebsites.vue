<template>
  <div
      class="text-2md company-websites"
      v-if="hasAnyUrl"
  >
    <div class="widget w-full rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800">

      <div>
        <div class="text-center mb-8 text-lg border-l-0 border-r-0 border-t-0 border-b-2 border-gray-200">
          <p class="font-bold">{{ $t('searchResults.fullInfo.tabs.companyDetails.data.relatedWebsites.headers.relatedWebsites') }}</p>
        </div>

      </div>

      <!-- Company website-->
      <a :href="companyWebsite"
         v-if="companyData.websiteUrl"
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
      <a :href="linkedinWebsite"
         v-if="companyData.linkedinProfileUrl"
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
  </div>
</template>

<script lang="ts">
import CompanyDetail from "@/scripts/Entity/Job/CompanyDetail";

import StringTypeProcessor from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";
import UrlService          from "@/scripts/Core/Services/Url/UrlService";

import MediumButtonWithIcon from "@/components/Navigation/Button/MediumButtonWithIcon.vue";

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
     * @description check if there are any company related websites present at all
     */
    hasAnyUrl(): boolean {
      return (
              !StringTypeProcessor.isEmptyString(this.companyData.linkedinProfileUrl)
          ||  !StringTypeProcessor.isEmptyString(this.companyData.websiteUrl)
      )
    },
    /**
     * @description get normalized company website
     */
    companyWebsite(): string | null {
      return `//${UrlService.removeWwwAndProtocol(this.companyData.websiteUrl)}`;
    },
    /**
     * @description get normalized company LinkedIn url
     */
    linkedinWebsite(): string | null {
      return `//${UrlService.removeWwwAndProtocol(this.companyData.linkedinProfileUrl)}`;
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
.company-websites {
  .single-button {
    min-width: 200px;
    @apply flex justify-center sm:w-auto sm:block w-full md:w-auto
  }
}
</style>
<template>
  <div class="text-2md tab-job-offer-detail">

    <!-- Details -->
    <div class="widget w-full p-4 mb-4 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800">

      <div class="text-center mb-8 text-lg border-l-0 border-r-0 border-t-0 border-b-2 border-gray-200">
        <p class="font-bold">{{ $t('searchResults.fullInfo.tabs.offerDetails.data.details.headers.details') }}</p>
      </div>

      <div class="text-left">

        <!-- Offer url -->
        <div class="mb-1">
          <p class="break-all"><fa icon="globe" />{{ $t('searchResults.fullInfo.tabs.offerDetails.link.label') }}:
            <a  class="link opacity-100 hover:opacity-75 duration-300 transition-opacity"
                target="_blank"
                :href="jobOffer.jobOfferUrl">{{ jobOfferHost }}</a>
          </p>
        </div>

        <OfferData :job-offer="jobOffer"
                   top-information-classes="flex flex-col"
                   flag-classes="!w-auto"
                   human-languages-wrapper-classes="human-languages-wrapper"
                   human-languages-label-classes="human-languages-label"
        />

      <div
          class="mt-1 text-gray-700"
          v-if="jobOffer.jobPostedDateTime"
      >
        <fa :icon="['far', 'calendar-alt']"/>
        {{ $t('searchResults.singleCard.jobOfferPostedDateTime.postedAt') }}
        {{ jobOffer.jobPostedDateTime }}

        <span class="hidden lg:inline">
          ({{ countPostedAgoDays }}
          {{ $t('searchResults.singleCard.jobOfferPostedDateTime.postedDaysAgo') }})
        </span>
      </div>

      </div>

    </div>

    <!-- Description -->
    <div class="widget w-full p-4 mb-4 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800">

      <div class="text-center mb-8 text-lg border-l-0 border-r-0 border-t-0 border-b-2 border-gray-200">
        <p class="font-bold">{{ $t('searchResults.fullInfo.tabs.offerDetails.data.description.headers.description') }}</p>
      </div>

      <div class="description-block">
        <p v-html="fullDescription" class="text-left"></p>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";

import OfferData from "@/views/JobOffer/SearchResult/Details/Components/Cards/SingleCard/OfferData.vue";

import DateTimeProcessor from "@/scripts/Core/Services/TypesProcessors/DateTimeProcessor";

export default {
  name: "FullInfoTabJobOfferDetail",
  props: {
    jobOffer: {
      type     : Object as unknown as JobOfferAnalyzed,
      required : true,
    },
    fullDescription: {
      type     : String,
      required : true,
      default  : "",
    }
  },
  components: {
    OfferData
  },
  computed: {
    isAnySalarySet(): boolean {
      return (
            this.jobOffer.salary.salaryMin !== 0
        ||  this.jobOffer.salary.salaryMax !== 0
      );
    },
    jobOfferHost(): string {
      return new URL(this.jobOffer.jobOfferUrl).host;
    },
    /**
     * @description check how long ago was this offer posted
     */
    countPostedAgoDays(): number {
      return DateTimeProcessor.getDaysAgo(this.jobOffer.jobPostedDateTime);
    }
  },
}
</script>

<style lang="scss">
/**
  Scoped must be omitted as it won't style the description added via v-html here, also must be wrapped in main class
  else description etc. in small boxes also gets styled since it's the same content.
 */
.tab-job-offer-detail {
  .job-offer-tag-included, .job-offer-tag-included-mandatory {
    color: green;
    font-weight: bold;
    text-decoration:  underline;
  }

  .job-offer-tag-excluded {
    color: red;
    font-weight: bold;
    text-decoration:  underline;
  }
}
</style>

<style lang="scss">
@import '@/assets/scss/responsive.scss';

.tab-job-offer-detail {
  // This block defines how the offer description in side panel will look like
  .description-block {
    br {
      content: " ";
      @apply mt-2 mb-2 block
    }

    [class*="footer"], [id*="footer"] {
      @apply mt-6
    }

    a {
      @apply text-blue-800 underline
    }

    hr {
      @apply mb-2 mt-2
    }

    h1, h2, h3, h4, h5, h6 {
      @apply mb-4 mt-4 text-center font-bold
    }

    p {
      @apply mt-2
    }

    ul {
      li {
        @apply list-disc
      }

      @apply ml-6
    }
  }

  .human-languages-wrapper {
    @apply flex flex-row
  }

  .human-languages-label {
    width: auto;
    max-width: 175px;
    @apply text-gray-700
  }

  @media all and(max-width: $phoneBreakingPoint + 'px') {
    .human-languages-wrapper {
      @apply flex flex-col
    }
  }
}
</style>
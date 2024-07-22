<template>
  <div>
    <div class="align-self-baseline">

      <div
          class="top-information"
          :class="{
            [topInformationClasses]: true
          }"
      >

        <!-- Salary.ts info -->
        <p v-tippy="$t('searchResults.singleCard.salary.tippyContent')"
           class="w-auto inline-block align-self-baseline single-data-block"
           v-if="isSalaryVisible"
        >
          <fa icon="dollar-sign" class="text-green-600"/> {{ minSalary }} - {{ maxSalary }}
          <span v-if="this.jobOffer.salary.salaryAverage">
            ({{$t('searchResults.singleCard.salary.avg.label')}} {{ this.jobOffer.salary.salaryAverage }})
          </span>
        </p>

        <!-- Human languages mentioned -->
        <div
            :class="{
              [humanLanguagesWrapperClasses]: true
            }"
           v-if="hasHumanLanguages"
        >
          <div :class="{
            [humanLanguagesLabelClasses]: true
          }">
            <fa icon="microphone"/> <span>{{ $t('searchResults.singleCard.spokenLanguages.label') }}:</span>
          </div>
          <div class="flex justify-start">
            <div v-for="(humanLanguage, index) of jobOffer.humanLanguages"
               :key="index"
               class="inline-block"
               :class="{
                 [flagClasses]: true
               }"
               v-tippy="{content: `<span class='capitalize'>${humanLanguage}</span>`}"
            >
            <span
                v-if="!!getFlagCssForLanguage(humanLanguage)"
                :class="getFlagCssForLanguage(humanLanguage)"
                class="language-flag border-gray-100 border"
            />
            </div>
          </div>
        </div>

        <!-- Home office possible -->
        <p class="w-auto inline-block align-self-baseline single-data-block"
           v-if="jobOffer.remoteJobMentioned"
        >
          <fa icon="home"/>{{ $t('searchResults.singleCard.remoteWork.possibleRemoteWork') }}
        </p>

        <!-- Mail -->
        <p class="w-auto inline-block align-self-baseline break-all single-data-block"
           v-if="this.jobOffer.contactDetail.email"
           v-tippy="{content: emailSourceHoverText, placement : 'top'}"
        >
          <fa icon="envelope-open-text" />
          <a :href="`mailto:${jobOffer.contactDetail.email}`">{{ jobOffer.contactDetail.email }}</a>

          <fa :icon="emailSourceAwesomeIconName"
              class="ml-1"
              :class="{
                [emailSourceColorClass]: true,
              }"
          />
        </p>

        <!-- Phone -->
        <p class="w-auto inline-block align-self-baseline single-data-block"
           v-if="this.jobOffer.contactDetail.phoneNumber"
        >
          <fa icon="phone" /><a :href="`tel:${jobOffer.contactDetail.phoneNumber}`">{{ jobOffer.contactDetail.phoneNumber }}</a>
        </p>

      </div>

    </div>

  </div>
</template>

<script lang="ts">
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";

import FlagIconCss         from "@/scripts/Libs/FlagIconCss";
import ArrayTypeProcessor  from "@/scripts/Core/Services/TypesProcessors/ArrayTypeProcessor";
import StringTypeProcessor from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";

import EmailSourceMixin from "@/views/JobOffer/SearchResult/Details/Mixin/EmailSourceMixin.vue";

export default {
  props: {
    jobOffer: {
      type     : Object as unknown as JobOfferAnalyzed,
      required : true,
    },
    topInformationClasses: {
      type     : String,
      required : false,
      default  : 'flex flex-col lg:flex-row'
    },
    flagClasses: {
      type     : String,
      required : false,
      default  : ''
    },
    humanLanguagesWrapperClasses: {
      type     : String,
      required : false,
      default  : 'w-auto align-self-baseline flex justify-start md:flex-row pt-2 flex-wrap single-data-block'
    },
    humanLanguagesLabelClasses: {
      type     : String,
      required : false,
      default  : ''
    }
  },
  mixins: [
    EmailSourceMixin
  ],
  computed: {
    /**
     * @description decide if salary should be visible
     */
    isSalaryVisible(): boolean {
      return (
          !StringTypeProcessor.isEmptyString(this.jobOffer.salary.salaryMin)
          || !StringTypeProcessor.isEmptyString(this.jobOffer.salary.salaryMax)
          || !StringTypeProcessor.isEmptyString(this.jobOffer.salary.salaryAverage)
      )
    },
    /**
     * @description check if there are any human languages mentions found in the job offer
     */
    hasHumanLanguages(): boolean {
      if (!this.jobOffer.humanLanguages) {
        return false;
      }

      let filteredLanguages = Object.values(this.jobOffer.humanLanguages).filter(Boolean);
      return !ArrayTypeProcessor.isEmpty(filteredLanguages);
    },
    /**
     * @description will return string which represents the information about min salary
     */
    minSalary(): string {
      return (!StringTypeProcessor.isEmptyString(this.jobOffer.salary.salaryMin) ? this.jobOffer.salary.salaryMin : this.$t('searchResults.singleCard.salary.value.unknown'))
    },
    /**
     * @description will return string which represents the information about max salary
     */
    maxSalary(): string {
      return (!StringTypeProcessor.isEmptyString(this.jobOffer.salary.salaryMax) ? this.jobOffer.salary.salaryMax : this.$t('searchResults.singleCard.salary.value.unknown'))
    },
  },
  methods: {
    /**
     * @description will return flag css classes for given language (if supported)
     */
    getFlagCssForLanguage(language: string): string {
      let flagCss = FlagIconCss.getFlagCssForLanguage(language);
      if(null === flagCss){
        return "";
      }

      return flagCss;
    },
  }

}
</script>

<style lang="scss" scoped>
p {
  @apply pt-2;
}

.language-flag {
  @apply ml-2
}

.single-data-block {
  @apply mr-5
}
</style>
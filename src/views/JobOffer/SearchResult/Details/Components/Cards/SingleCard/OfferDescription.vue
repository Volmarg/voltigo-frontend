<template>
  <div class="mt-1 lg:break-normal break-all">
    <p v-html="shortJobOfferDescription"></p>
  </div>
</template>

<script lang="ts">
import {ComponentData}    from "@/scripts/Vue/Types/Components/types";
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";

import StringTypeProcessor from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";
import TextParser          from "@/scripts/Core/Services/Parser/TextParser";

import ResponsiveVarsMixin from "@/mixins/Responsive/ResponsiveVarsMixin.vue";

export default {
  data(): ComponentData {
    return {
      config: {
        jobOfferDescription: {
          short: {
            maxCharacters: 800,
            maxCharactersMobile: 400,
          }
        }
      }
    }
  },
  props: {
    jobOffer: {
      type     : Object as unknown as JobOfferAnalyzed,
      required : true,
    },
  },
  mixins: [
    ResponsiveVarsMixin
  ],
  computed: {
    /**
     * @description decide max characters used for the job description on the card,
     *              if it's smaller-screen devices then less characters will be displayed.
     */
    maxCharacters(): number {
      if (this.isTabletBreakingPoint) {
        return this.config.jobOfferDescription.short.maxCharactersMobile;
      }

      return this.config.jobOfferDescription.short.maxCharacters;
    },
    /**
     * @description will return reduced job offer description.
     *
     *              > WARNING < the doubled call to {@see buildShortDescription} is needed as sometimes the descriptions
     *              have tones of html tags on beginning so the reduced text would consist only of tags, which
     *              further leads to having no description at all.
     *
     *              If such case happens then second call is made as an attempt to get any description at all
     *
     *              > WARNING < do not try to optimise desc on backend. It's possible but the boxes will just look awful.
     *              In some cases it's just better to have job title displayed instead.
     */
    shortJobOfferDescription(): string {
      let originalShortened         = this.buildShortDescription(this.jobOffer.jobDescription);
      let originalShortenedStripped = TextParser.stripHtmlTags(originalShortened)

      if (
              this.isEmptyString(originalShortenedStripped)
          ||  originalShortenedStripped.length < (this.maxCharacters / 2)
      ) {
        let originalStripped     = TextParser.stripHtmlTags(this.jobOffer.jobDescription);
        let originalCleanedText  = originalStripped.replace(/[ ]{2,}/g, "");
        let originalStrippedDesc = this.buildShortDescription(originalCleanedText);

        return this.isEmptyString(originalStrippedDesc) ? this.jobOffer.jobTitle : originalStrippedDesc;
      }

      return originalShortenedStripped;
    },
  },
  methods: {
    /**
     * @description check if string is empty, but in terms of "dots" or "totally empty"
     */
    isEmptyString(targetString: string): boolean {
      return (
              StringTypeProcessor.isEmptyString(targetString)
          ||  targetString.trim() === StringTypeProcessor.DOTS
      );
    },
    /**
     * @description will build reduced job offer description
     */
    buildShortDescription(text: string): string {
      let reducedString = StringTypeProcessor.reduceStringToCharactersCount(text, this.maxCharacters);
      let removedBrTags = reducedString.replace(/<br>|<br\/>|<br \/>/g, "");

      return removedBrTags;
    }
  }
}
</script>
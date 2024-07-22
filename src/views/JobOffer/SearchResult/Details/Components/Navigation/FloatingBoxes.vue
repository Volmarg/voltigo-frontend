<template>
  <div>

    <!-- Apply now -->
    <FloatingBox class="mb-14 blink-animation"
                  :show-background="false"
    >
      <FullRoundButtonWithIcon
          :label="$t('searchResults.sendMailBox.infoText')"
          @click="$emit('showEmailWizardClicked')"
      >
        <template #icon>
          <fa icon="envelope-open-text"/>
        </template>
      </FullRoundButtonWithIcon>
    </FloatingBox>

    <!-- Selected job offers -->
    <FloatingBox :show-background="false"
    >
      <FullRoundButtonWithIcon
          :label="$t('searchResults.selectedJobOffersBox.infoText')"
          @click="$emit('showSelectedOffersPreviewClicked')"
      >
        <template #icon>
          {{ countOfSelectedOffers }}
        </template>
      </FullRoundButtonWithIcon>
    </FloatingBox>


  </div>
</template>

<script lang="ts">
import FloatingBox             from "@/components/Ui/Containers/FloatingBox.vue";
import FullRoundButtonWithIcon from "@/components/Navigation/Button/FullRoundButtonWithIcon.vue";

import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";

export default {
  props: {
    selectedOffers: {
      type     : Array as unknown as Array<JobOfferAnalyzed>,
      required : true,
    }
  },
  emits: [
    "show-selected-offers-preview-clicked",
    "show-email-wizard-clicked"
  ],
  components: {
    FloatingBox,
    FullRoundButtonWithIcon
  },
  computed: {
    /**
     * @description will return count of selected job offers
     */
    countOfSelectedOffers(): number {
      return this.selectedOffers.length;
    },
  }
}
</script>

<style lang="scss" scoped>
.blink-animation {
  animation: blink 4s infinite both;
}
</style>
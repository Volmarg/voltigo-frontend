<template>
  <div class="flex justify-center gap-2">
    <button class="btn btn-circle bg-transparent hover:bg-gray-200 text-gray-900 dark:text-white"
            v-tippy="$t('components.jobOfferEmailWizard.steps.navigation.left.tippyContent')"
            v-show="!isFirstStep"
            @click="$emit('previousStep')"
    >
      <DoubleArrowLeft
          :arrow-size="arrowSize"
          :arrow-color="color.blue"
      />
    </button>

    <div class="align-self-end font-bold step-data">
      <p
          class="text-gray-600"
          :class="{
            [stepFontSizeClass]: true
          }"
      >
        {{ $t('components.jobOfferEmailWizard.steps.navigation.step.label') }}: {{ stepNumber }} / {{ stepsCount }}
      </p>
    </div>

    <button class="btn btn-circle bg-transparent hover:bg-gray-200 text-gray-900 dark:text-white"
            v-tippy="$t('components.jobOfferEmailWizard.steps.navigation.right.tippyContent')"
            v-show="isCurrentStepValid && !isLastStep"
            @click="$emit('nextStep')"
    >
      <DoubleArrowRight
          :arrow-size="arrowSize"
          :arrow-color="color.blue"
      />
    </button>
  </div>
</template>

<script lang="ts">
import ResponsiveVarsMixin from "@/mixins/Responsive/ResponsiveVarsMixin.vue";
import Colors              from "@/scripts/Vue/Mixins/Colors.vue";

import DoubleArrowLeft   from "@/components/Ui/Icons/Svg/DoubleArrowLeft.vue";
import DoubleArrowRight  from "@/components/Ui/Icons/Svg/DoubleArrowRight.vue";

export default {
  props: {
    stepNumber: {
      type: Number,
      required: true,
    },
    stepsCount: {
      type: Number,
      required: true,
    },
    isFirstStep: {
      type: Boolean,
      required: true,
    },
    isCurrentStepValid: {
      type: Boolean,
      required: true,
    },
    isLastStep: {
      type: Boolean,
      required: true,
    },
  },
  emits: [
    "previousStep",
    "nextStep",
  ],
  mixins: [
    Colors,
    ResponsiveVarsMixin
  ],
  components: {
    DoubleArrowLeft,
    DoubleArrowRight,
  },
  computed: {
    /**
     * @description decide the step text font size class
     */
    stepFontSizeClass(): string {
      return (this.isPhoneBreakingPoint ? 'text-xl' : 'text-2md');
    },
    /**
     * @description decide the step navigation arrow size
     */
    arrowSize(): number {
      return (this.isPhoneBreakingPoint ? 37 : 27);
    }
  }
}
</script>

<style lang="scss" scoped>
.step-data {
  @apply mb-0.5 sm:mb-1
}

</style>
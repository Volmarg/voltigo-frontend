<template>
  <div class="flex justify-center flex-row">
    <div class="points-fee justify-center mt-2">
      <span class="text-blue-500 font-bold self-center">
        {{ amount }}
      </span>
      <span
          v-if="isMissingPoints"
          class="ml-1 text-red-500 font-bold self-center"
      >
        ({{ missingAmount }})
      </span>
      <img
          src="/public/image/system/gem/gem-32.png"
          class="ml-1"
          :class="{
            'hover:opacity-70 cursor-pointer': isGemClickable,
          }"
          @click="onGemClicked"
          v-tippy="gemHoverText"
      />
    </div>

    <QuestionMarkAbout
        v-if="aboutText"
        :text="aboutText"
        class="ml-1 self-center mt-2 z-9"
    />
  </div>
</template>

<script lang="ts">
import QuestionMarkAbout from "@/components/Ui/QuestionMarkAbout.vue";

export default {
  props: {
    amount: {
      type: Number,
      required: true,
    },
    isMissingPoints: {
      type: Boolean,
      required: true,
    },
    missingAmount: {
      type: Number,
      required: true
    },
    aboutText: {
      type: null, String,
      required: false,
      default: null,
    },
    isGemClickable: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  emits: [
    'gemClicked'
  ],
  components: {
    QuestionMarkAbout
  },
  computed: {
    /**
     * @description return the text shown as hover-text when hovering over gem icon, empty text prevents the popup to be shown
     */
    gemHoverText(): string {
      if (!this.isGemClickable) {
        return '';
      }

      return this.$t('payment.pointsFee.gemHover.text');
    }
  },
  methods: {
    /**
     * @description handler when gem is clicked
     *              - does nothing is gem is not clickable, otherwise passes the event to parent
     *
     */
    onGemClicked(): void {
      if (!this.isGemClickable) {
        return;
      }

      this.$emit('gemClicked');
    }
  }
}
</script>

<style lang="scss" scoped>
.points-fee {
  @apply flex flex-row
}
</style>
<template>
  <div class="grid grid-cols-12 lg:grid-cols-6">
    <div class="grid grid-cols-12 col-start-1 col-end-6 md:col-end-4 lg:col-start-1 lg:col-end-2">

      <div class="grid grid-rows-3">
        <QuestionMarkAbout :text="$t('filters.other.onlyNewOffers.helpText')"
                           class="row-start-2 z-9"
        />
      </div>

      <!-- usage of v-model:update is breaking the initial isActive emit, so skipped usage of it -->
      <ColoredSwitch :label="$t('filters.other.onlyNewOffers.label.value')"
                     v-model="isActive"
                     class="col-start-4 sm:col-start-3 col-end-12 text-left"
      />

    </div>
  </div>
</template>

<script lang="ts">

import QuestionMarkAbout from "@/components/Ui/QuestionMarkAbout.vue";
import ColoredSwitch     from "@/components/Ui/ColoredSwitch.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

export default {
  data(): ComponentData {
    return {
      isActive: false,
      isInitiallySet: false,
    }
  },
  props: {
    forcedOnlyNewOffers: {
      type     : Boolean,
      required : true,
    },
  },
  emits: [
    'toggleOnlyNewOffers'
  ],
  components: {
    QuestionMarkAbout,
    ColoredSwitch
  },
  updated(): void {
    if (!this.isInitiallySet) {
      this.isActive   = this.forcedOnlyNewOffers;
      this.isInitiallySet = true;
    }
  },
  watch: {
    forcedOnlyNewOffers(): void {
      this.isActive = this.forcedOnlyNewOffers;
    },
    isActive() : void {
      this.$emit('toggleOnlyNewOffers', this.isActive)
    }
  },
}
</script>
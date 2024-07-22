<template>
  <QuestionMarkAbout :text="contentElement ?? ''" />
  <div
      ref="tippyLegendContent"
      class="hidden"
  >
    <!-- recipient state -->
    <div>
      <b>{{ $t('legend.section.recipient.label') }}</b>
      <div>
        <fa
            icon="check"
            class="text-green-500"
        />
        <span class="font-bold">{{ $t('searchResults.singleCard.email.source.info.certain.label') }}</span> -
        <span>{{ $t('searchResults.singleCard.email.source.offer') }}</span>

      </div>

      <div>
        <fa
            icon="question"
            class="text-orange-500"
        />
        <span class="font-bold">{{ $t('searchResults.singleCard.email.source.info.uncertain.label') }}</span> -
        <span>{{ $t('searchResults.singleCard.email.source.other') }}</span>

      </div>
    </div>

    <!-- offers count-->
    <div
        v-if="isOfferCountResultVisible"
        class="mt-4"
    >

      <b>{{ $t('legend.section.offerCount.label') }}</b>

      <ul class="list-disc ml-6">
        <li><b>{{ $t('offersCount.filteredOut.short') }}: </b> {{ $t('offersCount.filteredOut.label') }}</li>
        <li><b>{{ $t('offersCount.visible.short') }}: </b> {{ $t('offersCount.visible.label') }}</li>
        <li><b>{{ $t('offersCount.totallyFound.short') }}: </b> {{ $t('offersCount.totallyFound.label') }}</li>
        <li><b>{{ $t('offersCount.applied.short') }}: </b> {{ $t('offersCount.applied.label') }}</li>
      </ul>
    </div>

  </div>
</template>

<script lang="ts">
import QuestionMarkAbout from "@/components/Ui/QuestionMarkAbout.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

export default {
  data(): ComponentData {
    return {
      contentElement: null as null | string,
    }
  },
  props: {
    isOfferCountResultVisible: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  components: {
    QuestionMarkAbout,
  },
  mounted() {
    this.contentElement = this.$refs.tippyLegendContent.innerHTML as string;
  }
}
</script>
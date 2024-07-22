<template>
  <div>
    <WarningBlock class="bg-white">
      <div class="text flex justify-center flex-col">
        <p class="font-bold text-orange-900 text-xl">
          <span v-if="!isDemo">
            {{ $t('jobOfferSearch.page.warning.service unavailable') }}
          </span>

          <span v-else>
            {{$t('demo.sectionInfo.header')}}
          </span>
        </p>

        <p class="font-bold text-orange-900 text-2md mt-3">
          <span v-if="!isDemo">
            {{ $t('jobOfferSearch.page.warning.quotaReached' )}}
          </span>

          <span v-else>
            {{$t('demo.sectionInfo.info')}}
          </span>
        </p>
      </div>
    </WarningBlock>
  </div>
</template>

<script lang="ts">

import WarningBlock from "@/components/Page/WarningBlock.vue";
import DemoAwareMixin from "@/mixins/Awarness/DemoAwareMixin.vue";

export default {
  components: {
    WarningBlock,
  },
  mixins: [
    DemoAwareMixin,
  ]
}
</script>
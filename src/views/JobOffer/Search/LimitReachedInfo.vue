<template>
  <div>

    <WarningBlock class="bg-white" v-if="isDemo">
      <div class="text flex justify-center flex-col">
        <p class="font-bold text-orange-900 text-xl">
          <span>{{$t('demo.sectionInfo.header')}}</span>
        </p>

        <p class="font-bold text-orange-900 text-2md mt-3">
          <span>{{$t('demo.sectionInfo.info')}}</span>
        </p>
      </div>
    </WarningBlock>

    <WarningBlock :text="$t('jobOfferSearch.page.limitReached')"
                  class="mb-5 bg-white text-gray-500 text-2md"
                  v-else
    />

  </div>
</template>

<script lang="ts">
import DemoAwareMixin from "@/mixins/Awarness/DemoAwareMixin.vue";

import WarningBlock    from "@/components/Page/WarningBlock.vue";
import {ComponentData} from "@/scripts/Vue/Types/Components/types";
import UserController  from "@/scripts/Core/Controller/UserController";

export default {
  data(): ComponentData {
    return {
      user: (new UserController).getLoggedInUserData(),
    }
  },
  components: {
    WarningBlock,
  },
  mixins: [
    DemoAwareMixin
  ]
}
</script>
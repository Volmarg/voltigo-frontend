<template>
  <div>

      <DescriptionBlock class="mb-5 bg-white text-gray-500 text-2md">
        <p class="text-left">
          <span class="font-bold">{{ $t('jobOfferSearch.page.maxCalls') }}</span>
          <span>{{ user.account.maxParallelJobSearches }}</span>
        </p>
        <p class="text-left">
          <span class="font-bold">{{ $t('jobOfferSearch.page.activeCalls') }}</span>
          <span>{{ activeCallsCount }}</span>
        </p>
      </DescriptionBlock>

  </div>
</template>

<script lang="ts">
import DescriptionBlock from "@/components/Page/InformationBlock.vue";
import {ComponentData}  from "@/scripts/Vue/Types/Components/types";
import UserController   from "@/scripts/Core/Controller/UserController";

export default {
  data(): ComponentData {
    return {
      user: (new UserController).getLoggedInUserData(),
    }
  },
  props: {
    activeCallsCount: {
      type     : Number,
      required : true,
    }
  },
  components: {
    DescriptionBlock,
  }
}
</script>
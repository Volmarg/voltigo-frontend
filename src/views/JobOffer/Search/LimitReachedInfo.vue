<template>
  <div>

    <WarningBlock :text="$t('jobOfferSearch.page.limitReached')"
                  class="mb-5 bg-white text-gray-500 text-2md"
    />

  </div>
</template>

<script lang="ts">
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
  }
}
</script>
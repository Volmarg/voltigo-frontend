<template>
  <div class="text-gray-500 mt-2 text-sm">
    <p class="font-bold text-center">{{ $t('applications.singleApplication.labels.offerSource') }}</p>
    <p class="text-center">{{ serviceData.name }}</p>
  </div>
</template>

<script lang="ts">
import JobServiceDataProvider, {ServiceData} from "@/scripts/Core/Services/Job/JobServiceDataProvider";

export default {
  props: {
    offerUrl: {
      type: String,
      required: true,
    }
  },
  computed: {
    /**
     * @description provide job offer source service data
     */
    serviceData(): ServiceData {
      return JobServiceDataProvider.getData(this.offerUrl);
    }
  }
}
</script>

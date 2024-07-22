<template>
  <div class="flex flex-row w-full items-center h-16 mb-4">
    <div class="flex flex-col">

      <div class="font-normal">{{ amountOfApplications }} {{ $t('components.topBar.strings.applications') }}</div>

    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "JobApplicationsToRow",
  props: {
    amountOfApplications: {
      type     : Number,
      required : true,
    }
  },
}
</script>
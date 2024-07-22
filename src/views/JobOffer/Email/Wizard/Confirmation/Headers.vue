<template>
  <div>

    <div class="text-left mt-4">

      <div class="text-lg">
        <span class="text-blue-500 font-extrabold">
          {{ $t('components.jobOfferEmailWizard.steps.confirmation.labels.selectedTemplate.label') }}:
        </span>

        <span class="block sm:inline">{{ emailTemplate.emailTemplateName }}</span>
      </div>


      <div class="text-lg mt-4 mb-4">
        <span class="text-blue-500 font-extrabold">
          {{ $t('legend.label') }}:
        </span>
        <Legend class="flex flex-col" />
      </div>

      <div class="text-lg mt-4 mb-4">
        <span class="text-blue-500 font-extrabold">
          {{ $t('components.jobOfferEmailWizard.steps.confirmation.labels.offers.label') }}:
        </span>
      </div>

    </div>

  </div>
</template>

<script lang="ts">
import EmailTemplate from "@/scripts/Entity/Email/EmailTemplate";

import Legend from "@/views/JobOffer/SearchResult/Details/Components/Legend.vue";

export default {
  props: {
    emailTemplate: {
      type     : Object as unknown as EmailTemplate,
      required : true,
    }
  },
  components: {
    Legend
  }
}
</script>
<template>
  <div>
    <h1 class="text-left hover:opacity-50 opacity-100 transition transition-opacity duration-300 single-bottom-option cursor-pointer text-blue-500 font-extrabold"
        @click="showPreview()"
        v-tippy="{
          content   : $t('searchResults.singleCard.options.preview'),
        }"
    >
      {{ jobOffer.jobTitle }}
    </h1>
  </div>
</template>

<script lang="ts">
import PreviewOfferMixin from "@/views/JobOffer/SearchResult/Details/Components/Cards/SingleCard/Mixin/PreviewOfferMixin.vue";

import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";
export default {
  mixins: [
    PreviewOfferMixin,
  ],
  props: {
    jobOffer: {
      type     : Object as unknown as JobOfferAnalyzed,
      required : true,
    },
  },
}
</script>
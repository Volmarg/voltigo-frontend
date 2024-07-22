<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import LocalStorageService from "@/scripts/Core/Services/Storage/LocalStorageService";

import TourAwareMixin from "@/mixins/Awarness/TourAwareMixin.vue";

export default {
  data(): ComponentData {
    return {
      tourName: LocalStorageService.TOUR_JOB_OFFER_SEARCH,
      searchTourSteps: [
        {
          target: '.important-information-accordion',
          header: {
            title: this.$t('tour.header'),
          },
          params: {
            enableScrolling: false
          },
          content: this.$t('tour.step.importantInformation.text')
        },
        {
          target: '.job-search-keywords-question-mark',
          header: {
            title: this.$t('tour.header'),
          },
          params: {
            enableScrolling: false
          },
          content: this.$t('tour.step.questionMark.text')
        },
        {
          target: '.submit-job-searching',
          header: {
            title: this.$t('tour.header'),
          },
          params: {
            enableScrolling: false
          },
          content: this.$t('tour.step.startSearching.text')
        },
      ]
    }
  },
  mixins: [
    TourAwareMixin,
  ]
}
</script>
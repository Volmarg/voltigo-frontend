<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import TourAwareMixin from "@/mixins/Awarness/TourAwareMixin.vue";

import LocalStorageService from "@/scripts/Core/Services/Storage/LocalStorageService";

/**
 * @description this tour is a fixed-in-place popup, that's because can't really pick selectors inside iframe
 *              but still kinda want to have small "click-through" guide on easy email
 */
export default {
  data(): ComponentData {
    return {
      tourName: LocalStorageService.TOUR_EMAIL_TEMPLATE_BUILDER,
      searchTourSteps: [
        {
          target: '.easy-email-modal .modal-header-label',
          header: {
            title: this.$t('builder.tour.header'),
          },
          params: {
            enableScrolling: false,
          },
          content: this.$t('builder.tour.step.leftSide.text'),
        },
        {
          target: '.easy-email-modal .modal-header-label',
          header: {
            title: this.$t('builder.tour.header'),
          },
          params: {
            enableScrolling: false,
          },
          content: this.$t('builder.tour.step.rightSide.text'),
        },
        {
          target: '.easy-email-modal .modal-header-label',
          header: {
            title: this.$t('builder.tour.header'),
          },
          params: {
            enableScrolling: false,
          },
          content: this.$t('builder.tour.step.center.text'),
        },
        {
          target: '.easy-email-modal .modal-header-label',
          header: {
            title: this.$t('builder.tour.header'),
          },
          params: {
            enableScrolling: false,
          },
          content: this.$t('builder.tour.step.topTooltip.text'),
        },
        {
          target: '.easy-email-modal .modal-header-label',
          header: {
            title: this.$t('builder.tour.header'),
          },
          params: {
            enableScrolling: false,
          },
          content: this.$t('builder.tour.step.finalWords.text'),
        },
      ]
    }
  },
  mixins: [
    TourAwareMixin,
  ]
}
</script>
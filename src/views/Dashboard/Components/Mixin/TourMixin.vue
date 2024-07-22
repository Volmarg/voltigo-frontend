<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import LocalStorageService from "@/scripts/Core/Services/Storage/LocalStorageService";
import TourAwareMixin      from "@/mixins/Awarness/TourAwareMixin.vue";

export default {
  data(): ComponentData {
    return {
      tourName: LocalStorageService.TOUR_DASHBOARD,
      searchTourSteps: [
        {
          target: '.founds-status-text, .founds-status-gem', // the gem selector is needed because the `text` is hidden on mobile
          header: {
            title: this.$t('homeDashboard.tour.header'),
          },
          params: {
            enableScrolling: false
          },
          content: this.$t('homeDashboard.tour.step.foundsStatus.text')
        },
        {
          target: '.user-menu-wrapper',
          header: {
            title: this.$t('homeDashboard.tour.header'),
          },
          params: {
            enableScrolling: false
          },
          content: this.$t('homeDashboard.tour.step.userMenu.text')
        },
      ]
    }
  },
  mixins: [
    TourAwareMixin,
  ]
}
</script>
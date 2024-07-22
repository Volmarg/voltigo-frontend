<script lang="ts">
import FullInfo        from "@/components/LoggedIn/JobOffer/Sidebar/FullInfo.vue";
import {ComponentData} from "@/scripts/Vue/Types/Components/types";
import SymfonyRoutes   from "@/router/SymfonyRoutes";
import {shallowRef}    from "vue";
import SymfonyJobOfferRoutes from "@/router/SymfonyRoutes/SymfonyJobOfferRoutes";
import GetFullDescription    from "@/scripts/Response/Job/Offer/GetFullDescription";

export default {
  data(): ComponentData {
    return {
      fullDescription: "",
    }
  },
  methods: {
    /**
     * @description will show the right sidebar with preview content
     */
    async showPreview(): Promise<void> {
      let loggedInUserViewRoot = this.$root.getLoggedInUserViewRef();
      let filterPanelValues    = loggedInUserViewRoot.$refs.filtersAccordion.$refs.filterPanel.getChildrenFiltersValues()
      this.fullDescription     = await this.getFullDescription(filterPanelValues);

      let componentInstance = shallowRef(FullInfo);
      this.$emit('showRightSidebar', {
        componentInstance  : componentInstance,
        componentPropsData : this.getPropertiesForFullInfoComponent,
        filterPanelValues  : filterPanelValues
      });
    },
    /**
     * @description returns the full description of an offer
     */
    async getFullDescription(filterPanelValues: Record<string | number, unknown>): Promise<string> {
      let calledUrl = SymfonyRoutes.buildUrl(
          SymfonyJobOfferRoutes.URL_GET_OFFER_FULL_DESCRIPTION,
          {
            [SymfonyJobOfferRoutes.URL_GET_OFFER_FULL_DESCRIPTION_OPTION_OFFER_ID]: this.jobOffer.identifier
          }
      )

      let data = {
        filterValues: filterPanelValues,
      }

      this.$rootEvent.showFullPageLoader();
      return this.$axios.postWithCsrf(calledUrl, data, false, {}, GetFullDescription).then( (response: GetFullDescription) => {
        this.$rootEvent.hideFullPageLoader();
        return response.description;
      })

    }
  },
  computed: {
    /**
     * @description will return props for the `FullInfo` component which shows more details
     */
    getPropertiesForFullInfoComponent(): Record<string, unknown> {
      return {
        jobOffer        : this.jobOffer,
        fullDescription : this.fullDescription,
      };
    }
  }
}
</script>
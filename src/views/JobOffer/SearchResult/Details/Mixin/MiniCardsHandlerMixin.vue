<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

/**
 * @description this handles the modal with mini cards (preview of selected offers)
 *              this was turned into mixin on purpose as the Detail.vue logic became
 *              to strictly bound with the mini cards, so refactoring this would take
 *              lot of time - instead the logic was simply extracted and moved to mixin
 */
export default {
  data(): ComponentData {
    return {
      miniCardsVisibleResults: [],
      miniCardsConfig: {
        pagination: {
          resultPerPage : 5,
          currentPage   : 1,
        }
      }
    }
  },
  methods: {
    /**
     * @description will filter the <MiniCard> results shown in <Modal>
     */
    filterShownMiniCardsOnPage(currentPage: number, countOfResultsPerPage: number): void {
      this.miniCardsConfig.pagination.currentPage = currentPage;
      this.miniCardsVisibleResults                = [];

      this.miniCardsVisibleResults = this.filterShownResultByPagination(currentPage, countOfResultsPerPage, this.selectedOffers);

      // mark selection checkbox
      let selectedIdentifiers = this.selectedOffers.map( (singleResult) => {
        return singleResult.identifier;
      });

      for(let visibleResult of this.miniCardsVisibleResults){
        visibleResult.isSelected = selectedIdentifiers.includes(visibleResult.identifier);
      }
    },
    /**
     * @description will handle the event when page number changes on pagination
     */
    onMiniCardPaginationPageNumberChange(currentPage: number, countOfResultsPerPage: number): void {
      this.miniCardsConfig.pagination.currentPage = currentPage;
      this.filterShownMiniCardsOnPage(currentPage, countOfResultsPerPage);
    },
  }
}
</script>
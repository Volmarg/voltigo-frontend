<script lang="ts">

import LocalStorageService from "@/scripts/Core/Services/Storage/LocalStorageService";
import UserController      from "@/scripts/Core/Controller/UserController";
import VueRouter           from "@/router/VueRouter";

/**
 * @description provides functionality for handling storing the offer selection, so it won't get wiped
 *              upon page refresh etc.
 */
export default {
  name: "OffersSelectionHandlerMixin",
  methods: {
    /**
     * @description will save the offer selection for search result in {@see LocalStorageService}
     */
    saveOffersSelection(): void {
      let offersIds = this.selectedOffers.map( (offer) => offer.identifier);
      LocalStorageService.set(this._buildStorageOffersSelectionKey(), JSON.stringify(offersIds));
    },
    /**
     * @description will load the offer selection for offers from {@see LocalStorageService} (if there is anything stored)
     */
    loadOffersSelection(): void {
      this.selectedOffers = [];
      if (!LocalStorageService.isSet(this._buildStorageOffersSelectionKey())) {
        return;
      }

      let offersSelectionArray = JSON.parse(LocalStorageService.get(this._buildStorageOffersSelectionKey()));
      for (let offer of this.searchFilteredOffers) {
        if (offersSelectionArray.includes(offer.identifier)) {
          offer.isSelected = true;
          this.selectedOffers.push(offer);
        }
      }

    },
    /**
     * @description if there are any offer selection stored inside {@see LocalStorageService} then it will be wiped
     */
    removeSavedOffersSelection(): void {
      LocalStorageService.remove(this._buildStorageOffersSelectionKey());
    },
    /**
     * @description build key used to handle the offer selection in {@see LocalStorageService}
     */
    _buildStorageOffersSelectionKey(): string {
      let userController = new UserController();
      return `${VueRouter.ROUTE_NAME_JOB_OFFER_SEARCH_RESULT_DETAILS}.${userController.getLoggedInUserData().userId}.${this.$route.params.id}`;
    }
  }
}
</script>
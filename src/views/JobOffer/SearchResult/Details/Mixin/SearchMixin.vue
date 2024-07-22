<script lang="ts">
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";
import StringTypeProcessor from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";

export default {
  methods: {
    /**
     * @description will filter out the offers by the search field
     */
    filterShownOffersBySearch(offers: Array<JobOfferAnalyzed>): Array<JobOfferAnalyzed> {
      let filteredOffers = [] as Array<JobOfferAnalyzed>;
      for (let offer of offers) {
        if(
                StringTypeProcessor.isEmptyString(this.searchedString)
            ||  offer.jobTitle.toLowerCase().includes(this.searchedString.toLowerCase())
            ||  offer.jobDescription.toLowerCase().includes(this.searchedString.toLowerCase())
            ||  offer.companyDetail.companyName.toLowerCase().includes(this.searchedString.toLowerCase())
        ){
          filteredOffers.push(offer);
        }
      }

      return filteredOffers;
    }
  }
}
</script>
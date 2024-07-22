<script lang="ts">
import {JobSearchResult, SEARCH_RESULT_STATUS} from "@/scripts/Entity/Job/JobSearchResult";
import StringTypeProcessor                     from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";

export default {
  methods: {
    /**
     * @description check if search is still pending
     */
    isSearchPending(searchResult: JobSearchResult): boolean {
      return StringTypeProcessor.isEmptyString(searchResult.externalExtractionId) && !this.isSearchFailed(searchResult);
    },
    /**
     * @description check if search is still pending
     */
    isSearchWip(searchResult: JobSearchResult): boolean {
      let key = SEARCH_RESULT_STATUS[SEARCH_RESULT_STATUS.WIP];
      return (key === searchResult.status);
    },
    /**
     * @description check if search result is failed
     */
    isSearchFailed(searchResult: JobSearchResult): boolean {
      let failureKey = SEARCH_RESULT_STATUS[SEARCH_RESULT_STATUS.ERROR];
      return (failureKey === searchResult.status);
    },
    /**
     * @description check if search is done with success
     */
    isSearchSuccess(searchResult: JobSearchResult): boolean {
      return !this.isSearchFailed(searchResult) && !this.isSearchPending(searchResult);
    }
  }
}
</script>
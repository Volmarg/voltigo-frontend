<script lang="ts">
import SymfonyRoutes       from "@/router/SymfonyRoutes";
import SymfonyEmailRoutes  from "@/router/SymfonyRoutes/SymfonyEmailRoutes";
import GetTemplates        from "@/scripts/Response/Email/Template/GetTemplates";

export default {
  methods: {
    /**
     * @description will return all clone-able templates
     */
    async getCloneAbleTemplates(): Promise<Array<unknown>> {
      let calledUrl = SymfonyRoutes.buildUrl(SymfonyEmailRoutes.URL_GET_ALL_CLONE_ABLE);

      this.$rootEvent.showFullPageLoader();
      return await this.$axios.getWithCsrf(calledUrl, GetTemplates).then( (responseDto: GetTemplates) => {
        this.$rootEvent.hideFullPageLoader();
        return responseDto.templatesDataArray;
      })
    },
  }
}
</script>
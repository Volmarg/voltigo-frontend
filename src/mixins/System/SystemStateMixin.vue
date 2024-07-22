<script lang="ts">
import SymfonySystemRoutes   from "@/router/SymfonyRoutes/SymfonySystemRoutes";
import SymfonyRoutes         from "@/router/SymfonyRoutes";
import GetOffersHandlerState from "@/scripts/Response/System/State/CheckActiveJobSearchResponse";

export default {
  methods: {
    /**
     * @description will return the base state information about the offer handler (is it alive etc.)
     */
    async getOffersHandlerState(): Promise<GetOffersHandlerState> {

      let calledRoute = SymfonyRoutes.buildUrl(SymfonySystemRoutes.GET_OFFERS_HANDLER_STATE);
      return await this.$axios.getWithCsrf(calledRoute, GetOffersHandlerState).then((response: GetOffersHandlerState) => {
        return response;
      });

    }
  }
}
</script>

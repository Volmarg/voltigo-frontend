<script lang="ts">
import SymfonyRoutes                from "@/router/SymfonyRoutes";
import SymfonyUserRegulationsRoutes from "@/router/SymfonyRoutes/User/Regulation/SymfonyUserRegulationsRoutes";

import FailedBackendResponseHandler     from "@/scripts/Vue/Mixins/FailedBackendResponseHandler.vue";
import IsUserRegulationAcceptedResponse from "@/scripts/Response/User/IsUserRegulationAcceptedResponse";
import Base64Service                    from "@/scripts/Core/Services/Crypto/Base64Service";
import Md5Service                       from "@/scripts/Core/Services/Crypto/Md5Service";

export default {
  mixins: [
    FailedBackendResponseHandler,
  ],
  methods: {
    /**
     * @description will mark given user regulation as accepted
     */
    acceptUserRegulation(regulationIdentifier: string, regulationContent: string): Promise<boolean> {
      let content = Base64Service.utf8ToBase64(regulationContent);
      let url     = SymfonyRoutes.buildUrl(SymfonyUserRegulationsRoutes.URL_ACCEPT_REGULATION, {
        [SymfonyUserRegulationsRoutes.PARAM_REGULATION_IDENTIFIER] : regulationIdentifier,
        [SymfonyUserRegulationsRoutes.PARAM_HASH]                  : Md5Service.hash(content),
      });

      let data = {
        "regulationContentBase64": content
      }

      return this.$axios.postWithCsrf(url, {}, true, data).then((response) => {
        if (!response.success) {
          this.handleFailedBackendResponse(response, url);
          return false;
        }

        return true;
      })
    },
    /**
     * @description check if user has give regulation marked as accepted
     */
    isUserRegulationAccepted(regulationIdentifier: string): Promise<boolean> {
      let calledUrl = SymfonyRoutes.buildUrl(SymfonyUserRegulationsRoutes.URL_IS_REGULATION_ACCEPTED, {
        [SymfonyUserRegulationsRoutes.PARAM_REGULATION_IDENTIFIER]: regulationIdentifier
      });

      return this.$axios.getWithCsrf(calledUrl, IsUserRegulationAcceptedResponse).then((response: IsUserRegulationAcceptedResponse) => {
        if (!response.success) {
          this.handleFailedBackendResponse(response, calledUrl);
        }

        return response.accepted;
      })

    }
  }
}
</script>
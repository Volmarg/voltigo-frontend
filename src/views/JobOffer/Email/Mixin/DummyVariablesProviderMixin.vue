<script lang="ts">
import SymfonyRoutes      from "@/router/SymfonyRoutes";
import SymfonyEmailRoutes from "@/router/SymfonyRoutes/SymfonyEmailRoutes";
import GetEditorVariables from "@/scripts/Response/Email/Template/GetEditorVariables";
import LocalStorageService from "@/scripts/Core/Services/Storage/LocalStorageService";

export default {
  methods: {
    /**
     * @description returns the dummy offer data that is used for resolving the variables for example for email preview
     */
    async provideDummyVariables(): Promise<Array<number | string | boolean>> {

      if (LocalStorageService.isSet(LocalStorageService.EMAIL_TEMPLATE_EDITOR_DUMMY_VARIABLES)) {
        return new Promise((resolve) => {
          let variablesJson = LocalStorageService.get(LocalStorageService.EMAIL_TEMPLATE_EDITOR_DUMMY_VARIABLES);
          resolve(JSON.parse(variablesJson));
        })
      }

      let calledUrl = SymfonyRoutes.buildUrl(SymfonyEmailRoutes.URL_GET_TEMPLATE_DUMMY_VARIABLES);

      this.$rootEvent.showFullPageLoader();
      return this.$axios.getWithCsrf(calledUrl, GetEditorVariables).then((response: GetEditorVariables) => {
        this.$rootEvent.hideFullPageLoader();

        LocalStorageService.set(LocalStorageService.EMAIL_TEMPLATE_EDITOR_DUMMY_VARIABLES, JSON.stringify(response.variablesData));

        return response.variablesData;
      })
    }

  }
}
</script>
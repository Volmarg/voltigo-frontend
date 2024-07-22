<script lang="ts">
import EmailTemplate       from '../../../Entity/Email/EmailTemplate';
import SymfonyRoutes       from '../../../../router/SymfonyRoutes';
import SymfonyEmailRoutes  from '../../../../router/SymfonyRoutes/SymfonyEmailRoutes';
import GetTemplates from "@/scripts/Response/Email/Template/GetTemplates";

/**
 * @description provides logic for fetching Email Templates which belong to user
 */
export default {
  name: "EmailTemplatesProviderMixin",
  methods: {
    /**
     * @description will return all saved templates from backend
     */
    async getAllTemplates(): Promise<Array<EmailTemplate>> {
      let calledUrl = SymfonyRoutes.buildUrl(SymfonyEmailRoutes.URL_GET_ALL_FOR_USER);

      this.$rootEvent.showFullPageLoader();
      return await this.$axios.getWithCsrf(calledUrl, GetTemplates).then( (responseDto: GetTemplates) => {
        this.$rootEvent.hideFullPageLoader();
        return responseDto.templatesDataArray;
      })
    }
  }
}
</script>
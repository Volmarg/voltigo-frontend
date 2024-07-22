<script lang="ts">
import UniqidService from "@/scripts/Core/Services/Generator/UniqidService";
import Outgoing      from "@/scripts/Core/Services/EasyEmail/Event/Outgoing";

import EasyEmailCommunicationAwareMixin from "@/mixins/Awarness/EasyEmailCommunicationAwareMixin.vue";

/**
 * @description provides EasyEmail related logic that is shared in multiple places
 */
export default {
  methods: {
    /**
     * @see Outgoing.STORE_TEMPLATE_DATA
     */
    async sendTemplateDataToIframe(templateBody: string, sessionKey: string, variables: Record<string | number, string | number | boolean>): Promise<void> {
      this.dispatchEasyEmailEvent(
          Outgoing.STORE_TEMPLATE_DATA,
          {
            sessionKey : sessionKey,
            body       : templateBody,
            variables  : variables,
          }
      )

    },
    /**
     * @description the variables sent from here are used in the email builder to DISPLAY SELECTABLE VARIABLES
     *              for user, in here the variables WILL NOT be used to resolve the values, rather than
     *              building select of available template variables.
     *
     * @see Outgoing.STORE_DUMMY_TEMPLATE_VARIABLES
     */
    async sendTemplateDummyVariables(variables: Record<string | number, string | number | boolean>): Promise<void> {
      this.dispatchEasyEmailEvent(
          Outgoing.STORE_DUMMY_TEMPLATE_VARIABLES,
          {
            variables : variables,
          }
      )

    },
    /**
     * @description generates the identifier to be used to find the template in EasyEmail local storage
     *              (the data is first sent via {@see sendTemplateDataToIframe})
     */
    generateTemplateSessionKey(): string {
      return UniqidService.generate();
    }
  },
  mixins: [
    EasyEmailCommunicationAwareMixin
  ],
}
</script>
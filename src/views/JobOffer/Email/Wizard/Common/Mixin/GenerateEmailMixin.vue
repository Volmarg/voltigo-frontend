<script lang="ts">
import Outgoing  from "@/scripts/Core/Services/EasyEmail/Event/Outgoing";
import Incoming  from "@/scripts/Core/Services/EasyEmail/Event/Incoming";

import {ComponentData}          from "@/scripts/Vue/Types/Components/types";
import {EmailTemplateVariables} from "@/scripts/Core/Types/EmailTemplate";

import EasyEmailCommunicationAwareMixin from "@/mixins/Awarness/EasyEmailCommunicationAwareMixin.vue";

export default {
  data(): ComponentData {
    return {
      event: {
        renderEmails: {
          get  : Incoming.TEMPLATE_RENDERED,
        }
      }
    }
  },
  mixins: [
    EasyEmailCommunicationAwareMixin,
  ],
  methods: {
    sendRenderEmailRequest(templateData: string, variables: Record<string | number, string | number |boolean> | EmailTemplateVariables, trackingId?: string | number | undefined): void {

      this.dispatchEasyEmailEvent(
          Outgoing.RENDER_HTML_FOR_TEMPLATE,
          {
            body       : templateData,
            variables  : variables,
            trackingId : trackingId
          }
      )

    }
  }
}
</script>

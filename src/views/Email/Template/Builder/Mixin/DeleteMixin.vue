<script lang="ts">
import SymfonyEmailRoutes from "@/router/SymfonyRoutes/SymfonyEmailRoutes";
import {ToastTypeEnum}    from "@/scripts/Libs/ToastNotification";
import SymfonyRoutes      from "@/router/SymfonyRoutes";

export default {
  methods: {
    /**
     * @description handles removal of the template
     */
    async deleteTemplate(templateId: number): Promise<void> {
      let calledUrl = SymfonyRoutes.buildUrl(SymfonyEmailRoutes.URL_DELETE, {
        [SymfonyEmailRoutes.URL_DELETE_PARAMETER_ID]: templateId,
      });

      this.$rootEvent.showFullPageLoader();
      this.$axios.postWithCsrf(calledUrl).then( async (responseDto) => {
        this.$rootEvent.hideFullPageLoader();

        if (responseDto.success) {
          if (responseDto.isMessageSet()) {
            this.$rootEvent.showNotification(ToastTypeEnum.success, responseDto.message);
          }

          this.deleteTemplateOnFront(templateId);
          this.deletePredefinedTemplateOnFront(templateId);
          await this.checkEmailTemplateRestriction();
        }
      })
    },
    /**
     * @description handles removal of the template on front view
     */
    deleteTemplateOnFront(templateId: number): void {
      let foundTemplateIndex = null as null | string;
      for (let templateIndex in this.templates) {
        let template = this.templates[templateIndex];
        if (template.id === templateId) {
          foundTemplateIndex = templateIndex;
          break;
        }
      }

      if (null === foundTemplateIndex) {
        return;
      }

      this.templates.splice(foundTemplateIndex, 1);
    },
    /**
     * @description handles removal of the predefined template on front view
     */
    deletePredefinedTemplateOnFront(templateId: number): void {
      let foundTemplateIndex = null as null | string;
      for (let templateIndex in this.predefinedTemplates) {
        let template = this.predefinedTemplates[templateIndex];
        if (template.id === templateId) {
          foundTemplateIndex = templateIndex;
          break;
        }
      }

      if (null === foundTemplateIndex) {
        return;
      }

      this.predefinedTemplates.splice(foundTemplateIndex, 1);
    }
  }
}
</script>
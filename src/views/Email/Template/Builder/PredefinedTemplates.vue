<template>

  <Accordion v-if="templates.length !== 0">
    <AccordionPanel>

      <template #title>
        {{ $t('list.predefinedTemplates.header') }}
      </template>

      <template #content>

        <DescriptionBlock class="mb-5 bg-white text-gray-500 text-2md">
          <p class="text-left">
            <span v-html="$t('list.predefinedTemplates.info.text')"></span>
          </p>
        </DescriptionBlock>

        <WarningBlock class="mb-5 bg-white text-gray-500 text-2md text-left">
          <p v-html="$t('list.predefinedTemplates.warningAfterClone')"></p>
        </WarningBlock>

        <Container class="mb-4">

          <TemplatesList @clone-template="onCloneTemplate"
                         @edit-template="$emit('editTemplate', $event)"
                         @delete-template="$emit('deleteTemplate', $event)"
                         :templates="templates"
                         :can-clone="true"
                         :can-send-test="false"
                         :can-generate-pdf="false"
                         :can-edit="this.userController.isDeveloper()"
                         :can-remove="this.userController.isDeveloper()"
          />

        </Container>

      </template>
    </AccordionPanel>
  </Accordion>

</template>

<script lang="ts">
import Container        from "@/components/Ui/Containers/Container.vue";
import TemplatesList    from "@/views/Email/Template/Builder/TemplatesList.vue";
import AccordionPanel   from "@/components/Ui/Accordion/Panel.vue";
import Accordion        from "@/components/Ui/Accordion/Accordion.vue";
import DescriptionBlock from "@/components/Page/InformationBlock.vue";
import WarningBlock     from "@/components/Page/WarningBlock.vue";

import FailedBackendResponseHandler from "@/scripts/Vue/Mixins/FailedBackendResponseHandler.vue";

import {ComponentData}    from "@/scripts/Vue/Types/Components/types";
import SymfonyEmailRoutes from "@/router/SymfonyRoutes/SymfonyEmailRoutes";
import SymfonyRoutes      from "@/router/SymfonyRoutes";
import {ToastTypeEnum}    from "@/scripts/Libs/ToastNotification";
import UserController     from "@/scripts/Core/Controller/UserController";

export default {
  data(): ComponentData {
    return {
      userController: new UserController(),
    }
  },
  props: {
    templates: {
      type     : Array,
      required : true,
    },
  },
  components: {
    WarningBlock,
    DescriptionBlock,
    Accordion,
    AccordionPanel,
    TemplatesList,
    Container
  },
  mixins: [
    FailedBackendResponseHandler
  ],
  emits: [
    "templateCloned",
    "editTemplate",
    "deleteTemplate",
  ],
  methods: {
    /**
     * @description handles template cloning
     *              - copy template and assign the copy to logged-in user,
     */
    onCloneTemplate(templateId: number): void {
      let calledUrl = SymfonyRoutes.buildUrl(SymfonyEmailRoutes.URL_CLONE_TEMPLATE, {
        [SymfonyEmailRoutes.URL_CLONE_TEMPLATE_PARAM_ID]: templateId
      });

      this.$rootEvent.showFullPageLoader();
      this.$axios.getWithCsrf(calledUrl).then( async (response) => {
        this.$rootEvent.hideFullPageLoader();

        if (!response.success) {
          this.handleFailedBackendResponse(response, calledUrl);
          return;
        }

        if (response.isMessageSet()) {
          this.$rootEvent.showNotification(ToastTypeEnum.success, response.message);
        }

        this.$emit('templateCloned');
      })

    }
  }
}
</script>
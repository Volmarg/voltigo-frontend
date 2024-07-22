<template>
  <div>

    <h1 class="text-blue-500 font-extrabold text-center job-detail-title mb-4 header">
      {{ $t('components.jobOfferEmailWizard.steps.selectTemplate.header') }}
    </h1>

    <hr/>

    <div class="gap-4 mb-4 mt-4 sm:m-4 divide-x divide-gray-200 template-n-preview-grid">

      <!-- Templates list -->
      <div>

        <div
            v-if="emailTemplates.length === 0"
            class="text-xl justify-center flex mt-10"
        >
          <div>
            <p class="flex justify-center">{{ $t('components.jobOfferEmailWizard.steps.selectTemplate.noTemplate.needToCreateFirst' )}}</p>
            <p>
              {{ $t('components.jobOfferEmailWizard.steps.selectTemplate.noTemplate.goToTemplateBuilder' )}}
              <router-link
                  @click="$emit('close-modal'); windowService.scrollToTop()"
                  :to="routeLink.emailsTemplateBuilder"
                  class="ml-1 text-blue-500 hover:opacity-70"
              >
                {{ $t('components.jobOfferEmailWizard.steps.selectTemplate.partial.byClickingHere') }}
              </router-link>
            </p>
          </div>
        </div>

        <selectable-list :list-elements="emailTemplates"
                         element-property-name-used-as-label="emailTemplateName"
                         @clicked-element="onClickedTemplate"
        />
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import StepInterfaceMixin     from "@/views/JobOffer/Email/Wizard/StepInterfaceMixin.vue";
import TemplatesProviderMixin from "@/scripts/Vue/Mixins/Email/TemplatesProviderMixin.vue";

import SelectableList from "@/components/Ui/List/SelectableList.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";
import EmailTemplate   from "@/scripts/Entity/Email/EmailTemplate";

import StringTypeProcessor from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";
import WindowService       from "@/scripts/Core/Services/WindowService";
import VueRouter           from "@/router/VueRouter";

/**
 * @description in this step user selects the template from list of his own defined templates and checks how the defined
 *              template looks like (not parsed)
 */
export default {
  name: "JobOfferEmailWizardStepSelectTemplate",
  data(): ComponentData {
    return {
      routeLink: {
        emailsTemplateBuilder: VueRouter.ROUTE_PATH_EMAIL_TEMPLATE_BUILDER
      },
      selectedTemplateId: null,
      pickedTemplateIndex: null, // not using `selected` due to mixin possible overlap
      emailTemplates: [],
      windowService: WindowService,
      stepName: 'selectTemplate',
    };
  },
  props: {
    reFetchEmailTemplates: {
      type     : Boolean,
      required : true,
    }
  },
  mixins: [
    StepInterfaceMixin,
    TemplatesProviderMixin,
  ],
  components: {
    "selectable-list" : SelectableList,
  },
  emits: [
    'closeModal',
    'templateSelected',
    'templatesReFetched',
  ],
  methods: {
    /**
     * @description handles user click on template on list
     */
    onClickedTemplate(templateIndexInArray: number): void {
      this.pickedTemplateIndex = templateIndexInArray;
      let template             = this.emailTemplates[this.pickedTemplateIndex] as EmailTemplate;
      this.selectedTemplateId  = template.id;
      this.$emit('templateSelected', template);
    },
    /**
     * @description check if the step state is valid
     */
    isValid(): boolean {
      return !StringTypeProcessor.isEmptyString(this.selectedTemplateId);
    }
  },
  async created(): Promise<void> {
    this.emailTemplates = await this.getAllTemplates();
  },
  watch: {
    selectedTemplateId(): void {
      this.$emit('stepValidated', this.isValid());
    },
    async reFetchEmailTemplates(doFetch: boolean): Promise<void> {
      if (doFetch) {
        this.emailTemplates = await this.getAllTemplates();
        this.$emit('templatesReFetched');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// defines proportions between left and right side
.template-n-preview-grid {
  grid-template-columns: 65% 35%;
}
</style>
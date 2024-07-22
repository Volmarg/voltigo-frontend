<template>
  <div>

    <!-- these are the steps with arrows to go back and forth -->
    <StepNavigation
        @previous-step="previousStep()"
        @next-step="nextStep()"
        :is-first-step="isFirstStep"
        :is-current-step-valid="isCurrentStepValid"
        :is-last-step="isLastStep"
        :step-number="selectedStepNumber ?? 0"
        :steps-count="stepsCount"
    />

    <div class="wizard-body">
      <step-select-template :ref="steps.selectTemplate"
                            :re-fetch-email-templates="forceReFetchEmailTemplates"
                            @templates-re-fetched="forceReFetchEmailTemplates = false"
                            @template-selected="onTemplateSelected"
                            @step-validated="onStepValidate"
                            @close-modal="$emit('close-modal')"
                            v-show="currentStep === steps.selectTemplate"
      />

      <step-preview-template :job-offer="jobOffer"
                             :template="selectedTemplate"
                             :ref="steps.previewTemplate"
                             :is-visible="currentStep === steps.previewTemplate"
                             @get-random-selected-job-offer="$emit('getRandomSelectedJobOffer')"
                             @step-validated="onStepValidate"
                             v-show="currentStep === steps.previewTemplate"
      />

      <StepSelectAttachments :ref="steps.selectAttachments"
                             @step-validated="onStepValidate"
                             v-show="currentStep === steps.selectAttachments"
                             @cv-attachment-selection-change="onCvAttachmentSelectionChange"
      />

      <step-confirmation :ref="steps.confirmation"
                         :selected-job-offers="selectedJobOffers"
                         :template="selectedTemplate"
                         :selected-cv="selectedAttachment.cv"
                         :is-right-sidebar-visible="isRightSidebarVisible"
                         :open-offer="openOffer"

                         @step-validated="onStepValidate"
                         @applications-sent="$emit('applicationsSent')"
                         @show-right-sidebar="onShowRightSidebar"
                         @template-has-changed="onConfirmationTemplateHasChanged"
                         v-show="currentStep === steps.confirmation"
                         @offer-selection-changed="onOfferSelectionChanged"
                         @points-fee-fetch-failure="$emit('pointsFeeFetchFailure')"
      />
    </div>

    <!-- these are the lined steps with names -->
    <div>
      <hr class="mt-4" />
      <Steps class="mt-4">
          <Step
              v-for="(stepName, index) in stepsOrder"
              :key="index"
              :step-number="(index + 1)"
              :is-active="currentStep === stepName"
              :is-last-step="isTargetStepLast(stepName)"
              :is-done="isTargetStepDone(stepName)"
              :label="$t(`components.jobOfferEmailWizard.steps.${stepName}.header`)"
              :can-navigate="canNavigateToTargetStep(stepName)"
              @click="goToStep(stepName)"
          />
      </Steps>
    </div>

    <!-- these are the steps with arrows to go back and forth -->
    <StepNavigation
        class="mt-4"
        @previous-step="previousStep()"
        @next-step="nextStep()"
        :is-first-step="isFirstStep"
        :is-current-step-valid="isCurrentStepValid"
        :is-last-step="isLastStep"
        :step-number="selectedStepNumber ?? 0"
        :steps-count="stepsCount"
    />

  </div>
</template>

<script lang="ts">
import TargetStepHandlerMixin from "@/views/JobOffer/Email/Wizard/Mixin/TargetStepHandlerMixin.vue";

import StepNavigation        from "@/views/JobOffer/Email/Wizard/Common/StepNavigation.vue";
import StepSelectAttachments from "@/views/JobOffer/Email/Wizard/StepSelectAttachments.vue";
import StepSelectTemplate    from "@/views/JobOffer/Email/Wizard/StepSelectTemplate.vue";
import StepPreviewTemplate   from "@/views/JobOffer/Email/Wizard/StepPreviewTemplate.vue";
import StepConfirmation      from "@/views/JobOffer/Email/Wizard/StepConfirmation.vue";

import {RightSidebarComponentData} from "@/scripts/Vue/Types/Components/Sidebar";
import {JobOfferAnalyzed}          from "@/scripts/Entity/Job/JobOfferAnalyzed";

import {ComponentData}    from "@/scripts/Vue/Types/Components/types";
import EmailTemplate      from "@/scripts/Entity/Email/EmailTemplate";
import ArrayTypeProcessor from "@/scripts/Core/Services/TypesProcessors/ArrayTypeProcessor";
import TypeChecker        from "@/scripts/Core/Services/Types/TypeChecker";
import UploadedFileDTO    from "@/scripts/Dto/File/UploadedFileDTO";

import Step       from "@/components/Navigation/Steps/Step.vue";
import Steps      from "@/components/Navigation/Steps/Steps.vue";

import BaseError from "@/scripts/Core/Error/BaseError";

/**
 * @description this component handles whole E-Mail sending logic for the job offers
 */
export default {
  name: "JobOfferEmailWizard",
  data(): ComponentData {
    return {
      steps: {
        previewTemplate   : "previewTemplate",
        selectTemplate    : "selectTemplate",
        selectAttachments : "selectAttachments",
        confirmation      : "confirmation",
      },
      stepsValidity: {} as Record<string, boolean>,
      visitedSteps: [] as Array<string>,
      forceReFetchEmailTemplates: false,
      currentStep: null,
      isCurrentStepValid: false,
      selectedTemplate: {},
      selectedAttachment: {
        cv: null,
      }
    };
  },
  components: {
    Steps,
    Step,
    "step-select-template"  : StepSelectTemplate,
    "step-preview-template" : StepPreviewTemplate,
    "step-confirmation"     : StepConfirmation,
    StepSelectAttachments,
    StepNavigation,
  },
  emits: [
    'getRandomSelectedJobOffer',
    'cardSelectionChanged',
    'applicationsSent',
    'showRightSidebar',
    'closeModal'
  ],
  mixins: [
    TargetStepHandlerMixin,
  ],
  props: {
    jobOffer: {
      type     : Object,
      required : true,
    },
    selectedJobOffers: {
      type     : Array,
      required : true,
    },
    isRightSidebarVisible: {
      type: Boolean,
      required: true,
    },
    openOffer: {
      type: [null, Number],
      required: true,
    },
  },
  computed: {
    /**
     * @description will return order of steps (shown steps order depends on this, same with next/back buttons logic)
     */
    stepsOrder(): Array<string> {
      return [
        this.steps.selectTemplate,
        this.steps.previewTemplate,
        this.steps.selectAttachments,
        this.steps.confirmation,
      ];
    },
    /**
     * @description returns the amount/count of defined steps
     */
    stepsCount(): number {
      return this.stepsOrder.length;
    },
    /**
     * @description will return array index for currently selected template from steps order
     */
    selectedStepIndex(): number | null {
      return ArrayTypeProcessor.findFirstByValue(this.currentStep, this.stepsOrder);
    },
    /**
     * @description will return array number of currently selected template from steps order
     *              adding +1 since indexes are starting from 0
     */
    selectedStepNumber(): number | null {
      let stepIndex = ArrayTypeProcessor.findFirstByValue(this.currentStep, this.stepsOrder) ;
      return ( TypeChecker.isNull(stepIndex) ? null : stepIndex as number + 1);
    },
    /**
     * @description will return first step name
     */
    getFirstDefinedStep(): string {
      return this.stepsOrder[0];
    },
    /**
     * @description check if this is the last step
     */
    isLastStep(): boolean {
      return this.selectedStepNumber == this.stepsCount;
    },
    /**
     * @description check if this is the first step
     */
    isFirstStep(): boolean {
      return this.selectedStepNumber == 1;
    }
  },
  methods: {
    /**
     * @description passes the event data further
     */
    onShowRightSidebar(eventData: RightSidebarComponentData, jobOffer: JobOfferAnalyzed): void {
      this.$emit('showRightSidebar', eventData, jobOffer);
    },
    /**
     * @description handler for when offer selection changes
     */
    onOfferSelectionChanged(data: Record<string, number | boolean>): void {
      this.$emit('cardSelectionChanged', data);
    },
    /**
     * @description handler for when cv attachment selection changes
     */
    onCvAttachmentSelectionChange(cv: UploadedFileDTO | null){
      this.selectedAttachment.cv = cv;
    },
    /**
     * @description handler for case when upon clicking confirm the E-Mail template has actually changed
     *              Will replace the old content of the template, and push it forward to update it also in parent
     */
    onConfirmationTemplateHasChanged(emailTemplate: EmailTemplate): void {
      this.selectedTemplate = emailTemplate;
      this.forceReFetchEmailTemplates = true;
    },
    /**
     * @description triggers logic when step gets validated
     */
    onStepValidate(isValid: boolean): void {
      this.isCurrentStepValid              = isValid;
      this.stepsValidity[this.currentStep] = isValid
    },
    /**
     * @description handles template selection
     */
    onTemplateSelected(selectedTemplate: EmailTemplate): void {
      this.selectedTemplate = selectedTemplate;
    },
    /**
     * @description move to target step IF possible
     */
    goToStep(targetStepName: string): void {
      if (!this.canNavigateToTargetStep(targetStepName)) {
        return;
      }

      this.currentStep = targetStepName;
      this.visitedSteps.push(this.currentStep);
      this.validateCurrentStep();
      this.scrollModalToTop();
    },
    /**
     * @description handles going to next step
     */
    nextStep(): void {
      if(
              this.isLastStep
          ||  !this.isCurrentStepValid // should not happen but just in case someone decides to manipulate dom
      ){
        return;
      }

      let nextStepArrayIndex = this.selectedStepIndex + 1;
      this.currentStep       = this.stepsOrder[nextStepArrayIndex];

      this.visitedSteps.push(this.currentStep);
      this.validateCurrentStep();
      this.scrollModalToTop();
    },
    /**
     * @description will scroll modal to top
     */
    scrollModalToTop() {
      let selector = '.application-wizard-modal .modal > div';
      let modalElement = document.querySelector(selector);
      if (modalElement) {
        this.$view.scrollContentOfElement(modalElement);
        return;
      }

      throw new BaseError(`Cannot scroll modal, no element was found for selector ${selector}`);
    },
    /**
     * @description handles going to previous step
     */
    previousStep(): void {
      if(this.isFirstStep){
        this.validateCurrentStep();
        return;
      }

      let previousStepArrayIndex = this.selectedStepIndex - 1;
      this.currentStep           = this.stepsOrder[previousStepArrayIndex];

      this.scrollModalToTop();
    },
    /**
     * @description will check if current step is valid
     */
    validateCurrentStep(): void {
      if(this.isLastStep){
        this.isCurrentStepValid = true;
        return;
      }

      let stepComponent       = this.$refs[this.currentStep];
      this.isCurrentStepValid = stepComponent.isValid();

      this.stepsValidity[this.currentStep] = this.isCurrentStepValid
    },
  },
  created(): void {
    this.currentStep = this.getFirstDefinedStep;
    this.visitedSteps.push(this.currentStep);
  },
  mounted(): void {
    this.validateCurrentStep();
  }
}
</script>

<style lang="scss" scoped>
.wizard-body {
  max-height: 75vh;
  min-height: 50vh;
  @apply overflow-y-scroll
}
</style>
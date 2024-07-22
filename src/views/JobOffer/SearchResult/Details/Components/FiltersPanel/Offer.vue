<template>
  <container class="mb-4 flex flex-col">

    <div class="text-left font-bold mb-2">
      {{ $t('filters.offer.label') }}
    </div>

    <div class="grid grid-rows-2 grid-cols-2 md:grid-rows-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8 lg:grid-rows-2 gap-y-10 text-left">
      <!-- include without posted date -->
      <colored-switch :label="$t('filters.includeWithoutPostedDate.label')"
                      v-model="includeWithoutPostedDate"
                      @update:modelValue="$emit('toggleIncludeWithoutPostedDate', includeWithoutPostedDate)"
      />

      <!-- must be remote -->
      <colored-switch :label="$t('filters.mustBeRemote.label')"
                      v-model="mustBeRemote"
                      @update:modelValue="$emit('toggleMustBeRemote', mustBeRemote)"
      />

      <!-- must have E-Mail -->
      <colored-switch :label="$t('filters.emailRequired.label')"
                      v-model="emailRequired"
                      @update:modelValue="$emit('toggleEmailRequired', emailRequired)"
      />

      <!-- must have phone -->
      <colored-switch :label="$t('filters.phoneRequired.label')"
                      v-model="phoneRequired"
                      @update:modelValue="$emit('togglePhoneRequired', phoneRequired)"
      />

      <!-- must have salary -->
      <colored-switch :label="$t('filters.salaryRequired.label')"
                      v-model="salaryRequired"
                      @update:modelValue="$emit('toggleSalaryRequired', salaryRequired)"
      />

      <!-- must have location -->
      <colored-switch :label="$t('filters.locationRequired.label')"
                      v-model="locationRequired"
                      @update:modelValue="$emit('toggleLocationRequired', locationRequired)"
      />

      <!-- must have speak language -->
      <colored-switch :label="$t('filters.speakLanguageRequired.label')"
                      v-model="speakLanguageRequired"
                      @update:modelValue="$emit('toggleSpeakLanguageRequired', speakLanguageRequired)"
      />

      <!-- is country name required -->
      <!-- this is disabled on purpose, the logic is already there on front and back but is not enabled due to geo tool not being launched on go-live (to expensive) -->
<!--      <colored-switch :label="$t('filters.countryNameRequired.label')"-->
<!--                      v-model="countryNameRequired"-->
<!--                      @update:modelValue="$emit('toggleSpeakLanguageRequired', speakLanguageRequired)"-->
<!--      />-->

      <!-- is employee count required -->
      <colored-switch :label="$t('filters.employeeCountRequired.label')"
                      v-model="employeeCountRequired"
                      @update:modelValue="$emit('toggleSpeakLanguageRequired', speakLanguageRequired)"
      />


      <!-- is age old required -->
      <colored-switch :label="$t('filters.ageRequired.label')"
                      v-model="ageRequired"
                      @update:modelValue="$emit('toggleSpeakLanguageRequired', speakLanguageRequired)"
      />

    </div>
  </container>
</template>

<script lang="ts">
import ColoredSwitch from "@/components/Ui/ColoredSwitch.vue";
import Container     from "@/components/Ui/Containers/Container.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

export default {
  name: "OffersFilterPanelOffer",
  data(): ComponentData {
    return {
      countryNameRequired: false,
      employeeCountRequired: false,
      ageRequired: false,
      speakLanguageRequired: false,
      locationRequired: false,
      salaryRequired: false,
      emailRequired: false,
      phoneRequired: false,
      mustBeRemote: false,
      includeWithoutPostedDate: true,
    }
  },
  props: {
    forcedSpeakLanguageRequired: {
      type     : Boolean,
      required : false,
      default  : false,
    },
    forcedLocationRequired: {
      type     : Boolean,
      required : false,
      default  : false,
    },
    forcedSalaryRequired: {
      type     : Boolean,
      required : false,
      default  : false,
    },
    forcedCountryNameRequired: {
      type     : Boolean,
      required : false,
      default  : false,
    },
    forcedEmployeeCountRequired: {
      type     : Boolean,
      required : false,
      default  : false,
    },
    forcedAgeRequired: {
      type     : Boolean,
      required : false,
      default  : false,
    },
    forcedEmailRequired: {
      type     : Boolean,
      required : false,
      default  : false,
    },
    forcedPhoneRequired: {
      type     : Boolean,
      required : false,
      default  : false,
    },
    forcedMustBeRemote: {
      type     : Boolean,
      required : false,
      default  : false,
    },
    forcedIncludeWithoutPostedDate: {
      type     : Boolean,
      required : false,
      default  : true,
    },
  },
  components: {
    "container"      : Container,
    "colored-switch" : ColoredSwitch,
  },
  methods: {
    /**
     * @default will return the filters state / values
     */
    getFilters(): Record<string, unknown> {
      return {
        speakLanguageRequired    : this.speakLanguageRequired,
        locationRequired         : this.locationRequired,
        salaryRequired           : this.salaryRequired,
        emailRequired            : this.emailRequired,
        phoneRequired            : this.phoneRequired,
        mustBeRemote             : this.mustBeRemote,
        includeWithoutPostedDate : this.includeWithoutPostedDate,
        countryNameRequired      : this.countryNameRequired,
        employeeCountRequired    : this.employeeCountRequired,
        ageRequired              : this.ageRequired,
      };
    },
  },
  watch: {
    forcedSpeakLanguageRequired() {
      this.speakLanguageRequired = this.forcedSpeakLanguageRequired;
    },
    forcedLocationRequired() {
      this.locationRequired = this.forcedLocationRequired;
    },
    forcedSalaryRequired() {
      this.salaryRequired = this.forcedSalaryRequired;
    },
    forcedEmailRequired() {
      this.emailRequired = this.forcedEmailRequired;
    },
    forcedPhoneRequired() {
      this.phoneRequired = this.forcedPhoneRequired;
    },
    forcedMustBeRemote() {
      this.mustBeRemote = this.forcedMustBeRemote;
    },
    forcedIncludeWithoutPostedDate() {
      this.includeWithoutPostedDate = this.forcedIncludeWithoutPostedDate;
    },
    forcedCountryNameRequired() {
      this.countryNameRequired = this.forcedCountryNameRequired;
    },
    forcedEmployeeCountRequired() {
      this.employeeCountRequired = this.forcedEmployeeCountRequired;
    },
    forcedAgeRequired() {
      this.ageRequired = this.forcedAgeRequired;
    },
  }
}
</script>

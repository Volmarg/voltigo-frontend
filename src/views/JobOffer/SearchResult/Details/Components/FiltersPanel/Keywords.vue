<template>
  <container class="mb-4">
    <div class="text-left font-bold mb-2">
      {{ $t('filters.keywords.label') }}
    </div>

    <div class="grid lg:grid-rows-2 gap-4 md:grid-rows-1 grid-cols-1 xl:grid-rows-1">

      <!-- Mandatory included keywords -->
      <div
          class="grid lg:grid-rows-1 lg:grid-cols-2 grid-rows-2 grid-cols-1 gap-4"
          :class="{
            'border-b b-2 border-gray-100': isLargeScreenBreakingPoint
          }"
      >
        <div class="keywords-n-question-mark-wrapper">
          <question-mark :text="$t('keywords.mandatoryIncludedKeywords.help')"
                         class="align-self-center question-mark"
          />

          <keywords ref="mandatoryIncludedKeywords"
                    :label="$t('keywords.mandatoryIncludedKeywords.label')"
                    v-model="mandatoryIncludedKeywords"
                    class="keywords-classes"
          />
        </div>

        <multi-select :options="keywordsFilterRuleOptions"
                      v-model="mandatoryIncludedKeywordsFilteringRule"
                      :label="$t('keywords.mandatoryIncludedKeywordsFilteringRule.label')"
                      :violations="violations.mandatoryIncludedKeywordsFilteringRule"
                      :is-full-height="false"
        />

      </div>

      <!-- excluded keywords -->
      <div class="grid lg:grid-rows-1 lg:grid-cols-2 grid-rows-2 grid-cols-1 gap-4 md:row-start-2 md:row-end-2 lg:row-start-1 lg:row-end-1">
        <div class="keywords-n-question-mark-wrapper">
          <question-mark :text="$t('keywords.mandatoryExcludedKeywords.help')"
                         class="align-self-center question-mark"
          />

          <keywords tag-classes="bg-red-500"
                    ref="excludedKeywords"
                    v-model="mandatoryExcludedKeywords"
                    :label="$t('keywords.mandatoryExcludedKeywords.label')"
                    class="keywords-classes"
          />
        </div>

        <multi-select :options="keywordsFilterRuleOptions"
                      v-model="mandatoryExcludedKeywordsFilteringRule"
                      :label="$t('keywords.mandatoryExcludedKeywordsFilteringRule.label')"
                      :violations="violations.mandatoryExcludedKeywordsFilteringRule"
                      :is-full-height="false"
        />

      </div>

    </div>

  </container>
</template>

<script lang="ts">
import QuestionMarkAbout    from "@/components/Ui/QuestionMarkAbout.vue";
import MultiSelect          from "@/components/Form/MultiSelect.vue";
import Container            from "@/components/Ui/Containers/Container.vue";
import Keywords             from "@/components/LoggedIn/JobOffer/Filters/Keywords.vue";

import {ComponentData}  from "@/scripts/Vue/Types/Components/types";
import {helpers}        from "@vuelidate/validators";
import VuelidateHandler from "@/scripts/Vue/Mixins/VuelidateHandler.vue";
import useVuelidate     from "@vuelidate/core";
import StringTypeProcessor from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";
import ArrayTypeProcessor  from "@/scripts/Core/Services/TypesProcessors/ArrayTypeProcessor";

import {KEYWORD_FILTERING_RULE} from "@/views/JobOffer/SearchResult/Details/Components/FiltersPanel/Enum/FilteringRuleEnum";

import ResponsiveVarsMixin from "@/mixins/Responsive/ResponsiveVarsMixin.vue";

/**
 * @description validator should target to return true (when it's valid)
 */
const includeKeywordsValidator = function() {
  if (!ArrayTypeProcessor.isEmpty(this.mandatoryIncludedKeywords) || !StringTypeProcessor.isEmptyString(this.mandatoryIncludedKeywordsFilteringRule)) {
    return !ArrayTypeProcessor.isEmpty(this.mandatoryIncludedKeywords) && !StringTypeProcessor.isEmptyString(this.mandatoryIncludedKeywordsFilteringRule);
  }

  return true;
}

/**
 * @description validator should target to return true (when it's valid)
 */
const excludeKeywordsValidator = function() {
  if (!ArrayTypeProcessor.isEmpty(this.mandatoryExcludedKeywords) || !StringTypeProcessor.isEmptyString(this.mandatoryExcludedKeywordsFilteringRule)) {
    return !ArrayTypeProcessor.isEmpty(this.mandatoryExcludedKeywords) && !StringTypeProcessor.isEmptyString(this.mandatoryExcludedKeywordsFilteringRule);
  }

  return true;
}

export default {
  name: "OffersFilterPanelOther",
  setup: (): Record<string, unknown> => ({ v$: useVuelidate() }),
  data(): ComponentData {
    return {
      mandatoryIncludedKeywordsFilteringRule: null,
      mandatoryExcludedKeywordsFilteringRule: null,
      mandatoryExcludedKeywords: [],
      mandatoryIncludedKeywords: [],
      violations: {
        mandatoryIncludedKeywordsFilteringRule: [],
        mandatoryExcludedKeywordsFilteringRule: [],
      }
    }
  },
  props: {
    forcedMandatoryIncludedKeywordsFilteringRule: {
      type     : [String, null],
      required : false,
      default  : null,
    },
    forcedMandatoryExcludedKeywordsFilteringRule: {
      type     : [String, null],
      required : false,
      default  : null,
    },
    forcedExcludedKeywords: {
      type     : Array,
      required : false,
      default  : () => {
        return [];
      }
    },
    forcedMandatoryIncludedKeywords: {
      type     : Array,
      required : false,
      default  : () => {
        return [];
      }
    },
  },
  validations(): Record<string, unknown>{
    return {
      mandatoryIncludedKeywordsFilteringRule: {
        includeKeywordsValidator: helpers.withMessage(this.$t('keywords.violations.keywordsAndRuleRequired'), includeKeywordsValidator),
      },
      mandatoryExcludedKeywordsFilteringRule: {
        excludeKeywordsValidator: helpers.withMessage(this.$t('keywords.violations.keywordsAndRuleRequired'), excludeKeywordsValidator),
      },
    }
  },
  mixins: [
    VuelidateHandler,
    ResponsiveVarsMixin
  ],
  components: {
    "keywords"      : Keywords,
    "container"     : Container,
    "multi-select"  : MultiSelect,
    "question-mark" : QuestionMarkAbout,
  },
  computed: {
    /**
     * @description will return options for keywords filter rules
     */
    keywordsFilterRuleOptions(): Array<Record<string, string>>{
      return [
        {
          label : this.$t('keywords.filterRules.all.label'),
          value : this.$t('keywords.filterRules.all.value'),
          description: this.$t('keywords.filterRules.all.description')
        },
        {
          label : this.$t('keywords.filterRules.atLeast.label'),
          value : this.$t('keywords.filterRules.atLeast.value'),
          description: this.$t('keywords.filterRules.atLeast.description')
        },
      ];
    }
  },
  methods: {
    /**
     * @default will return the filters state / values
     */
    getFilters(): Record<string, unknown> {
      return {
        // some filtering rule MUST be provided else the Symfony un-serializer fails on "enum not having such value" even to dto prop is nullable
        mandatoryIncludedKeywordsFilteringRule : this.mandatoryIncludedKeywordsFilteringRule ?? KEYWORD_FILTERING_RULE[KEYWORD_FILTERING_RULE.NONE],
        mandatoryExcludedKeywordsFilteringRule : this.mandatoryExcludedKeywordsFilteringRule ?? KEYWORD_FILTERING_RULE[KEYWORD_FILTERING_RULE.NONE],
        mandatoryExcludedKeywords              : this.mandatoryExcludedKeywords,
        mandatoryIncludedKeywords              : this.mandatoryIncludedKeywords,
      };
    },
    /**
     * @description check if all the validated data in this panel is valid
     */
    isValid(): boolean {
      this.v$.$validate();
      this.violations = this.vuelidateErrorsToArrayOfViolationsForProperties(this.v$.$errors);
      return this.isVuelidateResultValid;
    }
  },
  watch: {
    forcedMandatoryIncludedKeywordsFilteringRule() {
      this.mandatoryIncludedKeywordsFilteringRule = this.forcedMandatoryIncludedKeywordsFilteringRule;
    },
    forcedMandatoryExcludedKeywordsFilteringRule() {
      this.mandatoryExcludedKeywordsFilteringRule = this.forcedMandatoryExcludedKeywordsFilteringRule;
    },
    forcedExcludedKeywords() {
      this.mandatoryExcludedKeywords = this.forcedExcludedKeywords;
    },
    forcedMandatoryIncludedKeywords() {
      this.mandatoryIncludedKeywords = this.forcedMandatoryIncludedKeywords;
    },
  }
}
</script>

<style lang="scss" scoped>
@media screen and (min-width: 1024px) {
  .keyword-info-grid {
    grid-template-columns: 20px 1fr;
  }
}

.question-mark {
  @apply mb-4 col-span-12 flex justify-center lg:col-span-1 lg:block
}

.keywords-n-question-mark-wrapper {
  @apply w-full grid lg:grid-rows-1 lg:grid-cols-2 sm:grid-rows-2 sm:grid-cols-1 keyword-info-grid
}

.keywords-classes {
  @apply w-full lg:col-start-2 lg:col-end-13 col-start-1 col-end-13
}
</style>
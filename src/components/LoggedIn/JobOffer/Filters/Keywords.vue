<template>
  <multi-select mode="tags"
                :allow-create-options="true"
                @change="onMultiSelectChanged"
                @select="onMultiSelectChanged"
                @deselect="onMultiSelectChanged"
                @clear="onMultiSelectChanged"
                @paste="onMultiSelectChanged"
                :options="options"
                :tag-classes="tagClasses"
                :label="label"
                :required="required"
                :violations="violations"
                :max-options="maxOptions"
                :disabled="disabled"
                :ref="refName"
                v-model="keywords"
                :is-full-height="false"
                :show-count-in-label="true"
  />
</template>

<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";
import MultiSelect     from "@/components/Form/MultiSelect.vue";

import {ToastTypeEnum} from "@/scripts/Libs/ToastNotification";

/**
 * Info: In order to prefill the options when using `TAGS` mode, the values must be present in options.
 */
export default {
  name: "JobOfferFilterKeyword",
  data(): ComponentData {
    return {
      keywords: [],
      options : [],
      refName : 'keywordsMultiSelect',
      config: {
        maxKeywordCharactersLength: 30,
        maxKeywordWordsCount: 5,
      }
    }
  },
  props: {
    disabled: {
      type     : Boolean,
      required : false,
      default  : false,
    },
    maxOptions: {
      type     : Number,
      required : false,
      default  : -1,
    },
    violations: {
      type     : Array,
      required : false,
      default  : (): Array<void> => {
        return [];
      }
    },
    modelValue: {
      required: false,
    },
    tagClasses: {
      type     : [String, null],
      required : false,
      default  : null,
    },
    label: {
      type     : String,
      required : false,
      default  : "",
    },
    required: {
      type     : Boolean,
      required : false,
      default  : false
    },
  },
  components: {
    "multi-select": MultiSelect,
  },
  emits: [
    "change"
  ],
  methods: {
    /**
     * @description Will take the inserted keywords, validate them and filter out the incorrect ones.
     *              Shows information to user.
     *              Returns array of filtered out keywords.
     *
     *              Info: Tried using advanced props as mentioned in documentation "onTagCreate" etc.
     *              but none of these works.
     */
    validateAndFilterKeywords(): Array<string> {

      let acceptedKeywords = [] as Array<string>;
      for (let keyword of this.keywords) {
        if (keyword.length > this.config.maxKeywordCharactersLength) {
          let msg = this.$t('form.component.keywords.keywordToLong', {
            "length": this.config.maxKeywordCharactersLength
          });

          this.$rootEvent.showNotification(ToastTypeEnum[ToastTypeEnum.warning], msg);
          continue;
        }

        let wordsCount = keyword.split(" ").filter(Boolean).length;
        if (wordsCount > this.config.maxKeywordWordsCount) {
          let msg = this.$t('form.component.keywords.maxWords', {
            "count": this.config.maxKeywordWordsCount
          });

          this.$rootEvent.showNotification(ToastTypeEnum[ToastTypeEnum.warning], msg);
          continue;
        }

        acceptedKeywords.push(keyword);
      }

      return acceptedKeywords;
    },
    /**
     * @description handle multi select value being changed,
     *              assign value to keywords
     */
    onMultiSelectChanged(value: Array<string> | null): void {
      if (null === value) {
        this.keywords = [];
      } else {
        this.keywords = value;
      }

      this.keywords = this.validateAndFilterKeywords();
      this.$emit("update:modelValue", this.keywords);
    }
  },
  watch: {
    modelValue() {
      this.keywords = this.modelValue;
      this.options  = this.modelValue;
    }
  }
}
</script>
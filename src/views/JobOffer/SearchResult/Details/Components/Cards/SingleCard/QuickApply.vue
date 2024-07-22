<template>

  <div class="bottom-left-options flex">

    <span class="single-bottom-option cursor-not-allowed">
      <Checkbox v-if="jobOffer.contactDetail.email"
                v-tippy="$t('searchResults.singleCard.options.selectForApplication.allowed')"
                v-model="isSelected"
                @change="onChange"
      />

      <NoMailSvg v-else
                 v-tippy="$t('searchResults.singleCard.options.selectForApplication.notAllowed')"
      />

    </span>

    <p class="ml-1 mt-1">{{ $t('searchResults.singleCard.apply.label') }}</p>
  </div>

</template>

<script lang="ts">
import NoMailSvg from "@/components/Ui/Icons/Svg/NoMail.vue";

import Checkbox           from "@/components/Form/Checkbox.vue";
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";
import {ComponentData}    from "@/scripts/Vue/Types/Components/types";
import {ToastTypeEnum}    from "@/scripts/Libs/ToastNotification";

export default {
  data(): ComponentData {
    return {
      isSelected: null,
    }
  },
  props: {
    jobOffer: {
      type     : Object as unknown as JobOfferAnalyzed,
      required : true,
    },
    isInitiallySelected: {
      type    : Boolean,
      default : false,
    },
  },
  emits: [
    'cardSelectionChanged'
  ],
  components: {
    NoMailSvg,
    Checkbox
  },
  methods: {
    /**
     * @description handler for when the checkbox state changes
     */
    onChange(): void {
      let actionType = (this.isSelected ? 'added' : 'removed');
      this.$rootEvent.showNotification(ToastTypeEnum.info, this.$t(`searchResults.singleCard.options.selectForApplication.${actionType}`));

      this.$emit('cardSelectionChanged', this.jobOffer.identifier, this.isSelected)
    }
  },
  created(): void {
    this.isSelected = this.isInitiallySelected;
  },
  watch: {
    isInitiallySelected(): void {
      this.isSelected = this.isInitiallySelected;
    }
  }
}
</script>
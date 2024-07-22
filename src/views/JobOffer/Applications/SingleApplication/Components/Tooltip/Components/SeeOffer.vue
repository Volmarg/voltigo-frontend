<template>
  <a class="align-self-center hover:opacity-50 cursor-pointer w-full sm:w-auto"
     :content="$t('applications.singleApplication.hoverText.goToJob')"
     :href="offerUrl"
     target="_blank"
     v-tippy="{placement: 'top'}"
  >
    <MediumButtonWithIcon :text="$t('applications.singleApplication.labels.goToOffer')"
                          button-classes="w-full sm:w-auto flex justify-center"
    >
      <template #icon>
        <fa
            icon="share-square"
            :class="{
            'text-lg': isPhoneBreakingPoint
          }"
        />
      </template>
    </MediumButtonWithIcon>
  </a>
</template>

<script lang="ts">
import MediumButtonWithIcon from "@/components/Navigation/Button/MediumButtonWithIcon.vue";

import ResponsiveVarsMixin from "@/mixins/Responsive/ResponsiveVarsMixin.vue";

export default {
  props: {
    offerUrl: {
      type     : String,
      required : true,
    }
  },
  components: {
    MediumButtonWithIcon
  },
  mixins: [
    ResponsiveVarsMixin
  ]
}
</script>

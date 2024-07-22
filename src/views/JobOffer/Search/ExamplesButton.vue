<template>
  <MediumButtonWithIcon
      :text="$t('jobOfferSearch.page.buttons.examples.label')"
      button-classes="w-full md:w-auto flex justify-center"
      @button-click="$emit('buttonClick')"
      class="mt-5 mb-5"
      text-classes="text-center"
  />
</template>

<script lang="ts">
import MediumButtonWithIcon from "@/components/Navigation/Button/MediumButtonWithIcon.vue";

export default {
  emits: [
    "buttonClick"
  ],
  components: {
    MediumButtonWithIcon
  }
}

</script>


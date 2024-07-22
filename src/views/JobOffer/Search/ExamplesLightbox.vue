<template>
  <Lightbox
      :force-is-visible="forceIsVisible"
      @hide="$emit('hide')"
      :images="lightboxImages"
   />
</template>

<script lang="ts">
import Lightbox from "@/components/Ui/Lightbox/Lightbox.vue";

export default {
  props: {
    forceIsVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  emits: [
    "hide"
  ],
  components: {
    Lightbox
  },
  computed: {
    /**
     * @description images to display in lightbox
     */
    lightboxImages(): Array<string> {
      return [
        '/src/assets/img/job-search/examples/france-mobile.png',
        '/src/assets/img/job-search/examples/poland-mobile.png',
        '/src/assets/img/job-search/examples/spain-mobile.png',
      ];
    }
  }
}
</script>

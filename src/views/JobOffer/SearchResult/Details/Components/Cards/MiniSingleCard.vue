<template>
  <container class="mb-3 shadow-md b-1 border-blue-500 text-blue-500 font-bold text-sm"
             :class="{
               'hover:opacity-75 cursor-pointer border-opacity-60': isClickable,
               'not-open'                                         : !isOpen && isRightSidebarVisible,
             }"
             @click="showPreview()"
             v-tippy="hoverText"
  >
    <slot></slot>
  </container>
</template>

<script lang="ts">
import Container         from "@/components/Ui/Containers/Container.vue";
import PreviewOfferMixin from "@/views/JobOffer/SearchResult/Details/Components/Cards/SingleCard/Mixin/PreviewOfferMixin.vue";

export default {
  name: "MiniSingleCard",
  components: {
    'container' : Container,
  },
  props: {
    jobOffer: {
      type     : Object,
      required : true,
    },
    isClickable: {
      type     : Boolean,
      required : false,
      default  : true,
    },
    isRightSidebarVisible: {
      type: Boolean,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  mixins: [
    PreviewOfferMixin,
  ],
  computed: {
    /**
     * @description will return text shown when hovering over the box
     *              returning empty text prevents the text from being shown
     */
    hoverText(): string {
      return (this.isClickable ? this.$t('components.jobOfferSelectedOffersPreview.miniCard.preview.tippy.info.text') : "");
    }
  },
}
</script>

<style lang="scss" scoped>
.not-open {
  filter: grayscale(1) blur(2px);
  @apply bg-gray-50
}
</style>
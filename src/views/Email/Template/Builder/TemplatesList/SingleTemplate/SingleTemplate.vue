<template>
  <div class="max-w-sm bg-white px-6 pt-6 pb-2 rounded-xl shadow-lg transform hover:scale-105 transition duration-500 flex flex-col justify-around">

    <Image :template="template"
    />

    <h1 class="mt-4 font-bold cursor-pointer template-name">{{ template.emailTemplateName }}</h1>

    <Buttons @edit-clicked="$emit('editClicked')"
             @delete-clicked="$emit('deleteClicked')"
             @clone-clicked="$emit('cloneClicked')"
             @send-test-clicked="$emit('sendTestClicked')"
             @generate-pdf="$emit('generatePdf')"
             :can-generate-pdf="canGeneratePdf"
             :can-clone="canClone"
             :can-edit="canEdit"
             :can-remove="canRemove"
             :can-send-test="canSendTest"
             :template="template"
    />

  </div>
</template>

<script lang="ts">
import Buttons from "@/views/Email/Template/Builder/TemplatesList/SingleTemplate/components/Buttons.vue";
import Image   from "@/views/Email/Template/Builder/TemplatesList/SingleTemplate/components/Image.vue";

/**
 * {@link https://tailwindcomponents.com/component/post-card-course-online}
 */
export default {
  name: "TemplateBuilderSingleTemplate",
  props: {
    template: {
      type     : Object,
      required : true,
    },
    canGeneratePdf: {
      type: Boolean,
      required: false,
      default: true,
    },
    canEdit: {
      type: Boolean,
      required: false,
      default: true,
    },
    canRemove: {
      type: Boolean,
      required: false,
      default: true,
    },
    canClone: {
      type: Boolean,
      required: false,
      default: false,
    },
    canSendTest: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  emits: [
    'editClicked',
    'deleteClicked',
    'cloneClicked',
    'generatePdf',
    'sendTestClicked'
  ],
  components: {
    Buttons,
    Image,
  }
}
</script>

<style lang="scss" scoped>
.email-template-card-image {
  max-height: 300px;
}

.template-name {
  @apply normal-case text-gray-800
}
</style>
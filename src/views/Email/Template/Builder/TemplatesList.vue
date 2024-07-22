<template>
  <div class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
    <div v-for="(template, index) in templates"
         :key="index"
         class="flex justify-center"
    >
      <SingleTemplate :template="template"
                      :can-clone="canClone"
                      :can-remove="canRemove"
                      :can-edit="canEdit"
                      :can-generate-pdf="canGeneratePdf"
                      :can-send-test="canSendTest"
                      @edit-clicked="$emit('editTemplate', template.id)"
                      @delete-clicked="$emit('deleteTemplate', template.id)"
                      @clone-clicked="$emit('cloneTemplate', template.id)"
                      @generate-pdf="$emit('generatePdf', template.id)"
                      @send-test-clicked="$emit('sendTest', template.id)"
                      class="mt-6"
      />
    </div>
  </div>
</template>

<script lang="ts">
import SingleTemplate from "@/views/Email/Template/Builder/TemplatesList/SingleTemplate/SingleTemplate.vue";

export default {
  name: "EmailTemplateBuilderList",
  props: {
    templates: {
      type     : Array,
      required :true,
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
    canGeneratePdf: {
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
    'editTemplate',
    'deleteTemplate',
    'cloneTemplate',
    'generatePdf',
    'sendTest'
  ],
  components: {
    SingleTemplate,
  },
}
</script>
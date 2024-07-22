<template>
  <div v-if="isAnyAttachmentSelected" class="mt-2">
    <h1 class="text-blue-500 font-extrabold text-left text-lg"> {{ $t('components.jobOfferEmailWizard.steps.confirmation.labels.attachments.label') }}:</h1>

    <div class="ml-4">
      <ul class="flex list-disc">
        <li v-for="(attachment, type) of attachments"
            :key="type"
            class="text-left"
        >
          <span class="attachment-type">{{ type }}: </span>
          <span>{{ attachment.originalName }}</span>
          <span v-if="!!attachment.userBasedName?.length"> ({{ attachment.userBasedName }})</span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script lang="ts">
import UploadedFileDTO from "@/scripts/Dto/File/UploadedFileDTO";

export default {
  props: {
    attachments: {
      type     : Object as unknown as Record<string, UploadedFileDTO>,
      required : true,
    }
  },
  computed: {
    /**
     * @description will return list of attachment types,
     */
    attachmentTypes(): Array<string> {
      return Object.keys(this.attachments);
    },
    /**
     * @description will check if any attachment is selected at all
     */
    isAnyAttachmentSelected(): boolean {

      for (let attachmentType of this.attachmentTypes) {
        let attachment = this.attachments[attachmentType];
        if (null !== attachment) {
          return true;
        }
      }

      return false;
    }
  }
}
</script>

<style lang="scss" scoped>
.attachment-type {
  text-transform: capitalize;
  font-weight: bold;
}
</style>
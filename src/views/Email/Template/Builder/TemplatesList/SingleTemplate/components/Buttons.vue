<template>
  <div class="my-4">

    <!-- edit -->
    <MediumButtonWithIcon :text="$t('list.card.buttons.edit.label')"
                          button-classes="email-template-card-button"
                          @click="$emit('editClicked')"
                          v-if="canEdit"
    >
      <template #icon>
        <la svg-icon-name="pen-solid"
            color="white"
            class="email-template-card-button-icon"
        />
      </template>
    </MediumButtonWithIcon>

    <!-- generate pdf -->
    <MediumButtonWithIcon :text="$t('list.card.buttons.pdf.label')"
                          button-classes="email-template-card-button"
                          @click="$emit('generatePdf')"
                          v-if="canGeneratePdf"
    >
      <template #icon>
        <la svg-icon-name="file-pdf"
            color="white"
            class="email-template-card-button-icon"
        />
      </template>
    </MediumButtonWithIcon>

    <!-- Send test -->
    <MediumButtonWithIcon :text="$t('list.card.buttons.sendTest.label')"
                          button-classes="email-template-card-button"
                          @click="$emit('sendTestClicked')"
                          v-if="canSendTest"
    >
      <template #icon>
        <la svg-icon-name="envelope-open"
            color="white"
            class="email-template-card-button-icon"
        />
      </template>
    </MediumButtonWithIcon>

    <!-- delete -->
    <MediumButtonWithIcon :text="$t('list.card.buttons.remove.label')"
                          button-classes="email-template-card-button email-template-card-button-remove"
                          @click="$emit('deleteClicked')"
                          v-if="canRemove"
    >
      <template #icon>
        <la svg-icon-name="trash-solid"
            color="white"
            class="email-template-card-button-icon"
        />
      </template>
    </MediumButtonWithIcon>

    <!-- clone - label says clone because it's easier to understand for user (it does clone in background tho) -->
    <MediumButtonWithIcon :text="$t('list.card.buttons.clone.label')"
                          button-classes="email-template-card-button email-template-card-button-clone"
                          @click="$emit('cloneClicked')"
                          v-if="canClone"
    >
      <template #icon>
        <la svg-icon-name="copy-solid"
            color="white"
            class="email-template-card-button-icon"
        />
      </template>
    </MediumButtonWithIcon>

  </div>
</template>

<script lang="ts">

import MediumButtonWithIcon from "@/components/Navigation/Button/MediumButtonWithIcon.vue";

export default {
  props: {
    template: {
      required: true,
    },
    canEdit: {
      type: Boolean,
      required: false,
      default: true,
    },
    canGeneratePdf: {
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
    MediumButtonWithIcon
  }
}
</script>

<style lang="scss">
.email-template-card-button {
  height: 40px;
  @apply w-full mt-2 justify-center
}

.email-template-card-button-remove {
  @apply bg-red-500
}

.email-template-card-button-clone {
  @apply bg-blue-500
}

.email-template-card-button-icon {
  margin-top: -4px;
}
</style>

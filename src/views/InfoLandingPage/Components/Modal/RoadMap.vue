<template>
  <div>

    <Modal
        :is-visible="isVisible"
        :title="$t('infoPage.modal.roadmap.header')"
        :is-close-visible="true"
        :is-close-full-width="true"
        :cancel-text="$t('infoPage.modal.roadmap.button.close.label')"
        :cancel-button-margin-right-class-number="0"
        size="medium"
        @modal-closed="$emit('modalClosed')"
    >
      <template #content>
        <div class="max-w-4xl">

          <p class="italic">
            {{ $t('infoPage.modal.roadmap.description') }}
          </p>

          <div class="overflow-y-scroll max-h-96">

            <Timeline>
              <Element
                  v-for="dataIndex in 8"
                  :key="dataIndex"
                  :title="$t(`infoPage.modal.roadmap.data.${dataIndex}.title`)"
                  :description="$t(`infoPage.modal.roadmap.data.${dataIndex}.description`)"
              />
            </Timeline>

            <p class="mt-2">
              {{ $t('infoPage.modal.roadmap.dataAnnotation') }}
            </p>

          </div>

        </div>
      </template>
    </Modal>

  </div>
</template>

<script lang="ts">
import Modal    from "@/components/Modal/Modal.vue";
import Timeline from "@/components/Ui/Timeline/SimpleDotted/Timeline.vue";
import Element  from "@/components/Ui/Timeline/SimpleDotted/Element.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";
export default {
  data(): ComponentData {
    return {
      isVisible: false,
    }
  },
  props: {
    forceIsVisible: {
      type: Boolean,
      required: true,
      default: false,
    }
  },
  components: {
    Element,
    Timeline,
    Modal,
  },
  created(): void {
    this.isVisible = this.forceIsVisible;
  },
  watch: {
    forceIsVisible(): void {
      this.isVisible = this.forceIsVisible;
    }
  }
}
</script>

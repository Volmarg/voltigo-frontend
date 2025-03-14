<template>
  <div>

    <Modal
        :is-visible="isVisible"
        :title="$t('view.loggedIn.modal.termsOfUse.header.label')"
        :is-close-visible="false"
        size="medium"
        @modal-closed="$emit('modalClosed')"
    >
      <template #content>

        <!--
          >WARNING< be careful with changing content on the div below as its content is stored in db as confirmation
                    of which regulation users accepted.
        -->
        <div
            class="grid grid-cols-2 grid-cols-6"
            ref="regulationsWrapper"
        >

          <div class="col-start-1 col-end-7 mb-10">
            <i>{{ $t('general.regulations.termsOfUse.info.text' )}}</i>
          </div>

          <div
              class="col-start-1 col-end-7 mb-4"
              v-for="(regulationName, index) in regulations"
              :key="regulationName"
          >
            <p
                class="section-label"
                v-html="`§${index + 1}. ` + $t('general.regulations.termsOfUse.' + regulationName + '.label')"
            ></p>

            <p
                class="align-self-center section-text"
                v-html="$t('general.regulations.termsOfUse.' + regulationName + '.text')"
            ></p>

          </div>
        </div>

      </template>

      <template #footerRightSection>
        <MediumButtonWithIcon
            background-color-class="bg-green-500"
            :text="$t('view.loggedIn.modal.termsOfUse.buttons.close.label')"
            @click="onConfirm"
        />
      </template>
    </Modal>

  </div>
</template>

<script lang="ts">
import Modal                from "@/components/Modal/Modal.vue";
import MediumButtonWithIcon from "@/components/Navigation/Button/MediumButtonWithIcon.vue";

import UserRegulationMixin from "@/mixins/User/UserRegulationMixin.vue";

import {ComponentData}         from "@/scripts/Vue/Types/Components/types";
import {REGULATION_IDENTIFIER} from "@/router/SymfonyRoutes/User/Regulation/SymfonyUserRegulationsRoutes";

export default {
  data(): ComponentData {
    return {
      isVisible: false,
      // translations/en-US/regulations/general/terms-of-use.json
      regulations: []
    }
  },
  props: {
    forceIsVisible: {
      type: Boolean,
      required: true,
      default: false,
    }
  },
  mixins: [
    UserRegulationMixin
  ],
  components: {
    Modal,
    MediumButtonWithIcon
  },
  methods: {
    /**
     * @description marks the regulation in DB as accepted and hides the modal
     */
    async onConfirm(): Promise<void> {
      let isAccepted = await this.acceptUserRegulation(
          REGULATION_IDENTIFIER[REGULATION_IDENTIFIER.PLATFORM_TERMS_OF_USAGE],
          this.$refs.regulationsWrapper.innerHTML
      );

      if (isAccepted) {
        this.isVisible = false;
      }
    },
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

<style lang="scss" scoped>
.section-label {
  @apply font-bold
}

.section-text {
  @apply text-left
}

</style>
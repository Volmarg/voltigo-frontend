<template>
  <div :class="{
    'de-selected' : !isChecked,
    'not-open'    : !isOpen && isRightSidebarVisible,
  }">

    <div class="single-block text-2md">

      <div class="grid grid-rows-4 grid-cols-4 main-grid">

        <div class="grid grid-rows-1 lg:grid-rows-1 grid-cols-1 left-side-grid row-start-2 row-end-2 lg:row-start-1 lg:row-end-1 mt-4 lg:mt-0">

          <div class="center-flex">
            <OfferSelection v-model="isChecked"
                            @de-selected="onSelectionChange"
                            @selected="onSelectionChange"
            />
          </div>
        </div>

        <div class="col-start-1 lg:col-start-2 col-end-3 lg:col-end-4">
          <OfferDetails :job-offer="jobOffer" />

          <div class="button-wrapper">
            <MediumButtonWithIcon
                class="mt-3"
                button-classes="cursor-pointer w-full md:w-auto flex justify-center"
                @button-click="handlePreview"
                :text="offerButtonText"
            />
          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script lang="ts">
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";

import OfferDetails         from "@/views/JobOffer/Email/Wizard/Confirmation/OffersList/Components/SingleOffer/Components/OfferDetails.vue";
import OfferSelection       from "@/views/JobOffer/Email/Wizard/Confirmation/OffersList/Components/SingleOffer/Components/OfferSelection.vue";
import MediumButtonWithIcon from "@/components/Navigation/Button/MediumButtonWithIcon.vue";

import PreviewOfferMixin from "@/views/JobOffer/SearchResult/Details/Components/Cards/SingleCard/Mixin/PreviewOfferMixin.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

export default {
  data(): ComponentData {
    return {
      /**
       * @description it's hard to name this variable somehow else. The problem is that
       *              isOpen cannot be sometimes used to track some things as it's
       *              state is changed if sidebar is closed, and for such cases
       *              given var exists. It stores the last known state of isOpen,
       *              and will change it after certain data is handled.
       *
       *              That's why the name mention "sidebarCollision" and "isOpen".
       */
      sidebarCollisionIsOfferOpen: false,
      isChecked: false,
    }
  },
  props: {
    jobOffer: {
      type     : Object as () => JobOfferAnalyzed,
      required : true,
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
  components: {
    MediumButtonWithIcon,
    OfferDetails,
    OfferSelection,
  },
  mixins: [
    PreviewOfferMixin,
  ],
  emits: [
    'offerSelectionChanged'
  ],
  computed: {
    /**
     * @description decide the text shown on the button
     */
    offerButtonText(): string {
      if (this.isOpen) {
        return this.$t('components.jobOfferEmailWizard.steps.confirmation.action.closeOffer');
      }

      return this.$t('components.jobOfferEmailWizard.steps.confirmation.action.openOffer');
    }
  },
  methods: {
    /**
     * @description handle user requesting offer preview.
     *              Prevents re-opening offer is there is preview currently open, else user won't be easily able to
     *              close the sidebar.
     */
    handlePreview(): void {
      if (this.sidebarCollisionIsOfferOpen) {
        this.sidebarCollisionIsOfferOpen = false;
        return;
      }

      this.showPreview();
    },
    /**
     * @description handler for when user changes the offer selection
     */
    onSelectionChange(): void {
      this.$emit('offerSelectionChanged', {
        offerId    : this.jobOffer.identifier,
        isSelected : this.isChecked,
      });
    },
    /**
     * See description of sidebarCollisionIsOfferOpen
     */
    setOfferOpenSidebarCollision(): void {
      if (this.isOpen) {
        this.sidebarCollisionIsOfferOpen = true;
      }
    }
  },
  created(){
    this.isChecked = this.jobOffer.isSelected;
    this.setOfferOpenSidebarCollision();
  },
  watch: {
    isOpen() {
      this.setOfferOpenSidebarCollision();
    },
    isRightSidebarVisible() {
      if (!this.isRightSidebarVisible) {
        this.sidebarCollisionIsOfferOpen = false;
      }
    },
    jobOffer: {
      deep: true,
      handler: function(){
        this.isChecked = this.jobOffer.isSelected;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/responsive.scss';

.main-grid {
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  @apply w-full
}

@media screen and (min-width: $phoneBreakingPoint + 'px') {
  .main-grid {
    grid-template-columns: 65px 1fr;
  }

}

.left-side-grid {
  grid-template-columns: 50px 50px;
}

.center-flex {
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
}

.single-block {
  @apply w-full flex justify-start p-4 bg-transparent shadow border-l-4 border-current p-4 mb-3 bg-white text-gray-500  border-blue-500
}

.de-selected * {
  @apply opacity-75 border-gray-400
}

.not-open {
  filter: grayscale(1) blur(2px);
  @apply bg-gray-50
}
</style>
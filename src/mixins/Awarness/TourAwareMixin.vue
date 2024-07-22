<script lang="ts">
import PromiseService      from "@/scripts/Core/Services/Promise/PromiseService";
import LocalStorageService from "@/scripts/Core/Services/Storage/LocalStorageService";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

/**
 * @description this is special mixin which contains logic shared in each tour guide
 */
export default {
  data(): ComponentData {
    return {
      tourConfig: {
        awaitCssSelectorBeforeStart: null as string | null,
      },
      /**
       * @link https://github.com/pulsardev/vue-tour/wiki/Callbacks
       */
      searchTourCallbacks: {
        onFinish: this.onClose,
        onSkip: this.onClose,
        onStop: this.onClose,
        onStart: this.onStep,
        onNextStep: this.onStep,
        onPreviousStep: this.onStep,
      },
    }
  },
  methods: {
    /**
     * @description handler for closing tour in any way
     */
    onClose(): void {
      LocalStorageService.setTourDone(this.tourName);
    },
    /**
     * @description handler for each step made
     */
    onStep(): void {
      if (LocalStorageService.isTourDone(this.tourName)) {
        this.$tours[this.tourName].stop();
      }
    }
  },
  /**
   * @description relying on "window" on purpose, as got no other sane way of check if iframe is loaded
   */
  async created(): Promise<void> {
    //@ts-ignore
    window.easyEmail = {};

    //@ts-ignore
    window.easyEmail.isIframeLoaded = false;

    await PromiseService.buildPeriodicallyCheckedPromise(() => {

      if (null !== this.tourConfig.awaitCssSelectorBeforeStart) {
        let element = document.querySelector(this.tourConfig.awaitCssSelectorBeforeStart);
        if (!element) {
          return false;
        }

        if (!(element instanceof HTMLIFrameElement)) {
          return !!this.$tours[this.tourName];
        }

        element.onload = () => {
          //@ts-ignore
          window.easyEmail.isIframeLoaded = true;
        }

        //@ts-ignore
        return window.easyEmail.isIframeLoaded;
      }

      return !!this.$tours[this.tourName];
    }).then(() => {

      if (!LocalStorageService.isTourDone(this.tourName)) {
        this.$tours[this.tourName].start();
      }
    })
  },

}
</script>
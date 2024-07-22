<script lang="ts">
import BaseError from "@/scripts/Core/Error/BaseError";

export default {
  methods: {
    async dispatchEasyEmailEvent(eventName: string, args: Record<string, any>): Promise<void> {
      if (undefined === this.$root.$refs.communicationIframeComponent) {
        let errorMsg = `
            No ref element named "communicationIframeComponent was found, did You added the "EasyEmailCommunicationComponent" with that ref assigned to it?
            Maybe the mixing is not aware of $root.
          `
        throw new BaseError(errorMsg);
      }

      let postObject = {
        event: eventName,
        ...args,
      };

      let ref = await this.$root.$refs.communicationIframeComponent.getIframeRef();

      /**
       * @description there is some issue that when calling postMessage to early it tries to set wrong origin,
       *              even tho while debugging it's always correct, but maybe this has something to do with the
       *              EasyEmail not yet being loaded (low timeout would make no sense here then...),
       *
       *              Regardless, adding event low value for setTimeout just works.
       *              But in case of communication issues this will then be the thing to do correctly.
       */
      setTimeout( () => {

        /**
         * @description YES this is stupid but js works like this don't waste time on thinking here.
         *
         *              And the question is...
         *              - Why do You need origin since ref is an iframe window with known src!,
         *                it just is like that, post message requires target external window and on the same time
         *                it wants the window origin, the very same already known iframe.src...
         */
        ref.contentWindow.postMessage(
            postObject,
            ref.src
        );

      }, 1)

    }
  }
}
</script>
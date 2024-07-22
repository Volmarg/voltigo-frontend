<template>
  <iframe :src="easyEmailIframeUrl"
          class="hidden"
          ref="easyEmailCommunication"
          id="easyEmailCommunication"
  />
</template>

<script lang="ts">
import EnvReader from "@/scripts/Core/System/EnvReader";

import EasyEmailMixin from "@/mixins/Libs/EasyEmailMixin.vue";

import {Ref}           from "vue";
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

/**
 * @description Related to: EasyEmail performance issue
 *
 * EasyEmail is choking the browser memory very hard, yet still the communication between the EasyEmail and
 * current frontend is to be handled via iframe.
 *
 * This component is added to the main view of the app, and should be accessible globally, even if in reality
 * it's being called only in few places.
 *
 * The reason behind this solution is that calling it once on the beginning is way much performant than loading
 * the iframe over and over again, as the browsers don't have enough time to recycle the memory between the openings.
 * With this one iframe being open the memory usage is drastically reduced, and the project behaves more stable when
 * working/communicating with EasyEmail.
 *
 * This is still NOT THE BEST solution but sufficient to have stable enough project.
 */
export default{
  data(): ComponentData {
    return {
      isMounted: false,
    }
  },
  computed: {
    /**
     * @description returns the iframe url to be called, using the `empty page` as it's fastest to load,
     *              and the iframe is only needed for communication with EasyEmail
     */
    easyEmailIframeUrl(): string {
      return EnvReader.getEmailBuilderUrl() + "/static/communication.html";
    }
  },
  mixins: [
    EasyEmailMixin,
  ],
  methods: {
    /**
     * @description returns the iframe reference
     */
    async getIframeRef(): Promise<Ref> {

      // promise is needed else the ref is returned but iframe is not yet mounted
      return new Promise( (resolve) => {

        if (this.isMounted) {
          resolve (this.$refs.easyEmailCommunication);
        }

      })
    }
  },
  mounted(): void {
    this.isMounted = true;
  }
}
</script>
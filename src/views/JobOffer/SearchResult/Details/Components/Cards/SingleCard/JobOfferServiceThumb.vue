<template>
  <div class="job-offer-service-thumbnail hover:opacity-75 opacity-100 transition transition-opacity duration-300"
       v-tippy="tippyContent"
  >
    <a :href="`//${serviceData.homePageUrl}`" target="_blank">
      <img class="left" :src="iconRelativePath"/>
    </a>
  </div>
</template>

<script lang="ts">
import JobServiceDataProvider, {ServiceData} from "@/scripts/Core/Services/Job/JobServiceDataProvider";

export default {
  props: {
    /** @type ServiceData */
    serviceData: {
      type     : Object as unknown as ServiceData,
      required : true,
    }
  },
  computed: {
    /**
     * @description will return content visible when hovering over the job offer service
     */
    tippyContent(): string {
      return `<p><i>${this.$t('searchResults.singleCard.jobOfferServiceThumbnail.tippyContent.goTo')}</i></p>`;
    },
    /**
     * @description will provide job service logo path or placeholder with `not found` if given service is not yet handled
     */
    iconRelativePath(): string {
      return JobServiceDataProvider.LOGO_RELATIVE_PATH + this.serviceData.logoFileName;
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/responsive.scss';

.job-offer-service-thumbnail {
  border-radius: 10%;
  box-shadow: 3px 3px 3px rgba(0,0,0,0.07);
  float: left;
  position: relative;
  left: -9px;
  top: -9px;
  height: 50px;
  width: 50px;
  overflow: hidden;
}

@media all and (max-width: $largeScreenBreakingPoint + 'px') {
  $size: 50px;
  .job-offer-service-thumbnail {
    height: $size;
    min-width: $size;
    box-shadow: none;
  }
}

img.left {
  position: absolute;
  left: 50%;
  top: 50%;
  height: auto;
  width: 100%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

</style>

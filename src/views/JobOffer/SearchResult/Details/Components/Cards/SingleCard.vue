<template>

  <container
      class="single-card-blue shadow-lg relative mb-10 p-0-force card-height"
      :class="{
               'not-open' : !isOpen && isRightSidebarVisible,
             }"
  >

    <div class="grid grid-cols-12 lg:mr-4 card-height offer-grid-custom lg:grid-rows-1 grid-rows-12">

      <!-- Job service information block (left on big screen, top on mobile) -->
      <div class="job-service-information">
        <OfferServiceInfoBlock :job-offer="jobOffer"/>
      </div>

      <!-- Offer data (right on big screen, bottom on mobile) -->
      <div class="lg:col-start-3 col-start-1 col-end-13 mt-4 grid grid-rows-12 lg:row-start-1 lg:row-end-1 row-start-2 right-block-grid-pattern">
        <!-- top -->
        <div class="lg:col-start-3 lg:col-end-13 col-start-1 col-end-13 main-content-padding lg:ml-5">
          <OfferTitle :job-offer="jobOffer"
                      @show-right-sidebar="$emit('showRightSidebar', $event)"
          />
          <CompanyName :job-offer="jobOffer"/>

          <CompanyLocation :job-offer="jobOffer"
                           class="mt-1"
          />

          <OfferData :job-offer="jobOffer" />

          <div class="separator"></div>
          <OfferDescription :job-offer="jobOffer"/>
        </div>

        <!-- bottom -->
        <div class="flex flex-row align-items-end lg:col-start-3 col-start-1 col-end-13 lg:ml-5 mb-4">
          <BottomBar
              :job-offer="jobOffer"
              :is-initially-selected="isInitiallySelected"
              @card-selection-changed="onCardSelectionChanged"
              @show-right-sidebar="$emit('showRightSidebar', $event)"
              class="main-content-padding row-start-2 row-end-2"
          />
        </div>

      </div>

    </div>
  </container>

</template>

<script lang="ts">

import BottomBar             from "@/views/JobOffer/SearchResult/Details/Components/Cards/SingleCard/BottomBar.vue";
import OfferDescription      from "@/views/JobOffer/SearchResult/Details/Components/Cards/SingleCard/OfferDescription.vue";
import CompanyName           from "@/views/JobOffer/SearchResult/Details/Components/Cards/SingleCard/CompanyName.vue";
import OfferTitle            from "@/views/JobOffer/SearchResult/Details/Components/Cards/SingleCard/OfferTitle.vue";
import CompanyLocation       from "@/views/JobOffer/SearchResult/Details/Components/Cards/SingleCard/CompanyLocation.vue";
import OfferData             from "@/views/JobOffer/SearchResult/Details/Components/Cards/SingleCard/OfferData.vue";
import Container             from "@/components/Ui/Containers/Container.vue";
import OfferServiceInfoBlock from "@/views/JobOffer/SearchResult/Details/Components/Cards/SingleCard/OfferServiceInfoBlock.vue";

import {ComponentData}    from "@/scripts/Vue/Types/Components/types";
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";

export default {
  name: "JobOfferSingleCard",
  data(): ComponentData {
    return {
      isSelected: false,
    }
  },
  props: {
    jobOffer: {
      type     : Object as unknown as JobOfferAnalyzed,
      required : true,
    },
    isInitiallySelected: {
      type    : Boolean,
      default : false,
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
  emits: [
    "showRightSidebar",
    "cardSelectionChanged"
  ],
  components: {
    "container" : Container,
    CompanyName,
    OfferTitle,
    OfferData,
    CompanyLocation,
    OfferDescription,
    BottomBar,
    OfferServiceInfoBlock
  },
  methods: {
    /**
     * @description handles user clicking "Apply" in the right sidebar. Will emit the event without the isSelected
     *              as this will default to the "toggle" state, which further means:
     *              - if offer is selected, then will deselect it,
     *              - if offer is deselected, then will select it,
     *
     * > Warning < even tho the IDE does not see usages of this function it IS
     *             called via '$refs > component', that's probably why IDE struggles to identify this call.
     */
    sidebarApplyClick(jobOfferIdentifier: number): void {
      this.$emit('cardSelectionChanged', jobOfferIdentifier, null)
    },
    /**
     * @description handler for when the job offer selection changes
     */
    onCardSelectionChanged(jobOfferIdentifier: number, isSelected: boolean): void {
      this.$emit('cardSelectionChanged', jobOfferIdentifier, isSelected)
    },
  }
}
</script>

<style lang="scss">
h1 {
  padding-top: 15px;
  font-size: 1.3rem;
}

h2 {
  font-size: 1.0rem;
  color: #4B4B4B;
}

.separator {
  margin-top: 10px;
  border: 1px solid #C3C3C3;
}

p {
  text-align: justify;
  font-size: 0.95rem;
  line-height: 150%;
  color: #4B4B4B;
}
</style>

<style lang="scss" scoped>

@import '@/assets/scss/responsive.scss';

.single-card {
  border-bottom: 3px solid;
  border-right: 5px solid;
}

.single-card-blue {
  $blue: rgb(59, 130, 246);  // equals to css class `-blue-500`

  @extend  .single-card;
  border-right-color: $blue;
  border-bottom-color: $blue;
}

.not-open {
  filter: grayscale(1) blur(2px);
  @apply bg-gray-50
}

.main-content-padding {
  @apply pl-4 pr-4
}

.align-items-end {
  align-items: end;
}

.card-height {
  min-height: 300px;
}

.right-block-grid-pattern {
  grid-template-rows: 1fr 100px
}

.job-service-information {
  border-bottom-left-radius: 6px;
  border-top-left-radius: 7px;

  @apply col-start-1 lg:col-end-2 col-end-13 h-full text-white bg-blue-500 row-start-1 row-end-1
}

@media screen and (min-width: $tabletBreakingPointPx + 'px') {
  .offer-grid-custom {
    grid-template-columns: 150px;
  }
}

@media screen and (max-width: $largeScreenBreakingPoint + 'px') {
  .job-service-information {
    border-top-left-radius: 0;
  }
}

</style>
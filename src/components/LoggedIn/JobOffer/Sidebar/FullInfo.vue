<template>
  <div>
    <h1 class="text-blue-500 font-extrabold text-center job-detail-title mb-4 p-2">{{ jobOffer.jobTitle }}</h1>

    <hr/>

    <div class="flex justify-center mt-2 mb-1">
      <Checkbox v-if="jobOffer.contactDetail.email"
                v-tippy="$t('searchResults.singleCard.options.selectForApplication.allowed')"
                v-model="isSelected"
                @change="onSelectionChange"
                class="!w-auto"
      />
      <span class="align-self-center ml-2">{{ $t('searchResults.singleCard.apply.label') }}</span>
    </div>

    <tabs :tabs-with-content="buildTabsContent()"/>
  </div>
</template>

<script lang="ts">
import Tabs              from "@/components/Navigation/Tabs/Tabs.vue";
import Checkbox          from "@/components/Form/Checkbox.vue";
import TabJobOfferDetail from "@/components/LoggedIn/JobOffer/Sidebar/FullInfo/TabJobOfferDetail.vue";
import TabCompanyDetail  from "@/components/LoggedIn/JobOffer/Sidebar/FullInfo/TabCompanyDetail.vue";
import TabSearch         from "@/components/LoggedIn/JobOffer/Sidebar/FullInfo/TabSearch.vue";

import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";
import {ComponentData}    from "@/scripts/Vue/Types/Components/types";

export default {
  name: "JobOfferAnalyseResult",
  data(): ComponentData {
    return {
      isSelected: false,
    }
  },
  props: {
    /** @var {JobOfferAnalyzed} */
    jobOffer: {
      type     : Object as unknown as JobOfferAnalyzed,
      required : true,
    },
    fullDescription: {
      type     : String,
      required : true,
    }
  },
  emits: [
    'offerApplyClicked'
  ],
  components: {
    Checkbox,
    'tabs': Tabs,
  },
  methods: {
    buildTabsContent(): Array<Record<string, unknown>> {
      let offerDetails   = this.$t('searchResults.fullInfo.tabs.offerDetails.label');
      let companyDetails = this.$t('searchResults.fullInfo.tabs.companyDetails.label');

      return [
        {
          tabName           : offerDetails,
          tabComponent      : TabJobOfferDetail,
          tabComponentProps : {
            jobOffer        : this.jobOffer,
            fullDescription : this.fullDescription,
          }
        },
        {
          tabName      : companyDetails,
          tabComponent : TabCompanyDetail,
          tabComponentProps  : {
            companyData: this.jobOffer.companyDetail,
          }
        },
        {
          tabName      : this.$t('searchResults.fullInfo.tabs.search.label'),
          tabComponent : TabSearch,
          tabComponentProps  : {
            companyData: this.jobOffer.companyDetail,
          }
        }
      ];
    },
    /**
     * @description handles user clicking on "Apply". Will propagate the event further and handle the
     *              "apply" process which normally happens from card-view.
     */
    onSelectionChange(): void {
      this.$emit('offerApplyClicked', {jobOffer: this.jobOffer});
    }
  },
  mounted(): void {
    this.isSelected = this.jobOffer.isSelected;
  },
  watch: {
    /**
     * @description this handles the back-propagation. Without this the selection state will not
     *              be update if offer will get deselected from card view etc.
     */
    "jobOffer.isSelected": {
      deep: true,
      handler: function() {
        this.isSelected = this.jobOffer.isSelected;
      }
    }
  }
}
</script>

<style lang="scss">
.job-detail-title {
  font-size: 1.5rem;
}
</style>
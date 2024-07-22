<template>
  <container class="mb-4">
    <div class="flex justify-between align-self-center flex-col sm:flex-row gap-4 sm:gap-0">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex justify-center flex-col">
          <button-rounded :text="getToggleAllOffersText"
                          @click="onToggleAllOffersClick"
                          button-extra-classes="h-full pt-3 pb-3 sm:pb-0 sm:pt-0"

          />
        </div>

        <div class="flex justify-center flex-col">
          <GetAsCsv
              :saved-offers="allJobOffers"
              :label="$t('actionsPanel.getCsv.allVisibleLabel')"
          />
        </div>
      </div>

      <div>
        <Search @input="$emit('searchChanged', $event)"/>
      </div>
    </div>

  </container>
</template>

<script lang="ts">
import Container     from "@/components/Ui/Containers/Container.vue";
import ButtonRounded from "@/components/Navigation/Button/ButtonRounded.vue";
import Search        from "@/views/JobOffer/SearchResult/Details/Components/ActionsPanel/Search.vue";
import GetAsCsv      from "@/views/JobOffer/SearchResult/Details/Components/ActionsPanel/GetAsCsv.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

export default {
  name: "OffersSearchResultActionsPanel",
  data(): ComponentData {
    return {
      areAllVisibleOffersSelected: false,
    }
  },
  props: {
    allJobOffers: {
      type: Array,
      required: true,
    },
    allVisibleOffersSelected: {
      type     : Boolean,
      required : true,
    }
  },
  emits: [
    'search-changed',
    'toggle-all-visible-offers-selection'
  ],
  components: {
    ButtonRounded,
    Container,
    GetAsCsv,
    Search
  },
  computed: {
    /**
     * @description will return the text used for the `toggle all offers button`
     */
    getToggleAllOffersText(): string {
      let translatedNode = (this.areAllVisibleOffersSelected ? 'deselectAll' : 'selectAll')
      return this.$t(`searchResults.topBar.viewSwitch.selectAllVisible.${translatedNode}`);
    }
  },
  methods: {
    /**
     * @description handler for when `toggle all offers` button gets clicked
     */
    onToggleAllOffersClick(): void {
      this.areAllVisibleOffersSelected = !this.areAllVisibleOffersSelected;
      this.$emit('toggleAllVisibleOffersSelection', this.areAllVisibleOffersSelected);
    }
  },
  updated(): void {
    this.areAllVisibleOffersSelected = this.allVisibleOffersSelected;
  },
}
</script>
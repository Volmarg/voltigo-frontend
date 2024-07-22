<template>
  <div class="main-content-wrapper">

    <div class="self-center left-side">
      <div class="left-side-content">

        <!-- headline -->
        <p class="headline">
          {{ historyEntry.information }}
        </p>
        <hr class="mt-2 w-100 md:hidden block"/>

        <p class="flex justify-center md:justify-start">
          <b class="text-sm">{{ $t('pointShop.singleCard.foundsBalance.label') }}: </b>
        </p>

        <!-- gem states -->
        <div class="gem-states">
          <ul class="text-sm list-disc ml-4">
            <li>Before: {{ historyEntry.amountBefore }}</li>
            <li>After: {{ historyEntry.amountNow }}</li>
          </ul>
          <span class="gem-state text-sm">
          </span>

          <span class="gem-state text-sm">

          </span>
        </div>

        <!-- Details button -->
        <!-- In some cases it's hidden on purpose because there are literally no other information to show -->
        <MediumButtonWithIcon :text="$t('pointShop.singleCard.button.details.label')"
                              button-classes="w-full md:w-auto flex justify-center"
                              @button-click="isDetailsModalVisible = true"
                              class="mt-2"
                              v-if="historyEntry.hasRelatedProduct()"
        />

      </div>
    </div>

    <!-- point change information -->
    <span class="right-side">
      <Type :user-point-history="historyEntry"/>
    </span>

  </div>

  <!-- date -->
  <div class="sub-content-wrapper">
    <small class="text-xs">
      {{ createdDate }}
    </small>
  </div>

  <DetailsModal :force-is-visible="isDetailsModalVisible"
                :history-entry="historyEntry"
                @modal-closed="isDetailsModalVisible = false"
  />

</template>

<script lang="ts">
import Type                 from "@/views/Payments/PointShopHistory/Components/Type.vue";
import DetailsModal         from "@/views/Payments/PointShopHistory/Components/DetailsModal.vue";
import MediumButtonWithIcon from "@/components/Navigation/Button/MediumButtonWithIcon.vue";

import ResponsiveVarsMixin from "@/mixins/Responsive/ResponsiveVarsMixin.vue";

import {UserPointHistory} from "@/scripts/Response/PointShop/GetFullPointShopHistoryResponse";
import {ComponentData}    from "@/scripts/Vue/Types/Components/types";

import moment from "moment";

export default {
  data(): ComponentData {
    return {
      isDetailsModalVisible: false,
    }
  },
  props: {
    historyEntry: {
      type: Object as unknown as UserPointHistory,
      required: true,
    }
  },
  components: {
    MediumButtonWithIcon,
    DetailsModal,
    Type,
  },
  mixins: [
    ResponsiveVarsMixin,
  ],
  computed: {
    /**
     * @description when the history entry was created
     */
    createdDate(): string {
      return moment(this.historyEntry.created).format("YYYY-MM-DD H:mm:s");
    }
  }
}
</script>


<style lang="scss" scoped>
.main-content-wrapper {
  @apply grid grid-cols-12 grid-rows-1 md:grid-rows-1 text-left
}

.left-side {
  @apply col-start-1 col-end-13 flex
}

.left-side-content {
  @apply self-start w-full
}

.right-side {
  @apply col-start-5 sm:col-start-6 row-start-2 md:col-start-13 md:row-start-1 justify-center flex mt-2 md:mt-0 md:self-center mb-5 mt-5 md:mb-3 md:mb-0
}

.gem-state {
  & > img {
    height: 16px;
    @apply ml-1 self-center
  }

  @apply flex
}

.gem-state + .gem-state {
  @apply ml-2
}

.gem-states {
  @apply flex flex-row mt-4 md:mt-2 self-center justify-center md:justify-start text-base sm:text-lg
}

.headline {
  letter-spacing: 0.5px;
  @apply text-blue-500 font-bold text-base sm:text-lg text-center md:text-left
}
</style>
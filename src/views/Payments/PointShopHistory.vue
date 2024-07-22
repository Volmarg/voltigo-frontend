<template>
  <div>

    <AboutAccordion>
      <div class="flex flex-col sm:flex-row">
        <p
            v-html="$t('pointShop.about.text')"
            class="mt-0-force"
        />
        <div class="about-gem-icon-wrapper align-self-center sm:align-self-start">
          (
          <img
              src="/public/image/system/gem/gem-24.png"
              class="about-gem-icon"
          />
          )
        </div>
      </div>
    </AboutAccordion>

    <FiltersPanel :history-entries="historyEntries"
                  @filter-value-changed="onFilterValueChange"
    />

    <Container class="mb-3">
      <div class="flex justify-center">
        <span class="current-status-text">
          <span class="current-status-text">
            {{ $t('pointShop.other.pointsAmount.label') }}
          </span>
          <span class="current-amount">
            {{ userStateStore?.user?.points }}
          </span>
        </span>
        <img
            src="/public/image/system/gem/gem-32.png"
            class="gem-state-icon"
        />
      </div>
    </Container>

    <Container>

      <NumericList class="ml-2 mr-2 sm:ml-5 sm:mr-5">
        <SingleElement v-for="(historyEntry, index) in visibleResults"
                       :key="(index)"
        >
          <template #marker-content>#{{ getNumberForId(historyEntry.id) }}</template>
          <template #general-content>

            <EntryInformation :history-entry="historyEntry" />

          </template>
        </SingleElement>
      </NumericList>

      <pagination :number-of-results="filteredResults.length"
                  :initial-count-of-result-per-page="config.pagination.resultPerPage"
                  :initial-current-page="config.pagination.currentPage"
                  @page-number-changes="onPaginationChange"/>

      <NoResultsText v-if="0 === filteredResults.length" />
    </Container>
  </div>
</template>

<script lang="ts">
import NoResultsText    from "@/components/Page/NoResultsText.vue";
import Pagination       from "@/components/Ui/Pagination.vue";
import Container        from "@/components/Ui/Containers/Container.vue";
import NumericList      from "@/components/Ui/List/NumericList.vue";
import SingleElement    from "@/components/Ui/List/NumericList/SingleElement.vue";
import EntryInformation from "@/views/Payments/PointShopHistory/Components/EntryInformation.vue";
import FiltersPanel     from "@/views/Payments/PointShopHistory/Components/FiltersPanel/FiltersPanel.vue";
import AboutAccordion   from "@/components/Page/AboutAccordion.vue";

import PointShopHistoryProviderMixin from "@/mixins/PointShop/PointShopHistoryProviderMixin.vue";
import PaginationMixin               from "@/scripts/Vue/Mixins/Ui/PaginationMixin.vue";

import {ComponentData}    from "@/scripts/Vue/Types/Components/types";
import {UserPointHistory} from "@/scripts/Response/PointShop/GetFullPointShopHistoryResponse";

import BaseError                        from "@/scripts/Core/Error/BaseError";
import StringTypeProcessor              from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";
import {UserStateStore, userStateStore} from "@/scripts/Vue/Store/UserState";

import moment from "moment/moment";

type IdToNumber = {
  id: number,
  index: number,
}

type FilterValues = {
  created: null | string,
}

export default {
  data(): ComponentData {
    return {
      userStateStore: null as null | UserStateStore,
      idsToNumbers: [] as Array<IdToNumber>,
      visibleResults: [] as Array<UserPointHistory>,
      filteredResults: [] as Array<UserPointHistory>,
      config: {
        pagination: {
          resultPerPage : 5,
          currentPage   : 1,
        }
      },
    }
  },
  mixins: [
    PointShopHistoryProviderMixin,
    PaginationMixin,
  ],
  components: {
    AboutAccordion,
    Pagination,
    NumericList,
    Container,
    SingleElement,
    EntryInformation,
    FiltersPanel,
    NoResultsText
  },
  methods: {
    /**
     * @description will handle the event when page number changes on pagination
     */
    onPaginationChange(currentPage: number, countOfResultsPerPage: number): void {
      this.config.pagination.currentPage = currentPage;
      this.visibleResults                = this.filterShownResultByPagination(currentPage, countOfResultsPerPage, this.filteredResults);
    },
    /**
     * @description will return number displayed next to the list element - based on the backend delivered id of the history entry
     */
    getNumberForId(searchedId: number): number {
      for (let idToNumber of this.idsToNumbers) {

        if (idToNumber.id === searchedId) {
          return idToNumber.index;
        }
      }

      throw new BaseError(`Could not get the number for user point history id: ${searchedId}`);
    },
    /**
     * @description takes the backed delivered ids and casts them into the number that will be displayed next to the
     *              list element
     */
    castEntityIdsToShownNumbers(): void {
      let counter = this.historyEntries.length;
      for (let historyEntry of this.historyEntries) {

        this.idsToNumbers.push({
          id    : historyEntry.id,
          index : counter,
        });

        counter--;
      }
    },
    /**
     * @description matches the entries that were created on THE SAME day or AFTER
     */
    filterByCreatedDate(userPointHistories: Array<UserPointHistory>, filterValues: FilterValues): Array<UserPointHistory> {
      return userPointHistories.filter((userPointHistory: UserPointHistory) => {
        if (StringTypeProcessor.isEmptyString(filterValues.created)){
          return true;
        }

        let createdMoment    = moment(filterValues.created)
        let entryCreatedDate = moment(userPointHistory.created);

        return entryCreatedDate.isSameOrAfter(createdMoment);
      });
    },
    /**
     * @description applies filters on when any of its value changes
     */
    onFilterValueChange(filterValues: FilterValues) {
      let filteredResults = this.filterByCreatedDate(this.historyEntries, filterValues);

      this.filteredResults               = filteredResults;
      this.config.pagination.currentPage = 1;
      this.visibleResults                = this.filterShownResultByPagination(this.config.pagination.currentPage, this.config.pagination.resultPerPage, filteredResults);
    }
  },
  async created(): Promise<void> {
    this.userStateStore = userStateStore();
    this.userStateStore.loadUserData()

    await this.getAllPointShopHistoryEntries();
    this.filteredResults = this.historyEntries;
    this.visibleResults  = this.filterShownResultByPagination(this.config.pagination.currentPage, this.config.pagination.resultPerPage, this.filteredResults);
    this.castEntityIdsToShownNumbers();
  }
}
</script>

<style lang="scss" scoped>
.current-status-text {
  @apply text-blue-500
}

.current-amount {
  @apply font-bold
}

.gem-state-icon {
  height: 16px;
  @apply self-center ml-1
}

.about-gem-icon {
  @apply inline
}

.about-gem-icon-wrapper {
  @apply inline ml-1
}

</style>
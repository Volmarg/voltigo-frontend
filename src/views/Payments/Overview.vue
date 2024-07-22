<template>
  <div>
    <AboutAccordion>
      <div class="flex">
        <p
            v-html="$t('orderPaymentsOverview.about.text')"
            class="mt-0-force"
        />
      </div>
    </AboutAccordion>

    <FiltersPanel :orders-data="ordersData"
                  @filter-value-changed="onFilterValueChange"
    />
    <container>
      <div v-for="orderData of visibleOrdersData"
           :key="orderData.id"
      >

        <SingleResult :order-data="orderData"/>
      </div>

      <pagination :number-of-results="filteredResultsCount"
                  :initial-count-of-result-per-page="config.pagination.resultPerPage"
                  :initial-current-page="config.pagination.currentPage"
                  @page-number-changes="onPaginationChange"/>

      <NoResultsText v-if="!filteredResultsCount" />
    </container>
  </div>
</template>

<script lang="ts">

import moment              from "moment";
import TypeChecker         from "@/scripts/Core/Services/Types/TypeChecker";
import StringTypeProcessor from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";
import ArrayTypeProcessor  from "@/scripts/Core/Services/TypesProcessors/ArrayTypeProcessor";

import {OrderData}     from "@/scripts/Response/Order/GetOrdersDataResponse";
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import AboutAccordion from "@/components/Page/AboutAccordion.vue";
import NoResultsText  from "@/components/Page/NoResultsText.vue";
import Pagination     from "@/components/Ui/Pagination.vue";
import Container      from "@/components/Ui/Containers/Container.vue";
import SingleResult   from "@/views/Payments/Overview/Components/SingleResult/SingleResult.vue";
import FiltersPanel   from "@/views/Payments/Overview/Components/FiltersPanel/FiltersPanel.vue";

import PaginationMixin         from "@/scripts/Vue/Mixins/Ui/PaginationMixin.vue";
import UserOrdersProviderMixin from "@/mixins/Order/UserOrdersProviderMixin.vue";

type FilterValues = {
  minPrice     : null | number,
  maxPrice     : null | number,
  created      : null | string,
  status       : null | string,
  productNames : Array<string>,
}

export default {
  data: (): ComponentData => {
    return {
      visibleOrdersData: [] as Array<OrderData>,
      filteredOrdersData: [] as Array<OrderData>,
      config: {
        pagination: {
          resultPerPage : 10,
          currentPage   : 1,
        }
      },
    }
  },
  components: {
    "container"  : Container,
    "pagination" : Pagination,
    SingleResult,
    FiltersPanel,
    NoResultsText,
    AboutAccordion,
  },
  mixins: [
    PaginationMixin,
    UserOrdersProviderMixin
  ],
  computed: {
    /**
     * @description will return amount of filtered results
     */
    filteredResultsCount(): number {
      return this.filteredOrdersData.length;
    }
  },
  methods: {
    /**
     * @description will handle the event when page number changes on pagination
     */
    onPaginationChange(currentPage: number, countOfResultsPerPage: number): void {
      this.config.pagination.currentPage = currentPage;
      this.visibleOrdersData             = this.filterShownResultByPagination(currentPage, countOfResultsPerPage, this.filteredOrdersData);
    },
    /**
     * @description handles 1:1 match by status
     */
    filterByStatus(ordersData: Array<OrderData>, filterValues: FilterValues): Array<OrderData> {
      return ordersData.filter((orderData: OrderData) => {
        return (
                TypeChecker.isNull(filterValues.status)
            ||  filterValues.status === orderData.status
        )
      });
    },
    /**
     * @description filters the results by min. & max. price, returning only the orders matching BETWEEN
     */
    filterByPrice(ordersData: Array<OrderData>, filterValues: FilterValues): Array<OrderData> {
      return ordersData.filter((orderData: OrderData) => {
          if(
                  TypeChecker.isNull(filterValues.minPrice)
              &&  TypeChecker.isNull(filterValues.maxPrice)
          ) {
            return true;
          }

          if(
                  null !== filterValues.minPrice
              &&  null !== filterValues.maxPrice
              &&  orderData.totalWithTax >= filterValues.minPrice
              &&  orderData.totalWithTax <= filterValues.maxPrice
          ) {
            return true;
          }

        if(
                null === filterValues.minPrice
            &&  null !== filterValues.maxPrice
            &&  orderData.totalWithTax <= filterValues.maxPrice
        ) {
          return true;
        }

        if(
                null !== filterValues.minPrice
            &&  null === filterValues.maxPrice
            &&  orderData.totalWithTax >= filterValues.minPrice
        ) {
          return true;
        }

        return false;
      });
    },
    /**
     * @description matches the entries that were created on THE SAME day or AFTER
     */
    filterByCreatedDate(ordersData: Array<OrderData>, filterValues: FilterValues): Array<OrderData> {
      return ordersData.filter((orderData: OrderData) => {
        if (StringTypeProcessor.isEmptyString(filterValues.created)){
          return true;
        }

        let createdMoment      = moment(filterValues.created)
        let orderCreatedMoment = moment(orderData.created);

        return orderCreatedMoment.isSameOrAfter(createdMoment);
      });
    },
    /**
     * @description filters by the provided product names,
     *              - this is NOT 1:1 product match but rather regexp based match kinda "str_contains"
     */
    filterByProductNames(ordersData: Array<OrderData>, filterValues: FilterValues): Array<OrderData> {
      return ordersData.filter((orderData: OrderData) => {

        if (ArrayTypeProcessor.isEmpty(filterValues.productNames)) {
          return true;
        }

        for (let productName of filterValues.productNames) {
          let productNameRegexp = new RegExp(`.*${productName}.*`, 'i');
          for (let productName of orderData.productsData) {
            if (productNameRegexp.test(productName)) {
              return true;
            }
          }
        }

        return false;
      });
    },
    /**
     * @description applies filters on when any of its value changes
     */
    onFilterValueChange(filterValues: FilterValues) {
      let filteredResults = this.filterByStatus(this.ordersData, filterValues);
      filteredResults     = this.filterByProductNames(filteredResults, filterValues);
      filteredResults     = this.filterByCreatedDate(filteredResults, filterValues);
      filteredResults     = this.filterByPrice(filteredResults, filterValues);

      this.filteredOrdersData            = filteredResults;
      this.config.pagination.currentPage = 1;
      this.visibleOrdersData             = this.filterShownResultByPagination(this.config.pagination.currentPage, this.config.pagination.resultPerPage, filteredResults);
    }
  },
  async created(): Promise<void>{
    await this.getOrdersData();
    this.filteredOrdersData = this.ordersData;
    this.visibleOrdersData  = this.filterShownResultByPagination(this.config.pagination.currentPage, this.config.pagination.resultPerPage, this.filteredOrdersData);
  }
}
</script>
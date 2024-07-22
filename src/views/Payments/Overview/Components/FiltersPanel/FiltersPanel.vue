<template>
  <div>

    <Accordion>
      <AccordionPanel>

        <template #title>
          {{ $t('orderPaymentsOverview.filters.accordion.mainLabel') }}
        </template>

        <template #content>

          <Container class="grid lg:grid-rows-1 lg:grid-cols-2 gap-2 mb-4 sm:grid-rows-1 sm:grid-cols-1">
            <PriceFilter
                v-model="filterValues.minPrice"
                :label="$t('orderPaymentsOverview.filters.minTotalPrice.label')"
            />
            <PriceFilter
                v-model="filterValues.maxPrice"
                :label="$t('orderPaymentsOverview.filters.maxTotalPrice.label')"
            />
          </Container>

          <Container class="grid lg:grid-rows-2 lg:gap-4 gap-6">
            <ProductNamesFilter v-model="filterValues.productNames" />

            <div class="grid lg:grid-rows-1 lg:grid-cols-2 lg:gap-4 gap-6">
              <StatusFilter
                  v-model="filterValues.status"
                  :orders-data="ordersData"
              />
            </div>
          </Container>

          <Container class="grid lg:grid-rows-1 lg:grid-cols-3 gap-2 mb-4 sm:grid-rows-1 sm:grid-cols-1 mt-4">
            <CreatedFilter v-model="filterValues.created"/>
          </Container>

        </template>
      </AccordionPanel>
    </Accordion>

  </div>
</template>

<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import ProductNamesFilter from "@/views/Payments/Overview/Components/FiltersPanel/Components/ProductNamesFilter.vue";
import StatusFilter       from "@/views/Payments/Overview/Components/FiltersPanel/Components/StatusFilter.vue";
import CreatedFilter      from "@/views/Payments/Overview/Components/FiltersPanel/Components/CreatedFilter.vue";
import PriceFilter        from "@/views/Payments/Overview/Components/FiltersPanel/Components/PriceFilter.vue";

import Container      from "@/components/Ui/Containers/Container.vue";
import Accordion      from "@/components/Ui/Accordion/Accordion.vue";
import AccordionPanel from "@/components/Ui/Accordion/Panel.vue";

import {OrderData} from "@/scripts/Response/Order/GetOrdersDataResponse";

export default {
  data(): ComponentData {
    return {
      filterValues: {
        maxPrice: null,
        minPrice: null,
        created: null,
        status: null,
        productNames: [],
      }
    }
  },
  props: {
    ordersData: {
      type     : Array as unknown as Array<OrderData>,
      required : true,
    }
  },
  emits: [
    'filterValueChanged'
  ],
  components: {
    Container,
    ProductNamesFilter,
    CreatedFilter,
    StatusFilter,
    Accordion,
    AccordionPanel,
    PriceFilter,
  },
  watch: {
    filterValues: {
      deep: true,
      handler(): void {
        this.$emit('filterValueChanged', this.filterValues);
      }
    }
  }
}

</script>
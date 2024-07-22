<template>
  <div>

    <Accordion>
      <AccordionPanel>

        <template #title>
          {{ $t('pointShop.filter.accordion.mainLabel') }}
        </template>

        <template #content>

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

import CreatedFilter from "@/views/Payments/PointShopHistory/Components/FiltersPanel/Components/CreatedFilter.vue";

import Container      from "@/components/Ui/Containers/Container.vue";
import Accordion      from "@/components/Ui/Accordion/Accordion.vue";
import AccordionPanel from "@/components/Ui/Accordion/Panel.vue";

import {UserPointHistory} from "@/scripts/Response/PointShop/GetFullPointShopHistoryResponse";

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
    historyEntries: {
      type     : Array as unknown as Array<UserPointHistory>,
      required : true,
    }
  },
  emits: [
    'filterValueChanged'
  ],
  components: {
    Container,
    CreatedFilter,
    Accordion,
    AccordionPanel,
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
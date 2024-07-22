<template>
  <div>

    <Accordion>
      <AccordionPanel>

        <template #title>
          {{ $t('sort.accordion.mainLabel') }}
        </template>

        <template #content>

          <Container class="grid lg:grid-rows-1 lg:grid-cols-2 gap-2 mb-4 sm:grid-rows-1 sm:grid-cols-1">
            <GeneralSort v-model="sortValues.general"/>
          </Container>

        </template>
      </AccordionPanel>
    </Accordion>

  </div>
</template>

<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import Container      from "@/components/Ui/Containers/Container.vue";
import Accordion      from "@/components/Ui/Accordion/Accordion.vue";
import AccordionPanel from "@/components/Ui/Accordion/Panel.vue";

import GeneralSort from "@/views/JobOffer/Applications/Components/SortPanel/Components/GeneralSort.vue";

export default {
  name: "JobOfferApplicationSortPanel",
  data(): ComponentData {
    return {
      sortValues: {
        general: null,
      }
    }
  },
  emits: [
    'sortValueChanged'
  ],
  components: {
    Container,
    Accordion,
    AccordionPanel,
    GeneralSort,
  },
  watch: {
    sortValues: {
      deep: true,
      handler(): void {
        this.$emit('sortValueChanged', this.sortValues);
      }
    }
  }
}

</script>
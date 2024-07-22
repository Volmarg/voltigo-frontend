<template>
  <div>

    <Accordion>
      <AccordionPanel>

        <template #title>
          {{ $t('filters.accordion.mainLabel') }}
        </template>

        <template #content>

          <Container class="grid lg:grid-rows-1 lg:grid-cols-2 gap-2 mb-4 sm:grid-rows-1 sm:grid-cols-1">
            <CompanyNameFilter v-model="filterValues.companyName"/>
            <EmailAddressFilter v-model="filterValues.email"/>
          </Container>

          <Container class="grid lg:grid-rows-1 lg:grid-cols-2 gap-2 mb-4 sm:grid-rows-1 sm:grid-cols-1">
            <DateFromFilter v-model="filterValues.dateFrom"/>
            <DateToFilter v-model="filterValues.dateTo"/>
          </Container>

          <Container class="grid lg:grid-rows-1 lg:grid-cols-3 gap-2 mb-4 sm:grid-rows-1 sm:grid-cols-1">
            <JobTitleFilter v-model="filterValues.jobTitle"/>
          </Container>

        </template>
      </AccordionPanel>
    </Accordion>

  </div>
</template>

<script lang="ts">
import Container      from "@/components/Ui/Containers/Container.vue";
import Accordion      from "@/components/Ui/Accordion/Accordion.vue";
import AccordionPanel from "@/components/Ui/Accordion/Panel.vue";

import CompanyNameFilter  from "@/views/JobOffer/Applications/Components/FiltersPanel/Components/CompanyNameFilter.vue";
import EmailAddressFilter from "@/views/JobOffer/Applications/Components/FiltersPanel/Components/EmailAddressFilter.vue";
import JobTitleFilter     from "@/views/JobOffer/Applications/Components/FiltersPanel/Components/JobTitleFilter.vue";
import DateFromFilter     from "@/views/JobOffer/Applications/Components/FiltersPanel/Components/DateFromFilter.vue";
import DateToFilter       from "@/views/JobOffer/Applications/Components/FiltersPanel/Components/DateToFilter.vue";

import InitialFilterValuesMixin from "@/views/JobOffer/Applications/Mixin/Filter/InitialFilterValuesMixin.vue";

export default {
  name: "JobOfferApplicationFilterPanel",
  emits: [
    'filterValueChanged'
  ],
  components: {
    Container,
    Accordion,
    AccordionPanel,
    JobTitleFilter,
    CompanyNameFilter,
    EmailAddressFilter,
    DateFromFilter,
    DateToFilter,
  },
  mixins: [
    InitialFilterValuesMixin,
  ],
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
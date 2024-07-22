<template>
  <div class="grid grid-rows-2 grid-cols-10 gap-4 w-full xl:gap-10 lg:gap-2 sm:gap-8 md:grid-rows-1 sm:grid-cols-12 name-set-grid lg:mt-0 mt-10 xl:mt-4">

    <IncludedName
        class="included-name"
        @change="$emit('includedNameChange', $event)"
    />
    <ExcludedName
        class="excluded-name"
        @change="$emit('excludedNameChange', $event)"
    />

  </div>
</template>

<script lang="ts">

import IncludedName from "@/views/JobOffer/SearchResult/Details/Components/FiltersPanel/Company/components/IncludedName.vue";
import ExcludedName from "@/views/JobOffer/SearchResult/Details/Components/FiltersPanel/Company/components/ExcludedName.vue";

export default {
  components: {
    IncludedName,
    ExcludedName,
  },
  emits: [
    'includedNameChange',
    'excludedNameChange'
  ]
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/responsive.scss';

.included-name {
  @apply
  col-start-1
  col-end-13

  lg:col-start-1
  lg:col-end-7

  row-start-1
  row-end-1

  lg:row-start-1
  lg:row-end-1

  w-full
}

.excluded-name {
  @apply
  col-span-5

  col-start-1
  col-end-13

  lg:col-start-7
  lg:col-end-13

  row-start-2
  row-end-2

  lg:row-start-1
  lg:row-end-1
}

</style>
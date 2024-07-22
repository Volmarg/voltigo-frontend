<template>
  <Container class="flex justify-center">

    <div class="grid grid-cols-1 count-grid sm:grid-cols-3">
      <b>{{ $t('legend.label') }}: </b>
      <Legend
          :is-offer-count-result-visible="true"
      />
    </div>

  </Container>
</template>

<script lang="ts">
import Legend    from "@/views/JobOffer/SearchResult/Details/Components/Legend.vue";
import Container from "@/components/Ui/Containers/Container.vue";

export default {
  components: {
    Container,
    Legend
  },
}
</script>

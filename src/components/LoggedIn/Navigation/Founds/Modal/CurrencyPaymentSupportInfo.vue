<template>
  <div>
    <DescriptionBlock class="text-left">
      <p>{{ $t('foundsModal.info.notSupportingAllCurrencies') }}</p>
      <br/>
      <p>{{ $t('foundsModal.info.cantDetermineWhichCurrenciesAreSupported') }}</p>
    </DescriptionBlock>
  </div>
</template>

<script lang="ts">

import DescriptionBlock from "@/components/Page/InformationBlock.vue";

export default {
  components: {
    DescriptionBlock
  }
}
</script>
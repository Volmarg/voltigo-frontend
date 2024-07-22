<template>
  <div>
    <Tab :order-data="orderData" />
  </div>
</template>

<script lang="ts">
import Tab from "@/views/Payments/Overview/Components/SingleResult/Components/Tab.vue";

import {OrderData} from "@/scripts/Response/Order/GetOrdersDataResponse";

export default {
  data(){
    return {
      pdfDownloadRoute : "",
    }
  },
  props: {
    orderData: {
      type     : Object as unknown as OrderData,
      required : true,
    }
  },
  components: {
    Tab,
  }
}
</script>

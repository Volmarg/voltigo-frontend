<template>
  <div>
    <MultiSelect :options="selectOptions"
                 :label="$t('orderPaymentsOverview.filters.status.label')"
                 class="w-full h-full"
                 v-model="status"
                 @select="onEvent"
                 @deselect="onEvent"
                 @clear="onEvent"
                 @keydown="onEvent"
                 @paste="onEvent"
                 @input="onEvent"
                 @change="onEvent"
    />
  </div>
</template>

<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import MultiSelect from "@/components/Form/MultiSelect.vue";

import {OrderData} from "@/scripts/Response/Order/GetOrdersDataResponse";

export default {
  data(): ComponentData {
    return {
      status: null,
    }
  },
  components: {
    MultiSelect
  },
  props: {
    modelValue: {
      required: false,
    },
    ordersData: {
      type     : Array as unknown as Array<OrderData>,
      required : true,
    }
  },
  computed: {
    /**
     * @description returns status options
     */
    selectOptions(): Array<Record<string, string>> {
      if (!this.ordersData) {
        return [];
      }

      let statuses = [] as Array<Record<string, string>>;
      let addedStatuses = [] as Array<string>;
      for (let orderData of this.ordersData) {

        if (addedStatuses.includes(orderData.status)) {
          continue;
        }

        statuses.push({
          label: this.$t(`orderPaymentsOverview.filters.status.options.${orderData.status}`),
          value: orderData.status,
        })

        addedStatuses.push(orderData.status);
      }

      return statuses;
    }
  },
  methods: {
    onEvent(): void {
      this.$emit("update:modelValue", this.status);
    }
  }
}
</script>

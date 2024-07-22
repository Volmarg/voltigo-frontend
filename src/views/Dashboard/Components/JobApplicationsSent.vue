<template>
  <div>
    <Container>

      <h1 class="headline text-blue-500 mb-6">
        {{ $t('homeDashboard.applicationsChart.label.main')}}
      </h1>

      <div v-if="isAnyDataSet">
        <div class="flex justify-end mb-2">
          <div class="select-wrapper">
            <MultiSelect
                mode="single"
                :options="groupBySelect.options"
                :label="$t('homeDashboard.applicationsChart.filter.groupBy.label')"
                v-model="groupBySelect.value"
            />
          </div>

        </div>

        <div
            class="flex justify-end mb-2"
            v-show="isGroupByDay"
        >
          <div class="select-wrapper">
            <MultiSelect
                mode="single"
                :options="selectMonthOptions"
                :label="$t('homeDashboard.applicationsChart.filter.month.label')"
                v-model="selectMonth.value"
                class="select"
            />
          </div>
        </div>

        <div class="flex justify-end mb-2">
          <div class="select-wrapper">
            <MultiSelect
                mode="single"
                :options="yearSelectOptions"
                :label="$t('homeDashboard.applicationsChart.filter.year.label')"
                v-model="yearSelect.value"
                class="select"
            />
          </div>
        </div>
      </div>

      <div
          class="chart-wrapper"
          :class="{
            'no-data': !isAnyDataSet
          }"
      >
        <canvas
            ref="chartWrapper"
            height="100%"
        ></canvas>
      </div>

    </Container>

  </div>
</template>

<script lang="ts">/**
 * Based on:
 * - {@link https://www.chartjs.org/docs/latest/}
 */
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import {ChartConfiguration} from 'chart.js/auto'

import MultiSelect from "@/components/Form/MultiSelect.vue";
import Container   from "@/components/Ui/Containers/Container.vue";

import CountGroupingByDateMixin from "@/views/Dashboard/Components/Mixin/CountGroupingByDateMixin.vue";

export default {
  data(): ComponentData {
    return {
      chartInstance: null,
      chartData: [],
      refName: "groupBy",
      yearSelect: {
        value: null,
      },
      selectMonth: {
        value: null,
      },
      groupBySelect: {
        value: null,
        options: [
          {
            label: this.$t('homeDashboard.applicationsChart.filter.groupBy.options.day'),
            value: "day",
          },
          {
            label: this.$t('homeDashboard.applicationsChart.filter.groupBy.options.month'),
            value: "month",
          }
        ]
      }
    }
  },
  props: {
    dataGroupedByDay: {
      type: Array,
      required: true,
    }
  },
  mixins: [
    CountGroupingByDateMixin,
  ],
  components: {
    MultiSelect,
    Container
  },
  computed: {
    /**
     * @description check if any data was delivered / set at all
     */
    isAnyDataSet(): boolean {
      return (0 !== this.dataGroupedByDay.length);
    },
    /**
     * @description configuration of the chart, it's options etc.
     */
    chartConfig(): ChartConfiguration {
      return {
        type: 'bar',
        data: {
          labels: this.chartLabels,
          datasets: [
            {
              /** {@link https://www.chartjs.org/docs/latest/charts/bar.html#barthickness} */
              barThickness: 40, // width of the bar
              label: this.$t('homeDashboard.applicationsChart.label.tooltip.applicationsSent'),
              data: this.chartData.map(row => row.count)
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: false,
            },
            tooltip: {
              usePointStyle: true,
              callbacks: {
                //@ts-ignore - because its valid configuration which works but TS cries that it's not - based on returned type
                labelPointStyle: function () {
                  return {
                    /** {@link https://www.chartjs.org/docs/latest/configuration/elements.html#point-styles} */
                    pointStyle: false, // removes icon in 'on-hover' tooltip
                  };
                }
              }
            }
          }
        },
      };
    }
  },
}
</script>

<style lang="scss" scoped>
.chart-wrapper {
  max-height: 300px;
  width: 100%;
  &.no-data {
    max-height: 200px;
  }
}

.select-wrapper {
  @apply lg:w-1/4 md:w-2/3 w-full
}

</style>
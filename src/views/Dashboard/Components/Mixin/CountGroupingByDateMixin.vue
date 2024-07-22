<script lang="ts">
import ChartJsMixin from "@/mixins/Libs/ChartJsMixin.vue";

export default {
  mixins: [
    ChartJsMixin
  ],
  computed: {
    /**
     * @description retrieve current calendar year
     */
    currentYear(): number {
      return new Date().getFullYear();
    },
    /**
     * @description retrieve current calendar month
     */
    currentMonth(): number {
      return (new Date().getMonth()) + 1; // because getMonth starts from 0
    },
    /**
     * @description is the current active grouping set to "group by day"
     */
    isGroupByDay(): boolean {
      return (this.groupBySelect.value === "day");
    },
    /**
     * @description will build the chart labels (texts below each bar)
     */
    chartLabels(): Array<string> {
      if(this.groupBySelect.value === "month"){
        return this.chartData.map((row) => {
          return this.$t(`dateTime.months.${row.month}`);
        });
      }

      return this.chartData.map((row) => {
        return `${this.$t('homeDashboard.common.chart.day.label')}${row.day}`;
      });
    },
    /**
     * @description will build array of options for the "month select"
     */
    selectMonthOptions(): Array<Record<string,string | number | boolean>> {
      let options     = [] as Array<Record<string, string | number | boolean>>;
      let addedMonths = [] as Array<string>;

      let index = 1;
      while (index <= 12) {
        let monthName = this.$t(`dateTime.months.${index}`);
        if (addedMonths.includes(monthName)) {
          index++;
          continue;
        }

        let disabled = true;
        let label    = `${monthName} (${this.$t('homeDashboard.common.chart.message.noData')})`;

        if (this.yearSelect.value) {
          for (let chartData of this.dataGroupedByDay) {
            let year  = chartData['year'];
            let month = chartData['month'];
            let count = chartData['count'];

            if (
                    year === this.yearSelect.value
                &&  month === index
                &&  count > 0
            ) {
              label    = monthName;
              disabled = false;
              break;
            }
          }
        }

        addedMonths.push(monthName);
        options.push({
          label: label,
          value: index,
          disabled: disabled,
        })

        index++;
      }

      return options;
    },
    /**
     * @description build array of options for the month select
     */
    yearSelectOptions(): Array<Record<string, number>> {
      let options     = [] as Array<Record<string, number>>;
      let pushedYears = [] as Array<number>;
      for (let chartData of this.dataGroupedByDay) {
        let year = chartData['year'];
        if (pushedYears.includes(year)) {
          continue;
        }

        pushedYears.push(year);
        options.push({
          label: year,
          value: year
        });
      }

      return options;
    },
  },
  methods: {
    /**
     * @description handles building the chart data based on user selected options in selects
     */
    handleGrouping(): void {
      switch (this.groupBySelect.value) {
        case "day":
          this.groupChartDataByDay();
          break;

        case "month": // fallthrough
        default:
          this.groupChartDataByMonth();
      }

      this.refreshChart(this.chartConfig, this.$refs.chartWrapper);
    },
    /**
     * @description builds the chart data for case when grouping is set to "group by day"
     */
    groupChartDataByDay(): void {
      let groupedData = [] as Array<Array<Array<Record<string, string | number>>>>;
      for (let data of this.dataGroupedByDay) {
        let year  = data['year'];
        let month = data['month'];

        if (!groupedData[year]) {
          groupedData[year] = [] as Array<Array<Record<string, string | number>>>;
        }

        if (!groupedData[year][month]) {
          groupedData[year][month] = [] as Array<Record<string, string | number>>;
        }

        groupedData[year][month].push(data)

      }

      let yearData = groupedData[this.yearSelect.value] ?? [];
      if (0 === yearData.length) {
        this.chartData = [];
        return;
      }

      this.chartData = yearData[this.selectMonth.value] ?? [];
    },
    /**
     * @description builds the chart data for case when grouping is set to "group by month"
     */
    groupChartDataByMonth(): void {
      let groupedData = [] as Array<Array<Record<string, string | number>>>;
      let monthsAdded = [] as Array<string>;
      for (let data of this.dataGroupedByDay) {
        let year  = data['year'];
        let month = data['month'];
        let count = data['count'];

        if (!groupedData[year]) {
          groupedData[year] = [];
        }

        if (!monthsAdded.includes(month)) {
          groupedData[year].push({...data});

          monthsAdded.push(month);
          continue;
        }

        for (let updatedEntry of groupedData[year]) {
          if (updatedEntry["month"] === month) {
            updatedEntry["count"] += count;
          }
        }
      }

      this.chartData = groupedData[this.yearSelect.value] ?? [];
    },
    /**
     * @description will initially select month and year for the year & month select
     */
    initiallySelectMonthAndYear(): void {

      if (!this.yearSelect.value) {
        /**
         * @description decide used pre-selected year, cannot always be current year because sometimes current year
         *              might not be on select list at all
         */
        let selectedYear = null;
        for (let year of this.yearSelectOptions) {
          selectedYear = year.value;
          if (selectedYear == this.currentYear) {
            break;
          }
        }

        this.yearSelect.value = selectedYear;
      }

      if (!this.selectMonth.value) {
        /**
         * @description decide used pre-selected month, cannot always be current month because it might not have any data delivered
         */

        let selectedMonth = null;
        for (let month of this.selectMonthOptions) {
          if (month.disabled) {
            continue;
          }

          selectedMonth = month.value;
          if (selectedMonth == this.currentMonth) {
            break;
          }
        }

        this.selectMonth.value = selectedMonth;
      }

    }
  },
  watch: {
    dataGroupedByDay: {
      deep: true,
      handler() {
        if (0 === this.dataGroupedByDay.length) {
          return;
        }

        this.destroyChart();
        this.$nextTick(() => {
          this.refreshChart(this.chartConfig, this.$refs.chartWrapper);
          this.initiallySelectMonthAndYear();
        })
      }
    },
    'groupBySelect.value'(): void {
      if (!this.chartInstance) {
        return;
      }

      this.handleGrouping();
    },
    'selectMonth.value'(): void{
      if (!this.chartInstance) {
        return;
      }

      this.handleGrouping();
      this.refreshChart(this.chartConfig, this.$refs.chartWrapper);
    },
    'yearSelect.value'(): void {
      if (!this.chartInstance) {
        return;
      }

      this.handleGrouping();
      this.refreshChart(this.chartConfig, this.$refs.chartWrapper);
    }
  },
  mounted(): void {
    this.createChart(this.chartConfig, this.$refs.chartWrapper);
    this.chartData = this.dataGroupedByDay;
    this.$nextTick(() => {
      this.initiallySelectMonthAndYear();
      this.groupBySelect.value = "month"
    })


  },
}
</script>

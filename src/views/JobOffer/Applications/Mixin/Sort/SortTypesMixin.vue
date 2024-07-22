<script lang="ts">
export default {
  name: "JobOfferApplicationFilterPanelSortTypesMixin",
  data(){
    return {
      sortOptions: {
        dateDescending: "dateDescending",
        dateAscending: "dateAscending",
        companyNameDescending: "companyNameDescending",
        companyNameAscending: "companyNameAscending",
        jobTitleDescending: "jobTitleDescending",
        jobTitleAscending: "jobTitleAscending",
      },
    }
  },
  computed: {
    /**
     * @description will return the sort options
     */
    sortOptionsForSelect(): Array<Record<string, string>> {
      let options = [] as Array<Record<string, string>>;
      for (let optionValue of Object.keys(this.sortOptions)) {
        options.push({
          value : optionValue,
          label : this.$t(`sort.options.${optionValue}.label`),
        });
      }

      return options;
    }
  }
}
</script>
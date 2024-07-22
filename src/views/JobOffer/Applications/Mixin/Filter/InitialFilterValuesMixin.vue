<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";
import {FilterValues} from "@/views/JobOffer/Applications/Types/Filter/FilterTypes";

export default {
  data(): ComponentData {
    return {
      filterValues: {
        companyName: null,
        jobTitle: null,
        dateFrom: null,
        dateTo: null,
        email: null,
      }  as FilterValues,
    }
  },
}
</script>
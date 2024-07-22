<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";

export default {
  name: "JobOfferApplicationFilterPanelSortTypesInitialValuesMixin",
  data(): ComponentData {
    return {
      sortValues: {
        general: null,
      }
    }
  },
}
</script>
<script lang="ts">
import {ComponentData} from "@/scripts/Vue/Types/Components/types";
import {BanType}       from "@/scripts/Response/Ban/BanResponse";

export default {
  data(): ComponentData {
    return {
      ban: {
        type: {
          user : BanType[BanType.USER],
          ip   : BanType[BanType.IP]
        }
      }
    }
  }
}
</script>
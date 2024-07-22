<script lang="ts">
import {RightSidebarComponentData} from "@/scripts/Vue/Types/Components/Sidebar";

export default {
  methods: {
    /**
     * @description will show right sidebar
     *
     *              Using a bit dirty solution of setting the data attribute false / then true to force the
     *              component to `do` it's thing when prop changes, then sets the property to the PROPER state
     *              `true` to trigger the real logic.
     *
     *              Has to be wrapped in `nextTick` else, setting property one after another won't trigger prop change
     */
    showRightSidebar(eventData: RightSidebarComponentData): void {
      this.$emit("toggleRightSidebar", {isSidebarVisible: false});
      this.$emit("rightSidebarContentChanged", eventData);

      this.$nextTick(() => {
        this.$emit("toggleRightSidebar", {isSidebarVisible: true});
      })
    }
  }
}
</script>
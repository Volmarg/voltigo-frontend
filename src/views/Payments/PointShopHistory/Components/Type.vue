<template>
  <div>

    <!-- used -->
    <div
        v-if="userPointHistory.isUsed()"
        class="type-wrapper"
    >
      <p class="text-wrapper">
        <fa
            icon="minus"
            class="text-minus"
        />

        <span class="text-minus">{{ pointsDifference }}</span>
      </p>

      <img
          src="../../../../../public/image/system/gem/gem-32.png"
          class="gem-icon"
      />
    </div>

    <!-- received -->
    <div
        v-else
        class="type-wrapper"
    >
      <p class="text-wrapper">
        <fa
            icon="plus"
            class="text-plus"
        />
        <span class="text-plus">{{ pointsDifference }}</span>
      </p>

      <img
          src="../../../../../public/image/system/gem/gem-32.png"
          class="gem-icon"
      />
    </div>


  </div>
</template>

<script lang="ts">
import {UserPointHistory} from "@/scripts/Response/PointShop/GetFullPointShopHistoryResponse";

export default {
  props: {
    userPointHistory: {
      type: Object as unknown as UserPointHistory,
      required: true,
    }
  },
  computed: {
    /**
     * @description calculate points difference between what was before and what is now
     */
    pointsDifference(): number {
      if (this.userPointHistory.isUsed()) {
        return this.userPointHistory.amountBefore - this.userPointHistory.amountNow;
      }

      return this.userPointHistory.amountNow - this.userPointHistory.amountBefore
    }
  }
}
</script>

<style lang="scss" scoped>
  .text {
    text-shadow: 2px 2px 3px rgba(255,255,255,0.2);
    @apply self-center lg:text-xl
  }

  .text-minus {
    @extend .text;
    @apply text-red-600 font-bold
  }

  .text-plus {
    @extend .text;
    @apply self-center text-green-600 font-bold
  }

  .text-wrapper {
    @apply flex mr-2
  }

  .type-wrapper {
    @apply flex
  }

  .gem-icon {
    height: 26px;
  }
</style>
<template>
  <div class="flex justify-center flex-col">
    <img
        src="/public/image/system/gem/gem-256.png"
        :class="{
          'filter grayscale': isProductBlocked
        }"
    />
  </div>
</template>

<script lang="ts">
export default {
  props: {
    isProductBlocked: {
      type: Boolean,
      required: true,
    }
  }
}
</script>
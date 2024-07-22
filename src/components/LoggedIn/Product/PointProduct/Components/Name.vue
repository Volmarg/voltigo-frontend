<template>
  <div class="text-left">
    <span
        class="name font-bold"
        :class="{
          'text-blue-500': !isProductBlocked,
          'text-gray-500': isProductBlocked,
        }"
    >
    {{ text }}
    </span>
  </div>
</template>

<script lang="ts">

export default {
  props: {
    text: {
      type     : String,
      required : true,
    },
    isProductBlocked: {
      type: Boolean,
      required: true,
    }
  }
}
</script>

<style lang="scss">
.name {
  font-size: 20px;
}
</style>
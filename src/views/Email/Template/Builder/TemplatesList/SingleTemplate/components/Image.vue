<template>
  <div class="relative">

    <img :src="`data:image/jpeg;base64,${template.exampleBase64}`"
         class="w-full object-cover object-center rounded-lg shadow-md email-template-card-image"
         v-if="template.exampleBase64"
    />

    <img class="w-full rounded-xl email-template-card-image"
         src="/image/system/no-image.png"
         v-else
    />
  </div>
</template>

<script lang="ts">
export default {
  props: {
    template: {
      type     : Object,
      required : true,
    }
  },
}
</script>
<template>
  <li class="timeline-item">
    <div
        class="timeline-info"
        v-if="info"
    >
      <span>{{ info }}</span>
    </div>
    <div class="timeline-marker"></div>
    <div class="timeline-content">
      <h3
          class="timeline-title"
          v-if="title"
      >
        {{ title }}
      </h3>
      <p class="timeline-description"
         v-html="description"
      />
    </div>
  </li>
</template>

<script lang="ts">
export default {
  props: {
    info: {
      type: String,
      required: false,
      default: '',
    },
    title: {
      type: String,
      required: false,
      default: '',
    },
    description: {
      type: String,
      required: false,
      default: '',
    },
  }
}
</script>

<style lang="scss">

</style>
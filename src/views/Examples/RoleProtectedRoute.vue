<template>
  <div>
    This route is protected by role named: {{ requiredRoleForRoute }}
  </div>
</template>

<script lang="ts">

export default {
  computed: {
    requiredRoleForRoute(): string {
      return this.$route.meta.requiredRole;
    }
  }
}
</script>
<template>
  <vue-country-flag :country='countryIsoCode'/>
</template>

<script lang="ts">
import CountryFlag from 'vue-country-flag-next';

/**
 * @link https://github.com/P3trur0/vue-country-flag/
 */
export default {
  name: "CountryFlag",
  props: {
    countryIsoCode: {
      type: String,
      required: true,
    }
  },
  components: {
    "vue-country-flag": CountryFlag,
  }
}
</script>
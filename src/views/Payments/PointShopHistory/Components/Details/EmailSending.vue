<template>
  <ul class="main-list">
    <li
        v-for="(applicationData, index) in emailSendingProductData.applicationsData"
        :key="JSON.stringify(applicationData)"
        class="one-mail-info"
    >
      <ul>
        <li><div class="email-num">#{{index + 1}}</div></li>
        <li>
          <span class="chunk-label">{{ $t('pointShop.modal.details.type.emailSending.companyName')}}: </span>
          <span class="chunk-data">{{ applicationData.offerCompanyName }}</span>
        </li>
        <li>
          <p class="chunk-label">{{ $t('pointShop.modal.details.type.emailSending.offerUrl') }}: </p>
          <a
              :href="applicationData.offerUrl"
              target="_blank"
              class="chunk-data"
          >{{ applicationData.offerTitle }}</a>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script lang="ts">
export default {
  props: {
    /** @var {EmailSendingProductData} */
    emailSendingProductData: {
      type: Object,
      required: true,
    }
  }
}
</script>

<style lang="scss" scoped>
.main-list {
  max-height: 500px;
  @apply text-left p-5 overflow-y-scroll
}

.chunk-label {
  @apply font-bold inline
}

.chunk-data {
  @apply inline
}

a.chunk-data {
  @apply underline text-blue-500
}

.one-mail-info + .one-mail-info {
  @apply mt-5
}

.email-num {
  @apply font-bold text-lg
}
</style>
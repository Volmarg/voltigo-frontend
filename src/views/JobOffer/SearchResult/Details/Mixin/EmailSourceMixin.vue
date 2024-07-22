<script lang="ts">
export default {
  computed: {
    /**
     * @description return E-Mail hover text
     */
    emailSourceHoverText(): string {
      let source =  (this.jobOffer.contactDetail.emailFromJobOffer ? 'offer' : 'other');
      return this.$t(`searchResults.singleCard.email.source.${source}`);
    },
    /**
     * @description return fontawesome icon name for E-Mail source
     */
    emailSourceAwesomeIconName(): string {
      return (this.jobOffer.contactDetail.emailFromJobOffer ? 'check' : 'question');
    },
    /**
     * @description return E-Mail text color
     */
    emailSourceColorClass(): string {
      return (this.jobOffer.contactDetail.emailFromJobOffer ? 'text-green-500' : 'text-orange-500');
    },
  }
}
</script>
<template>
  <ButtonRounded
      :text="label"
      @click="download"
      button-extra-classes="h-full pt-3 pb-3 sm:pb-0 sm:pt-0"
  />
</template>

<script lang="ts">
import CsvGenerator from "@/scripts/Core/Services/Generator/CsvGenerator";
import moment       from "moment";

import {ComponentData}    from "@/scripts/Vue/Types/Components/types";
import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";

import Base64DownloadService from "@/scripts/Core/Services/Download/Base64DownloadService";

import ButtonRounded from "@/components/Navigation/Button/ButtonRounded.vue";


export default {
  data(): ComponentData {
    return {
      value: "",
    }
  },
  props: {
    savedOffers: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      required: true,
    }
  },
  components: {
    ButtonRounded,
  },
  methods: {
    /**
     * @description builds the offers excel and downloads it
     */
    download() {
      let jobOffers: Array<JobOfferAnalyzed>  = this.savedOffers;
      let headers = [
          this.$t('actionsPanel.getCsv.csv.headers.title'),
          this.$t('actionsPanel.getCsv.csv.headers.url'),
          this.$t('actionsPanel.getCsv.csv.headers.postedDate'),
          this.$t('actionsPanel.getCsv.csv.headers.offerLanguage'),
          this.$t('actionsPanel.getCsv.csv.headers.mentionedHumanLanguages'),
          this.$t('actionsPanel.getCsv.csv.headers.email'),
          this.$t('actionsPanel.getCsv.csv.headers.emailMarking'),
      ];

      let data: Array<Array<unknown>> = [];
      for (let singleOffer of jobOffers) {
        let rowData = [
          singleOffer.jobTitle,
          singleOffer.jobOfferUrl,
          singleOffer.jobPostedDateTime ?? '',
          singleOffer.jobOfferLanguage ?? '',
          singleOffer.humanLanguages.join(","),
          singleOffer.contactDetail.email,
          singleOffer.contactDetail.emailFromJobOffer ? '✔️' : '❌',
        ];

        for (let dataEntryIndex in rowData) {
          rowData[dataEntryIndex] = CsvGenerator.replaceSeparatorCharacter(rowData[dataEntryIndex]);
        }

        data.push(rowData);
      }

      let searchId = this.$route.params.id;
      let now      = moment().format("Y_MM_D_HH_m_s")
      let fileName = `Offers_${searchId}_${now}`;

      let base64 = CsvGenerator.getBase64ContentFromArray(data, headers);
      Base64DownloadService.downloadPdfFile(base64, fileName, "csv", "text/csv", 'utf-8', true);
    }
  }
}
</script>
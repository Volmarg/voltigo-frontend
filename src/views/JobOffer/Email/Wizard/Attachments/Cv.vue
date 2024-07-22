<template>
  <div>

    <h1 class="text-blue-500 font-extrabold text-center job-detail-title mb-4 header">
      {{ $t('components.jobOfferEmailWizard.steps.selectAttachments.header') }}
    </h1>

    <hr/>

    <div class="gap-4 m-4 divide-x divide-gray-200 template-n-preview-grid">

      <div>

        <MultiSelect :options="optionsForSelect"
                     :label="$t('components.jobOfferEmailWizard.steps.selectAttachments.cv.multiselect.label')"
                     class="w-full h-full"
                     v-model="selectedCvId"
        />

      </div>
    </div>

  </div>
</template>

<script lang="ts">
import MultiSelect from "@/components/Form/MultiSelect.vue";

import {ComponentData} from "@/scripts/Vue/Types/Components/types";

import UploadedFileDTO     from "@/scripts/Dto/File/UploadedFileDTO";
import SymfonyRoutes       from "@/router/SymfonyRoutes";
import SymfonyFileRoutes   from "@/router/SymfonyRoutes/SymfonyFileRoutes";
import GetUserCvList       from "@/scripts/Response/File/Upload/GetUserCvList";
import StringTypeProcessor from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";
import BaseError           from "@/scripts/Core/Error/BaseError";

export default {
  data(): ComponentData {
    return {
      cvList       : [] as Array<UploadedFileDTO>,
      selectedCvId : null,
    }
  },
  components: {
    MultiSelect,
  },
  emits: [
    'cvAttachmentSelectionChange'
  ],
  computed: {
    /**
     * @description will return the sort options
     */
    optionsForSelect(): Array<Record<string, string>> {
      let options = [] as Array<Record<string, string>>;
      for (let cv of this.cvList) {
        let label = cv.originalName;
        if (!StringTypeProcessor.isEmptyString(cv.userBasedName)) {
          label += ` (${cv.userBasedName})`
        }

        options.push({
          value : cv.id,
          label : label,
        });
      }

      return options;
    }
  },
  methods: {
    /**
     * @description reset the currently selected cv id
     */
    resetSelectedCvId(): void {
      this.selectedCvId = null;
    },
    /**
     * @description makes ajax call and fetches the base information about user uploaded cv files
     */
    async getUserCvFiles(): Promise<void> {
      let calledUrl = SymfonyRoutes.buildUrl(SymfonyFileRoutes.GET_USER_CV_LIST);
      this.$rootEvent.showFullPageLoader();
      this.$axios.getWithCsrf(calledUrl, GetUserCvList).then((response: GetUserCvList) => {
        this.$rootEvent.hideFullPageLoader();
        this.cvFiles = [];
        this.$nextTick( () => {
          this.cvList = response.filesData;
        })
      })
    },
    /**
     * @description will return the cv file for selected id from the list
     */
    getCvForSelectedId(): UploadedFileDTO | null {
      if (null === this.selectedCvId) {
        return null;
      }

      for (let cvFile of this.cvList) {
        if (cvFile.id === this.selectedCvId) {
          return cvFile;
        }
      }

      throw new BaseError(`Cv was selected but its id was not found on cv list (?). Selected id: ${this.selectedCvId}`);
    }
  },
  async mounted() {
    await this.getUserCvFiles();
  },
  watch: {
    selectedCvId(): void {
      if (!this.selectedCvId) {
        return;
      }

      this.$emit("cvAttachmentSelectionChange", this.getCvForSelectedId())
    }
  }
}
</script>
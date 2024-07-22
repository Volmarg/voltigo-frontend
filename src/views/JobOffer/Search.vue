<template>

  <WarningBlocks
      :is-offers-handler-alive="isOffersHandlerAlive"
      :is-offers-handler-quota-reached="isOffersHandlerQuotaReached"
  />

  <div>

    <Accordion class="important-information-accordion">
      <AccordionPanel class="accordion-panel">
        <template #title>
          {{ $t('jobOfferSearch.page.accordion.information.header') }}
        </template>
        <template #content>
          <description-block :text="$t('jobOfferSearch.page.description')"
                             class="mb-5 bg-white text-gray-500 text-2md"
          />
          <LocationBasedSearchInfo />
        </template>
      </AccordionPanel>
    </Accordion>

    <LimitReachedInfo v-if="isMaxActiveCallsReached"/>
    <LimitInfoBlock :active-calls-count="activeCallsCount"/>
    <ExamplesButton @button-click="isExamplesLightboxVisible = true" />

    <container :class="{
      'barely-visible-non-interactive': !isPageActive
    }">

      <div class="fields-wrapper grid lg:grid-cols-2 grid-cols-1 gap-4">

        <!-- job search keywords -->
        <div class="single-select-wrapper">
          <question-mark :text="$t('jobOfferSearch.filters.jobSearchKeywords.help')"
                         class="align-self-center job-search-keywords-question-mark"
          />

          <keywords tag-classes="bg-blue-500"
                    ref="jobSearchKeywords"
                    :label="$t('jobOfferSearch.filters.jobSearchKeywords.label') + maxAllowedKeywords"
                    :required="true"
                    :violations="violations.jobSearchKeywords"
                    :max-options="maxAllowedKeywords"
                    :disabled="!isPageActive"
                    v-model="jobSearchKeywords"
                    class="w-full"
          />
        </div>

        <!-- target area -->
        <div class="single-select-wrapper">
          <question-mark :text="$t('jobOfferSearch.filters.targetArea.help')"
                         class="align-self-center"
          />

          <multiselect :options="jobSearchAreaOptions"
                       :label="$t('jobOfferSearch.filters.targetArea.label')"
                       class="w-full h-full"
                       v-model="targetArea"
                       :required="true"
                       :disabled="!isPageActive"
                       :violations="violations.targetArea"
          />
        </div>

        <!-- location name -->
        <div class="single-input-wrapper">
          <question-mark :text="$t('jobOfferSearch.filters.locationName.help')"
                         class="align-self-center"
          />

          <vue-input :label="$t('jobOfferSearch.filters.locationName.label')"
                     :is-gray="true"
                     :is-disabled="!isPageActive"
                     v-model="locationName"
                     type="text"
          />
        </div>

        <!-- max distance -->
        <div class="single-input-wrapper">
          <question-mark :text="$t('jobOfferSearch.filters.maxDistance.help')"
                         class="align-self-center"
          />

          <vue-input :label="$t('jobOfferSearch.filters.maxDistance.label')"
                     :is-gray="true"
                     :errors="violations.maxDistance"
                     :is-disabled="!isPageActive"
                     v-model="maxDistance"
                     type="number"
                     min="0"
          />
        </div>

      </div>

      <div class="mt-6 flex justify-center flex-col sm:flex-row">
        <Checkbox
            v-model="isConfirmedByUser"
            class="transform scale-75"
        />
        <span class="ml-2 align-self-center text-gray-500">{{ $t('jobOfferSearch.page.confirmation.text') }}</span>
        <AsteriskRequired />
      </div>

      <div class="flex justify-center">
        <MediumButtonWithIcon
                        :text="$t('jobOfferSearch.page.buttons.continue.label')"
                        class="mt-5 submit-job-searching"
                        @click="handleContinue"
                        :class="{
                          'pointer-events-none touch-action-none': !isPageActive || !isConfirmedByUser
                        }"
                        :background-color-class="(!isPageActive || !isConfirmedByUser ? 'bg-gray-400' : 'bg-blue-500')"
        />
      </div>
    </container>

    <AdvancedSettingModal
        :force-is-visible="isSettingModalVisible"
        :job-search-keywords="jobSearchKeywords"
        @modal-closed="isSettingModalVisible = false"
        @submitted="handleSearch"
    />

  </div>

  <v-tour
      :name="tourName"
      :steps="searchTourSteps"
      :callbacks="searchTourCallbacks"
  />

  <ExamplesLightbox
      :force-is-visible="isExamplesLightboxVisible"
      @hide="isExamplesLightboxVisible = false"
  />
</template>

<script lang="ts">
import {ComponentData, ComponentSetup} from "@/scripts/Vue/Types/Components/types";

import AdvancedSettingModal from "@/views/JobOffer/Search/AdvancedSettingModal.vue";
import ExamplesLightbox     from "@/views/JobOffer/Search/ExamplesLightbox.vue"
import ExamplesButton       from "@/views/JobOffer/Search/ExamplesButton.vue";
import MediumButtonWithIcon from "@/components/Navigation/Button/MediumButtonWithIcon.vue";
import AsteriskRequired     from "@/components/Form/AsteriskRequired.vue";
import Checkbox             from "@/components/Form/Checkbox.vue";
import WarningBlocks        from "@/views/JobOffer/Search/WarningBlocks.vue";
import VueInput             from "@/components/Form/Input.vue";
import Container            from "@/components/Ui/Containers/Container.vue";
import Keywords             from "@/components/LoggedIn/JobOffer/Filters/Keywords.vue";
import QuestionMarkAbout    from "@/components/Ui/QuestionMarkAbout.vue";
import MultiSelect          from "@/components/Form/MultiSelect.vue";
import DescriptionBlock     from "@/components/Page/InformationBlock.vue";
import Accordion            from "@/components/Ui/Accordion/Accordion.vue";
import AccordionPanel       from "@/components/Ui/Accordion/Panel.vue";

import {required, helpers} from "@vuelidate/validators";
import useVuelidate        from "@vuelidate/core";

import TourMixin               from "@/views/JobOffer/Search/Mixin/TourMixin.vue";
import SystemStateMixin        from "@/mixins/System/SystemStateMixin.vue";
import LocationBasedSearchInfo from "@/views/JobOffer/Search/LocationBasedSearchInfo.vue";
import LimitInfoBlock          from "@/views/JobOffer/Search/LimitInfoBlock.vue";
import LimitReachedInfo        from "@/views/JobOffer/Search/LimitReachedInfo.vue";
import BaseApiResponseMixin    from "@/scripts/Vue/Mixins/Response/BaseApiResponseMixin.vue";
import VuelidateHandler        from "@/scripts/Vue/Mixins/VuelidateHandler.vue";

import IsoCountries                 from "@/scripts/Libs/IsoCountries";
import SymfonyRoutes                from "@/router/SymfonyRoutes";
import SymfonyJobOfferRoutes        from "@/router/SymfonyRoutes/SymfonyJobOfferRoutes";
import ToastNotification            from "@/scripts/Libs/ToastNotification";
import StringTypeProcessor          from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";
import SymfonyJobServicesRoutes     from "@/router/SymfonyRoutes/SymfonyJobServicesRoutes";
import GetSupportedCountries        from "@/scripts/Response/Job/Service/GetSupportedCuntries";
import SymfonySystemRoutes          from "@/router/SymfonyRoutes/SymfonySystemRoutes";
import CheckActiveJobSearchResponse from "@/scripts/Response/System/Restriction/CheckActiveJobSearchResponse";
import UserController               from "@/scripts/Core/Controller/UserController";
import JwtTokenHandler              from "@/scripts/Core/Security/JwtTokenHandler";
import NumberTypeProcessor          from "@/scripts/Core/Services/TypesProcessors/NumberTypeProcessor";
import LocalStorageService          from "@/scripts/Core/Services/Storage/LocalStorageService";

import {SystemDisabledState, systemDisabledStore} from "@/scripts/Vue/Store/SystemDisabledState";


type JobSearchAreaInformation = {
  areaName: string,
  humanFriendlyName: string,
}

/**
 * @description validator should target to return true (when it's valid)
 */
const maxDistanceValidator = function() {
  return (
          (StringTypeProcessor.isEmptyString(this.locationName) && StringTypeProcessor.isEmptyString(this.maxDistance, false))
      ||  (!StringTypeProcessor.isEmptyString(this.locationName) && StringTypeProcessor.isEmptyString(this.maxDistance, false))
      ||  (!StringTypeProcessor.isEmptyString(this.locationName) && !StringTypeProcessor.isEmptyString(this.maxDistance, false))
  );
}

/**
 * @description validator should target to return true (when it's valid)
 */
const maxDistanceBelowZeroValidator = function () {
  return (
      (
          null !== this.maxDistance
          && this.maxDistance >= 0
      )
      || this.locationName
  );
}

export default {
  setup: (): ComponentSetup => ({ v$: useVuelidate() }),
  data: (): ComponentData => {
    return {
      isSettingModalVisible: false,
      isExamplesLightboxVisible: false,
      systemDisabledStateStore: systemDisabledStore() as unknown as SystemDisabledState,
      isConfirmedByUser: false,
      tourName: LocalStorageService.TOUR_JOB_OFFER_SEARCH,
      pointsFeeCheckSuccess: true,
      isOffersHandlerAlive: true,
      isOffersHandlerQuotaReached: false,
      supportedAreasInformation: [] as Array<JobSearchAreaInformation>,
      targetArea: null,
      maxDistance: '', // empty string - on purpose, else validation of field fails
      locationName: null,
      jobSearchKeywords: [],
      jobSearchAreaOptions: [] as Array<string>,
      config: {
        keywords: {
          max: 4, // based on the job searcher (4 takes already long for pagination = 4)
        }
      },
      violations: {
        jobSearchKeywords: [],
        targetArea: [],
        maxDistance: [],
      },
      isMaxActiveCallsReached: false,
      activeCallsCount: 0,
    }
  },
  validations(): Record<string, unknown>{
    return {
      jobSearchKeywords: {
        required: helpers.withMessage(this.$t('validations.required'), required),
      },
      targetArea: {
        required: helpers.withMessage(this.$t('validations.required'), required),
      },
      maxDistance: {
        maxDistanceValidator: helpers.withMessage(this.$t('jobOfferSearch.violations.distanceWithoutLocation'), maxDistanceValidator),
        maxDistanceBelowZeroValidator: helpers.withMessage(this.$t('jobOfferSearch.violations.distanceBelowZero'), maxDistanceBelowZeroValidator)
      }
    }
  },
  components: {
    AdvancedSettingModal,
    ExamplesButton,
    ExamplesLightbox,
    Checkbox,
    "container"         : Container,
    "keywords"          : Keywords,
    "question-mark"     : QuestionMarkAbout,
    "description-block" : DescriptionBlock,
    "multiselect"       : MultiSelect,
    MediumButtonWithIcon,
    VueInput,
    LimitReachedInfo,
    LimitInfoBlock,
    WarningBlocks,
    LocationBasedSearchInfo,
    AccordionPanel,
    Accordion,
    AsteriskRequired,
  },
  mixins: [
    BaseApiResponseMixin,
    SystemStateMixin,
    VuelidateHandler,
    TourMixin,
  ],
  computed: {
    /**
     * @description max keywords which can be inserted into the keywords input
     */
    maxAllowedKeywords(): number {
      return (new UserController).getLoggedInUserData().account.maxSearchedKeywords as number;
    },
    /**
     * @description check if page itself is active, can user make anything on it at all
     */
    isPageActive(): boolean {
      return (
              this.isOffersHandlerAlive
          &&  !this.isOffersHandlerQuotaReached
          &&  !this.isMaxActiveCallsReached
          &&  this.pointsFeeCheckSuccess
      );
    },
    /**
     * @description check if user should be able to begin search at all
     *
     */
    canSearch(): boolean {
      return (
              this.isVuelidateResultValid
          &&  !this.isMaxActiveCallsReached
          &&  !this.systemDisabledStateStore.isDisabled
      );
    }
  },
  methods: {
    /**
     * @description Handle user clicking on "Continue" button
     *              - will validate the input fields before showing the modal,
     *              - shows the modal if no violations are present,
     */
    handleContinue(): void {
      this.validate();
      if (!this.isVuelidateResultValid || !this.canSearch) {
        return;
      }

      this.isSettingModalVisible = true;
    },
    /**
     * @description returns array of trimmed keywords
     */
    getTrimmedKeywords(): Array<string> {
      return this.jobSearchKeywords.map((keyword: string) => keyword.trim());
    },
    /**
     * @description will validate the form
     */
    validate(): void {
      this.v$.$validate();
      this.violations = this.vuelidateErrorsToArrayOfViolationsForProperties(this.v$.$errors);
    },
    /**
     * @description will handle sending the search request to backend
     */
    handleSearch(submitData: Record<string, number | null>): void {
      this.isSettingModalVisible = false;
      this.validate();
      if (
             !this.canSearch
          || !('offersLimit' in submitData)
      ) {
        return;
      }

      // because backend accepts only the iso code based names (rule of job searcher) yet frontend must show human friendly names
      let backendTargetArea = null as null | string;
      if (!StringTypeProcessor.isEmptyString(this.targetArea)) {

        let areaInformation = this.supportedAreasInformation.find((areaInfo: JobSearchAreaInformation) => {
          return (areaInfo.humanFriendlyName === this.targetArea);
        }) as JobSearchAreaInformation;

        backendTargetArea = areaInformation.areaName;
      }

      let usedDistance = (StringTypeProcessor.isEmptyString(this.maxDistance, false) ? null : Number(this.maxDistance));
      if (this.locationName && !usedDistance) {
        usedDistance = 0;
      }

      let dataBag = {
        targetArea        : StringTypeProcessor.isEmptyString(this.targetArea) ? null : backendTargetArea,
        jobSearchKeywords : this.getTrimmedKeywords(),
        locationName      : this.locationName,
        maxDistance       : usedDistance,
        offersLimit       : submitData.offersLimit,
      }

      let calledUrl = SymfonyRoutes.buildUrl(SymfonyJobOfferRoutes.URL_SEARCH_JOB_OFFERS);
      this.$rootEvent.showFullPageLoader();
      this.$axios.postWithCsrf(calledUrl, dataBag, false).then( async (response) => {

        if(response.hasInvalidFields()){
          this.violations = this.normalizeViolations(response);
          this.$rootEvent.hideFullPageLoader();
          return;
        }

        this.jobSearchKeywords = [];
        this.targetArea        = null;
        this.locationName      = null;
        this.maxDistance       = null;

        if (response.isMessageSet()) {
          this.$rootEvent.showNotification(ToastNotification.getTypeFromCode(response.code), response.message);
          await this.checkMaxActiveCallsReached();
        }

        await JwtTokenHandler.requestJwtTokenAndWaitForIt();
        this.$rootEvent.hideFullPageLoader();
      })
    },
    /**
     * @description will return names of supported countries for which offers can be searched for
     */
    async getSupportedAreas(): Promise<Array<string>> {
      let calledUrl = SymfonyRoutes.buildUrl(SymfonyJobServicesRoutes.URL_GET_SUPPORTED_COUNTRY_NAMES);
      return this.$axios.getWithCsrf(calledUrl, GetSupportedCountries).then( (response: GetSupportedCountries) => {

        let countryNames     = Object.values(response.countryNames);
        let areasInformation = [] as Array<JobSearchAreaInformation>
        for(let countryName of countryNames){
          let mappedHumanName = IsoCountries.getHumanCountryNameForIso31661ThreeDigitCode(countryName);

          if (null === mappedHumanName) {
            areasInformation.push({
              areaName          : countryName,
              humanFriendlyName : StringTypeProcessor.ucFirst(countryName)
            });
            continue;
          }

          areasInformation.push({
            areaName          : countryName,
            humanFriendlyName : mappedHumanName
          });

        }

        areasInformation.sort((first: JobSearchAreaInformation, next: JobSearchAreaInformation) => first.humanFriendlyName.localeCompare(next.humanFriendlyName))

        return areasInformation;
      })
    },
    /**
     * @description will call backend to check if user has reached limit of max active calls
     */
    async checkMaxActiveCallsReached(): Promise<boolean> {

      let calledUrl = SymfonyRoutes.buildUrl(SymfonySystemRoutes.CHECK_MAX_ACTIVE_JOB_SEARCH);
      return this.$axios.getWithCsrf(calledUrl, CheckActiveJobSearchResponse).then( (response: CheckActiveJobSearchResponse) => {
        this.isMaxActiveCallsReached = response.maxReached;
        this.activeCallsCount        = response.countOfActive;
      })
    }
  },
  async created() {
    this.$rootEvent.showFullPageLoader();
    this.supportedAreasInformation = await this.getSupportedAreas();
    this.jobSearchAreaOptions      = this.supportedAreasInformation.map((areaInfo: JobSearchAreaInformation) => areaInfo.humanFriendlyName);

    await this.checkMaxActiveCallsReached();
    this.$rootEvent.hideFullPageLoader();

    let response                     = await this.getOffersHandlerState()
    this.isOffersHandlerAlive        = response.reachable;
    this.isOffersHandlerQuotaReached = response.quotaReached;
  },
  watch: {
    /**
     * @description watch the max distance input,
     *              - autocorrect the float numbers to int
     */
    maxDistance(): void {
      if (NumberTypeProcessor.isFloat(Number(this.maxDistance))) {
        this.maxDistance = parseInt(this.maxDistance);
      }
    }
  }
}
</script>

<style lang="scss">
.barely-visible-non-interactive {
  touch-action: none;
  @apply opacity-40 pointer-events-none select-none
}

.single-select-wrapper {
  @apply ml-2 mr-2 flex justify-around;
}

.single-input-wrapper {
  @apply flex justify-around ml-2 mr-2;
  > div {
    width: 100% !important;
    margin-bottom: 0;
  }

  input {
    min-height: 50px !important;
  }
}

</style>
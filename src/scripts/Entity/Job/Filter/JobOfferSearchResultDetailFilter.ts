import {
    KEYWORD_FILTERING_RULE,
    POSTED_FILTERING_RULE
} from "@/views/JobOffer/SearchResult/Details/Components/FiltersPanel/Enum/FilteringRuleEnum";

type JobOfferSearchResultDetailFilter = {
    mandatoryIncludedKeywordsFilteringRule: KEYWORD_FILTERING_RULE | null,
    mandatoryExcludedKeywordsFilteringRule: KEYWORD_FILTERING_RULE | null,
    whenWasItPosted: POSTED_FILTERING_RULE | null,
    speakLanguageRequired: boolean,
    locationRequired: boolean,
    salaryRequired: boolean,
    emailRequired: boolean,
    phoneRequired: boolean,
    mustBeRemote: boolean,
    includeWithoutPostedDate: boolean,
    areAllVisibleOffersSelected: boolean,
    onlyNewOffers: boolean,
    salaryMin: number | null,
    salaryMax: number | null,
    mandatoryExcludedKeywords: Array<string>,
    mandatoryIncludedKeywords: Array<string>,
    cities: Array<string>,
    countries: Array<string>,
    languages: Array<string>,
    ageOld: number | null,
    employeesMin: number | null,
}

export {JobOfferSearchResultDetailFilter}
enum SEARCH_RESULT_STATUS {
    PENDING,
    DONE,
    ERROR,
    WIP,
}

interface JobSearchResult {
    id                       : number,
    keywords                 : Array<string>,
    targetAreas              : Array<string>,
    created                  : string,
    modified                 : string,
    locationName             : string | null,
    maxDistance              : number | null,
    externalExtractionId     : number | null,
    status                   : string | null,
    validDaysNumber          : number,
    offersFoundCount         : number | null,
}

export {JobSearchResult, SEARCH_RESULT_STATUS};
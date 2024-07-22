/**
 * @description routes related to handling the job offers
 */
export default class SymfonyJobOfferRoutes
{
    /**
     * @description will return job offers on which user can apply to - based on provided filters
     */
    static readonly URL_GET_FILTERED_JOB_OFFERS                 = "/job-offers/filtered/:id";
    static readonly URL_GET_FILTERED_JOB_OFFERS_PARAM_SEARCH_ID = "id";

    /**
     * @description will return the default configuration of the filter
     *              visible on the list of offers for which search was dispatched
     */
    static readonly URL_GET_OFFERS_OVERVIEW_DEFAULT_FILTER                 = "/job-offers/search-result/filter/default/:searchId";
    static readonly URL_GET_OFFERS_OVERVIEW_DEFAULT_FILTER_PARAM_SEARCH_ID = "searchId";

    /**
     * @description will return all the applications for user
     */
    static readonly URL_GET_APPLICATIONS  = "/job-application/find-all";

    /**
     * @description will apply on given offers, build emails for sending etc.
     */
    static readonly URL_APPLY_ON_OFFERS  = "/job-application/apply";

    /**
     * @description handles searching for job offers under given criteria
     */
    static readonly URL_SEARCH_JOB_OFFERS = "/job-offers/search";

    /**
     * @description will return all the job searches made for user
     */
    static readonly URL_GET_DISPATCHED_SEARCH_JOB_OFFERS = "/job-offers/search/dispatched";

    /**
     * @description handles providing the offer full description
     */
    static readonly URL_GET_OFFER_FULL_DESCRIPTION                 = "/job-offer/get-description/:offerId";
    static readonly URL_GET_OFFER_FULL_DESCRIPTION_OPTION_OFFER_ID = "offerId";

}
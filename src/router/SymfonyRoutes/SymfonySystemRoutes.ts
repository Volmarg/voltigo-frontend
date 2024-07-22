/**
 * @description Contains logic related to System routes
 */
export default class SymfonySystemRoutes
{
    /**
     * @description return information if user reached max active job search
     */
    static readonly CHECK_MAX_ACTIVE_JOB_SEARCH = "/system/check-max-active-job-search";

    /**
     * @description check template restrictions for logged-in user
     */
    static readonly URL_CHECK_EMAIL_TEMPLATE_RESTRICTIONS = "/system/check-email-template-restrictions";

    /**
     * @description check the limitation for sending the "E-Mail Template" test E-Mail
     */
    static readonly URL_CHECK_EMAIL_TEMPLATE_TEST_SENDING_RESTRICTION = "/system/restriction/email-template/test-mail-state";

    /**
     * @description check if the offers handler is reachable
     */
    static readonly GET_OFFERS_HANDLER_STATE = "/system/state/get-offers-handler-state";

    /**
     * @description returns the information about countries supported internally (registration etc.)
     */
    static readonly GET_INTERNALLY_SUPPORTED_COUNTRIES_DATA = "/system/geo-data/get-internally-supported-countries";

    /**
     * @description will return special jwt token which can be used explicitly for accessing public folder data, nothing else
     */
    static readonly GET_PUBLIC_FOLDER_ACCESS_TOKEN = "/system/access-token/get-for-public-folder";

    /**
     * @description will return information about max allowed payment (currency / unit etc.)
     */
    static readonly GET_MAX_ALLOWED_PAYMENT_DATA = "/system/get-max-allowed-payment-data";

    /**
     * @description will return response that contains array of current password constraints
     */
    static readonly GET_PASSWORD_CONSTRAINTS = "/system/get-password-constraints";

    /**
     * @description converts the html into pdf and returns base64 of the pdf content,
     *              this solution relies on "wkhtmltopdf",
     */
    static readonly HTML_TO_PDF_PAGES = "/system-file/converter/html-to-pdf-pages";

    /**
     * @description converts the html into pdf and returns base64 of the pdf content,
     *              this solution relies on "html to image" conversion and imagick (image -> pdf),
     */
    static readonly HTML_TO_SINGLE_PDF = "/system-file/converter/html-to-single-pdf";

    /**
     * @description will check if system is disabled
     */
    static readonly GET_SYSTEM_DISABLED_STATE = "/system/state/is-system-disabled";
}
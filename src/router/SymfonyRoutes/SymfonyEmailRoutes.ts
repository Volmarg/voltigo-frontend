/**
 * @description Contains logic related to Emailing routes
 */
export default class SymfonyEmailRoutes
{
    /**
     * @description will return all saved email templates for user
     */
    static readonly URL_GET_ALL_FOR_USER = "/email/templates/get-all-for-user";

    /**
     * @description clones the template and assigns it to currently logged-in user
     */
    static readonly URL_CLONE_TEMPLATE = "/email/templates/clone/:id"
    static readonly URL_CLONE_TEMPLATE_PARAM_ID = "id";

    /**
     * @description will return all saved email templates for user
     */
    static readonly URL_GET_ALL_CLONE_ABLE = "/email/templates/get-all-clone-able";

    /**
     * @description will save template
     */
    static readonly URL_SAVE = "/email/templates/save";

    /**
     * @description will save predefined template
     */
    static readonly URL_SAVE_PREDEFINED = "/email/templates/save/predefined";

    /**
     * @description will remove the email template
     */
    static readonly URL_DELETE              = '/email/templates/delete/:id';
    static readonly URL_DELETE_PARAMETER_ID = "id";

    /**
     * @description will return one email template for the id and md5 or null if the template content has not changed
     *              - md5 is used to determine if the template content has changed or not
     */
    static readonly RE_FETCH_BY_ID                     = "/email/re-fetch/:id/:bodyMd5/:titleMd5";
    static readonly RE_FETCH_BY_ID_PARAMETER_ID        = "id";
    static readonly RE_FETCH_BY_ID_PARAMETER_BODY_MD5  = "bodyMd5";
    static readonly RE_FETCH_BY_ID_PARAMETER_TITLE_MD5 = "titleMd5";

    /**
     * @description returns the template dummy variables
     */
    static readonly URL_GET_TEMPLATE_DUMMY_VARIABLES = "/email/templates/get-dummy-variables";

    /**
     * @description returns the REAL variables that will be set for offer instead of placeholder
     */
    static readonly URL_GET_TEMPLATE_VARIABLES                   = "/email/templates/get-template-variables/:externalOfferId";
    static readonly URL_GET_TEMPLATE_VARIABLES_EXTERNAL_OFFER_ID = "externalOfferId";

    /**
     * @description sends test email based on the email template
     */
    static readonly URL_SEND_TEST_MAIl                       = "/email/templates/send-test/:templateId";
    static readonly URL_SEND_TEST_MAIL_PARAMETER_TEMPLATE_ID = "templateId";
}
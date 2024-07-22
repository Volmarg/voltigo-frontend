enum REGULATION_IDENTIFIER {
    EMAIL_BUILDER_GENERAL_USAGE,
    PLATFORM_TERMS_OF_USAGE,
}

/**
 * @description contains routes related to user regulations
 */
export default class SymfonyUserRegulationsRoutes
{
    /**
     * @description check if user accepted give regulation
     */
    static readonly URL_IS_REGULATION_ACCEPTED = "/user-regulation/check-is-accepted/:regulationIdentifier";

    /**
     * @description accepts given regulation for user
     */
    static readonly URL_ACCEPT_REGULATION = "/user-regulation/accept/:regulationIdentifier/:hash";

    static readonly PARAM_REGULATION_IDENTIFIER = "regulationIdentifier";
    static readonly PARAM_HASH                  = "hash";
}

export {REGULATION_IDENTIFIER};
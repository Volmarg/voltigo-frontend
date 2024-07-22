import EnvReader                  from "@/scripts/Core/System/EnvReader";
import JwtTokenHandler            from "@/scripts/Core/Security/JwtTokenHandler";
import BackendErrorStorageService from "@/scripts/Core/Services/Storage/BackendErrorStorageService";
import Logger                     from "@/scripts/Core/Logger";

/**
 * @description service for checking where the postMessage calls come from
 *              This was added to avoid the postMessage calls being made from some unknown
 *              origins
 */
export default class IframePostMessageControlService {

    static readonly ORIGIN_SANDBOX_PAYPAL   = "https://www.sandbox.paypal.com";
    static readonly ORIGIN_STRIPE_JS        = "https://js.stripe.com"
    static readonly ORIGIN_STRIPE_TEST_MODE = "https://testmode-acs.stripe.com"

    /**
     * @description check the call:
     *              - validate the origin
     *
     *              If something is wrong, report to backend storage + log out user
     */
    public static checkAndHandleMessageCheck(messageContent: MessageEvent): void {

        let whiteListedOrigins = [
            EnvReader.getEmailBuilderOrigin(),
            IframePostMessageControlService.ORIGIN_SANDBOX_PAYPAL,
            IframePostMessageControlService.ORIGIN_STRIPE_JS,
            IframePostMessageControlService.ORIGIN_STRIPE_TEST_MODE,
        ];

        if (!whiteListedOrigins.includes(messageContent.origin)) {
            let msg = "Got message call from unsupported origin";
            Logger.error(msg, {
                gotOrigin: messageContent.origin
            });

            BackendErrorStorageService.storeData({
                info      : msg,
                gotOrigin : messageContent.origin,
            });

            (new JwtTokenHandler()).invalidateTokenAndRedirectUser();
        }
    }
}
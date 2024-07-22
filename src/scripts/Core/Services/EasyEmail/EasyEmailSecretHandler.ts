import Md5Service from "@/scripts/Core/Services/Crypto/Md5Service";

/**
 * @description this service handles building secret for EasyEmail,
 *              this secret allows that project to work at all on production mode,
 *              this is necessary because EasyEmail is embedded in iframe and anyone can copy its url and use it
 *              thanks to logic here that service won't be reachable if secret is not set,
 *
 *              Not that it really matters, not much should happen if users play around with EasyEmail
 *              but better safe than sorry
 *
 *              Keep in mind that the logic in here must be compatible with EasyEmail.Security.isCallerSecretValid
 */
export default class EasyEmailSecretHandler {

    /**
     * @description this logic in here is totally random, just literally some set of rules to generate some value
     *              and then hash it
     */
    public generateKey(): string
    {
        let multiplier        = 10;
        let divider           = 30;
        let addition          = 987;
        let currentDateNumber = (new Date().getUTCFullYear()) + (new Date().getDate());

        let rawNumberSecret = ((currentDateNumber * multiplier) / divider) + addition;
        let md5Secret       = Md5Service.hash(rawNumberSecret.toString());

        return md5Secret;
    }
}

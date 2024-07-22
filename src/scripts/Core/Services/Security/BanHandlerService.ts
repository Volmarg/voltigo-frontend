import {AxiosResponse}        from "axios";
import BanResponse            from "@/scripts/Response/Ban/BanResponse";
import Base64Service          from "@/scripts/Core/Services/Crypto/Base64Service";
import VueRouterAccessControl from "@/router/VueRouterAccessControl";
import JwtTokenHandler        from "@/scripts/Core/Security/JwtTokenHandler";
import TimerService           from "@/scripts/Core/Services/TimerService";

/**
 * @description contains the logic for handling the user ban
 */
export default class BanHandlerService {

    /**
     * @description If the response is indeed a ban type based then user is logged out and redirected to proper
     *              information page,
     */
    public static async handleBanFromResponse(response: AxiosResponse): Promise<void>
    {
        let isBan = BanResponse.isBanResponse(response)
        if (!isBan) {
            return;
        }

        let timeoutTimeMs = 300;

        /** @description the extra sleep time is to return the api response when user is invalidated from frontend */
        let sleepTime     = (timeoutTimeMs / 100 * 30) + timeoutTimeMs;
        let banResponse   = BanResponse.fromJson(JSON.stringify(response.data));
        let hash          = Base64Service.utf8ToBase64(banResponse.toJson());
        let targetUrl     = `/#${VueRouterAccessControl.ROUTE_PATH_BANNED_BASE}/${hash}`;

        location.href = targetUrl;
        location.reload();

        /**
         * @description this is needed because there is also the timer countdown interval running
         *              when user lands on the ban page then for brief moment it still ticks and
         *              checks for token validity as it handles the auto-logout,
         *
         *              so if user will be moved to ban page while timer ticks he might get moved
         *              login page instead, thus moving user first, and then invalidating token,
         */
        setTimeout(() => {
            (new JwtTokenHandler()).invalidateToken();
        }, timeoutTimeMs);

        await TimerService.asyncSleep(sleepTime, true)
    }

}
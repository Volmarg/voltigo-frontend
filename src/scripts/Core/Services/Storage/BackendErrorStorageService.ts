import AppAxios                 from "@/scripts/Core/Services/Request/AppAxios";
import SymfonyRoutes            from "@/router/SymfonyRoutes";
import Logger                   from "@/scripts/Core/Logger";
import LocalStorageService      from "@/scripts/Core/Services/Storage/LocalStorageService";
import NonLoggableBaseError     from "@/scripts/Core/Error/NonLoggableBaseError";
import VueRouterGuards          from "@/router/VueRouterGuards";
import Md5Service               from "@/scripts/Core/Services/Crypto/Md5Service";
import ToastNotification        from "@/scripts/Libs/ToastNotification";
import TranslationsProvider     from "@/scripts/Vue/Provider/TranslationsProvider";
import JwtTokenHandler          from "@/scripts/Core/Security/JwtTokenHandler";
import VueRouter                from "@/router/VueRouter";
import EventDispatcherService   from "@/scripts/Core/Services/Dispatcher/EventDispatcherService";
import TimerService             from "@/scripts/Core/Services/TimerService";

/**
 * @description this class handles sending the data to the backend to store in database for any further analysis
 */
export default class BackendErrorStorageService
{
    /**
     * @description if the max attempts is reached then there is something severely wrong, backend might be totally down
     *              there is nothing than can be done at that point, no more storing retries should be done
     */
    private static STORE_DATA_MAX_ATTEMPTS = 3 as number;
    private static STORE_DATA_ATTEMPTS     = 0 as number;

    private static LAST_STORE_CHECKSUM = null as string | null;
    private static LAST_ERROR_MESSAGE  = null as string | null;

    /**
     * @description will store the provided data on backend database
     */
    public static storeData(data: Record<string, unknown>, doEncryptSavedData: boolean = true): void
    {
        let baseData = {
            jwtToken             : LocalStorageService.get(LocalStorageService.AUTHENTICATION_TOKEN),
            frontendLocationHref : location.href,
            vueRouterToPath      : window[VueRouterGuards.KEY_VUE_ROUTER_TO_PATH],
            vueRouterFromPath    : window[VueRouterGuards.KEY_VUE_ROUTER_FROM_PATH],
        };

        let dataAsString = JSON.stringify(data);

        BackendErrorStorageService.sendToBackend(dataAsString, baseData, doEncryptSavedData);
    }

    /**
     * @description will send the provided data to the backend database
     */
    private static sendToBackend(savedData: string, baseData: Record<string|number, string|number>, doEncryptSavedData: boolean = true): void
    {
        let savedDataChecksum = Md5Service.hash(savedData + JSON.stringify(baseData) + doEncryptSavedData);
        if (BackendErrorStorageService.denyEndlessLoop(savedDataChecksum)) {
            return;
        }
        let dataBag = {
            data: savedData,
        };
        let appAxios = new AppAxios();
        appAxios.postWithCsrf(SymfonyRoutes.buildUrl(SymfonyRoutes.URL_INSERT_FRONTEND_ERROR_STORAGE_DATA), dataBag, doEncryptSavedData, baseData).then( (response) => {
            BackendErrorStorageService.STORE_DATA_ATTEMPTS = 0;
            BackendErrorStorageService.LAST_STORE_CHECKSUM = null;
            if(!response.success){
                Logger.error("Got unsuccessful response from backend - could not store data in error storage in backend", {
                    response: response
                });
                return;
            }

        }).catch( (error) => {
            if (error.toString() === BackendErrorStorageService.LAST_ERROR_MESSAGE) { // deny showing same error multiple times
                return;
            }
            ToastNotification.showErrorAlert(TranslationsProvider.FALLBACK_SAFETY_MESSAGE);
            BackendErrorStorageService.LAST_ERROR_MESSAGE = error.toString()

            let message = "Error happened while trying to save frontend error in backend";
            Logger.error(message, error);
            throw new NonLoggableBaseError(message, {});
        })
    }

    /**
     * @description this was added to deny cases where something keeps calling {@see BackendErrorStorageService.storeData}
     *              this can happen for example when:
     *              - websocket server is down,
     *              - backend server is down,
     *
     * @returns boolean
     *          - true if call should be denied (loop detected),
     *          - false, if can continue after this call,
     */
    private static denyEndlessLoop(savedDataChecksum: string): boolean {
        if (BackendErrorStorageService.LAST_STORE_CHECKSUM === savedDataChecksum) {
            BackendErrorStorageService.STORE_DATA_ATTEMPTS++;
        }

        BackendErrorStorageService.LAST_STORE_CHECKSUM = savedDataChecksum;
        if (BackendErrorStorageService.STORE_DATA_ATTEMPTS >= BackendErrorStorageService.STORE_DATA_MAX_ATTEMPTS) {
            if (window[VueRouterGuards.KEY_VUE_ROUTER_TO_PATH] === VueRouter.ROUTE_PATH_LOGIN) {
                return true;
            }

            ToastNotification.showErrorAlert(TranslationsProvider.FALLBACK_SAFETY_MESSAGE);
            EventDispatcherService.emitShowFullPageLoader();

            TimerService.sleep(1500); // let the notification stay on top a bit before reloading,

            BackendErrorStorageService.LAST_STORE_CHECKSUM = null;
            BackendErrorStorageService.LAST_ERROR_MESSAGE = null;
            (new JwtTokenHandler).invalidateTokenAndRedirectUser();
            return true;
        }

        return false;
    }
}
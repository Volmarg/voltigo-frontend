import BackendErrorStorageService from "@/scripts/Core/Services/Storage/BackendErrorStorageService";
import ListenerInterface          from "@/scripts/Core/Listeners/Interfaces/ListenerInterface";
import EventDispatcherService     from "@/scripts/Core/Services/Dispatcher/EventDispatcherService";
import {ToastTypeEnum}            from "@/scripts/Libs/ToastNotification";

/**
 * @description global unhandled promise rejection listener
 */
export default class RejectedPromiseErrorListener implements ListenerInterface
{
    /**
     * @description start listening for the event
     */
    public startListening(): void
    {
        this.bindListener();
    }

    /**
     * @description bind the listener to the page / window etc.
     */
    private bindListener(): void
    {
        window.onunhandledrejection = (event: PromiseRejectionEvent) => {
            EventDispatcherService.emitShowNotification(ToastTypeEnum.error, null, 'messages.internalServerError');
            EventDispatcherService.emitHideFullPageLoader()

            BackendErrorStorageService.storeData({
                "errorSource"     : event.type,
                "rejectionReason" : event.reason,
            })

        }
    }
}
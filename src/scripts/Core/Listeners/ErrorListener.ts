import BackendErrorStorageService from "@/scripts/Core/Services/Storage/BackendErrorStorageService";
import ListenerInterface          from "@/scripts/Core/Listeners/Interfaces/ListenerInterface";
import NonLoggableBaseError       from "@/scripts/Core/Error/NonLoggableBaseError";
import EventDispatcherService     from "@/scripts/Core/Services/Dispatcher/EventDispatcherService";
import {ToastTypeEnum}            from "@/scripts/Libs/ToastNotification";

/**
 * @description global error listener
 */
export default class ErrorListener implements ListenerInterface
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
        window.onerror = (message, source, lineno, colno, error) => {
            EventDispatcherService.emitShowNotification(ToastTypeEnum.error, null, 'messages.internalServerError');

            if( !(error instanceof NonLoggableBaseError) ){
                BackendErrorStorageService.storeData({
                    "errorSource" : "'onerror' listener",
                    "message"     : message,
                })
            }

        }
    }
}
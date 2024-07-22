import WebsocketHandlerInterface          from "@/scripts/Core/Services/Websocket/Handler/WebsocketHandlerInterface";
import BaseError                          from "@/scripts/Core/Error/BaseError";
import IncomingWebsocketMessageDTO        from "@/scripts/Dto/Websocket/IncomingWebsocketMessageDTO";
import ToastNotification, {ToastTypeEnum} from "@/scripts/Libs/ToastNotification";
import AbstractWebsocketActionExecutor    from "@/scripts/Core/Services/Websocket/ActionExecutor/AbstractWebsocketActionExecutor";

/**
 * @description handles the unauthorized socket calls
 */
export default class NotificationWebsocketHandler implements WebsocketHandlerInterface
{
    static readonly HANDLER_NAME = "notification";

    /**
     * @inheritDoc
     */
    getBackendEndpointName(): string
    {
        throw new BaseError("Not allowed to directly send message to the 'Notification' endpoint");
    }

    /**
     * @inheritDoc
     */
    getHandlerName(): string
    {
        return NotificationWebsocketHandler.HANDLER_NAME;
    }

    /**
     * @inheritDoc
     */
    onMessage(incomingMessage: IncomingWebsocketMessageDTO): void
    {
        ToastNotification.showAlert(ToastTypeEnum.info, incomingMessage.message);
    }

    /**
     * @inheritDoc
     */
    getActionExecutor(): null | AbstractWebsocketActionExecutor
    {
        return null;
    }

}
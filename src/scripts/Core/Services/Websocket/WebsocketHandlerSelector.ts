import WebsocketHandlerInterface         from "@/scripts/Core/Services/Websocket/Handler/WebsocketHandlerInterface";
import GlobalWebsocketHandler            from "@/scripts/Core/Services/Websocket/Handler/GlobalWebsocketHandler";
import AuthenticatedUserWebsocketHandler from "@/scripts/Core/Services/Websocket/Handler/AuthenticatedUserWebsocketHandler";
import NotFoundWebsocketHandler          from "@/scripts/Core/Services/Websocket/Handler/NotFoundWebsocketHandler";
import NotificationWebsocketHandler      from "@/scripts/Core/Services/Websocket/Handler/NotificationWebsocketHandler";
import UnauthorizedWebsocketHandler      from "@/scripts/Core/Services/Websocket/Handler/UnauthorizedWebsocketHandler";

/**
 * @description selects the handler for provided "handler name",
 *              The "handler name" is being delivered from backend and based on this the frontend
 *              equivalent of "endpoint" (for websocket) will be selected for incoming call
 */
export default class WebsocketHandlerSelector
{

    /**
     * @description will return the websocket handler for it's name
     *              there is no need to add the unauthorized calls (should not happen) but in case there is
     *              just add this as some special case:
     *              - {@see UnauthorizedWebsocketHandler}
     */
    public getHandlerForName(handlerName: string): WebsocketHandlerInterface
    {
        let usedHandler = this.getAllSupportedHandlers().find(
            (handler) => (handler.getHandlerName() === handlerName)
        );

        return usedHandler ?? new NotFoundWebsocketHandler();
    }

    /**
     * @description will return all supported handlers that can be called
     * @keepInMind that {@see UnauthorizedWebsocketHandler} is special handler
     *             that can be used to some rare cases when it's needed to
     *             handle communication with unauthorized user/logic
     */
    private getAllSupportedHandlers(): Array<WebsocketHandlerInterface> {
        return [
            new AuthenticatedUserWebsocketHandler(),
            new GlobalWebsocketHandler(),
            new NotificationWebsocketHandler(),
            new UnauthorizedWebsocketHandler(),
        ];
    }
}
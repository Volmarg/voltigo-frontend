import AbstractWebsocketActionExecutor from "@/scripts/Core/Services/Websocket/ActionExecutor/AbstractWebsocketActionExecutor";
import OutgoingWebsocketMessageDTO     from "@/scripts/Dto/Websocket/OutgoingWebsocketMessageDTO";
import WebsocketConnectionHandler      from "@/scripts/Core/Services/Websocket/WebsocketConnectionHandler";
import IncomingWebsocketMessageDTO     from "@/scripts/Dto/Websocket/IncomingWebsocketMessageDTO";
import JwtTokenHandler                 from "@/scripts/Core/Security/JwtTokenHandler";
import UserController                  from "@/scripts/Core/Controller/UserController";
import GlobalWebsocketHandler          from "@/scripts/Core/Services/Websocket/Handler/GlobalWebsocketHandler";
import EventDispatcherService          from "@/scripts/Core/Services/Dispatcher/EventDispatcherService";

/**
 * @description contains functions that are being called/executed via {@see WebSocket} (for example with backend call)
 *              Logic in here is strictly related to the {@see GlobalWebsocketHandler}
 */
export default class GlobalWebsocketActionExecutor extends AbstractWebsocketActionExecutor
{
    public static readonly ACTION_HANDSHAKE = "handshake";

    /**
     * @description will send simple "handshake" message indicating that connection through socket has been established
     *              this data is later used to identify client and provides some important
     *              information used later for data exchange
     */
    public static sendHandshakeData(): void
    {
        let outgoingWebsocketMessageDto        = new OutgoingWebsocketMessageDTO();
        outgoingWebsocketMessageDto.actionName = GlobalWebsocketActionExecutor.ACTION_HANDSHAKE;

        WebsocketConnectionHandler.sendMessage(outgoingWebsocketMessageDto.toJson(), GlobalWebsocketActionExecutor.ACTION_HANDSHAKE);
    }

    /**
     * @description Handles disabled system:
     *              - logs user out,
     *              - stores the disabled state data inside the pinia store,
     */
    public handleSystemDisabled(incomingMessage: IncomingWebsocketMessageDTO): void {
        if (incomingMessage.getDataForKey(IncomingWebsocketMessageDTO.KEY_IS_SYSTEM_DISABLED)) {
            EventDispatcherService.emitSystemDisabled(incomingMessage.message)
            if ((new UserController()).isUserLoggedIn()) {
                (new JwtTokenHandler()).invalidateTokenAndRedirectUser()
            }
            return;
        }
    }

    /**
     * @description will show bar with information that system will be disabled soon
     *              - this happens via vue reading pinia state in some components.
     */
    public handleSystemSoonDisabled(incomingMessage: IncomingWebsocketMessageDTO): void {
        if (incomingMessage.getDataForKey(IncomingWebsocketMessageDTO.KEY_IS_SYSTEM_SOON_DISABLED)) {
            EventDispatcherService.emitSystemSoonDisabled(incomingMessage.message)
            return;
        }
    }

    /**
     * @description ping websocket on global channel,
     */
    public static ping(): void {
        let messageDto                = new OutgoingWebsocketMessageDTO();
        messageDto.socketEndpointName = GlobalWebsocketHandler.ENDPOINT_NAME;
        messageDto.message            = "Ping";
        WebsocketConnectionHandler.sendMessage(messageDto.toJson());
    }


}
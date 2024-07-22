import WebsocketHandlerInterface       from "@/scripts/Core/Services/Websocket/Handler/WebsocketHandlerInterface";
import WebsocketConnectionHandler      from "@/scripts/Core/Services/Websocket/WebsocketConnectionHandler";
import OutgoingWebsocketMessageDTO     from "@/scripts/Dto/Websocket/OutgoingWebsocketMessageDTO";
import IncomingWebsocketMessageDTO     from "@/scripts/Dto/Websocket/IncomingWebsocketMessageDTO";
import AbstractWebsocketActionExecutor from "@/scripts/Core/Services/Websocket/ActionExecutor/AbstractWebsocketActionExecutor";
import GlobalWebsocketActionExecutor   from "@/scripts/Core/Services/Websocket/ActionExecutor/GlobalWebsocketActionExecutor";

/**
 * @description handler for authenticated user websocket calls
 */
export default class GlobalWebsocketHandler implements WebsocketHandlerInterface
{

    static readonly HANDLER_NAME  = "global";
    static readonly ENDPOINT_NAME = "global";

    /**
     * @inheritDoc
     */
    getBackendEndpointName(): string
    {
        return GlobalWebsocketHandler.ENDPOINT_NAME;
    }

    /**
     * @inheritDoc
     */
    getHandlerName(): string
    {
        return GlobalWebsocketHandler.HANDLER_NAME;
    }

    /**
     * @inheritDoc
     *
     */
    onMessage(incomingMessage: IncomingWebsocketMessageDTO): void  // eslint-disable-line @typescript-eslint/no-unused-vars
    {
        if (!incomingMessage.getDataForKey(IncomingWebsocketMessageDTO.KEY_CAN_RESPOND)) {
            return;
        }

        let messageDto                = new OutgoingWebsocketMessageDTO();
        messageDto.socketEndpointName = GlobalWebsocketHandler.ENDPOINT_NAME;
        messageDto.message            = "Got the message! Processing.";

        WebsocketConnectionHandler.sendMessage(messageDto.toJson());
    }

    /**
     * @inheritDoc
     */
    getActionExecutor(): null | AbstractWebsocketActionExecutor
    {
        return new GlobalWebsocketActionExecutor();
    }

}
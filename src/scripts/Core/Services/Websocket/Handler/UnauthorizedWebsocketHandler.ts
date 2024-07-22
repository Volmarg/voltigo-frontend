import BaseError                       from "@/scripts/Core/Error/BaseError";
import WebsocketConnectionHandler      from "@/scripts/Core/Services/Websocket/WebsocketConnectionHandler";
import OutgoingWebsocketMessageDTO     from "@/scripts/Dto/Websocket/OutgoingWebsocketMessageDTO";
import GlobalWebsocketHandler          from "@/scripts/Core/Services/Websocket/Handler/GlobalWebsocketHandler";
import WebsocketHandlerInterface       from "@/scripts/Core/Services/Websocket/Handler/WebsocketHandlerInterface";
import IncomingWebsocketMessageDTO     from "@/scripts/Dto/Websocket/IncomingWebsocketMessageDTO";
import AbstractWebsocketActionExecutor from "@/scripts/Core/Services/Websocket/ActionExecutor/AbstractWebsocketActionExecutor";

/**
 * @description handles the unauthorized socket calls
 */
export default class UnauthorizedWebsocketHandler implements WebsocketHandlerInterface
{
    static readonly HANDLER_NAME = "unauthorized";

    /**
     * @inheritDoc
     */
    getBackendEndpointName(): string
    {
        throw new BaseError("Not allowed to directly send message to the unauthorized endpoint");
    }

    /**
     * @inheritDoc
     */
    getHandlerName(): string
    {
        return UnauthorizedWebsocketHandler.HANDLER_NAME;
    }

    /**
     * @inheritDoc
     */
    onMessage(incomingMessage: IncomingWebsocketMessageDTO): void
    {
        let messageDto                = new OutgoingWebsocketMessageDTO();
        messageDto.socketEndpointName = GlobalWebsocketHandler.ENDPOINT_NAME;
        messageDto.message            = "Unauthorized to call the handler!";
        messageDto.status             = OutgoingWebsocketMessageDTO.OUTGOING_WEBSOCKET_MESSAGE_TYPE_FAILURE
        messageDto.addOriginalMessageToData(incomingMessage.toJson());

        WebsocketConnectionHandler.sendMessage(messageDto.toJson());
    }

    /**
     * @inheritDoc
     */
    getActionExecutor(): null | AbstractWebsocketActionExecutor
    {
        return null;
    }
}
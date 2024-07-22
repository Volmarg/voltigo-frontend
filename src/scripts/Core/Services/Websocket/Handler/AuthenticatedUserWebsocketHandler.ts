import WebsocketHandlerInterface                from "@/scripts/Core/Services/Websocket/Handler/WebsocketHandlerInterface";
import WebsocketConnectionHandler               from "@/scripts/Core/Services/Websocket/WebsocketConnectionHandler";
import OutgoingWebsocketMessageDTO              from "@/scripts/Dto/Websocket/OutgoingWebsocketMessageDTO";
import GlobalWebsocketHandler                   from "@/scripts/Core/Services/Websocket/Handler/GlobalWebsocketHandler";
import IncomingWebsocketMessageDTO              from "@/scripts/Dto/Websocket/IncomingWebsocketMessageDTO";
import AbstractWebsocketActionExecutor          from "@/scripts/Core/Services/Websocket/ActionExecutor/AbstractWebsocketActionExecutor";
import AuthenticatedUserWebsocketActionExecutor from "@/scripts/Core/Services/Websocket/ActionExecutor/AuthenticatedUserWebsocketActionExecutor";

/**
 * @description handler for authenticated user websocket calls
 */
export default class AuthenticatedUserWebsocketHandler implements WebsocketHandlerInterface
{

    static readonly HANDLER_NAME  = "AuthenticatedUser";
    static readonly ENDPOINT_NAME = "AuthenticatedUser";

    /**
     * @inheritDoc
     */
    getBackendEndpointName(): string {
        return AuthenticatedUserWebsocketHandler.ENDPOINT_NAME;
    }

    /**
     * @inheritDocW
     */
    getHandlerName(): string {
        return AuthenticatedUserWebsocketHandler.HANDLER_NAME;
    }

    /**
     * @inheritDoc
     */
    onMessage(incomingMessage: IncomingWebsocketMessageDTO): void
    {
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
        return new AuthenticatedUserWebsocketActionExecutor();
    }

}
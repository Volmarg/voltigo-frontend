import IncomingWebsocketMessageDTO     from "@/scripts/Dto/Websocket/IncomingWebsocketMessageDTO";
import AbstractWebsocketActionExecutor from "@/scripts/Core/Services/Websocket/ActionExecutor/AbstractWebsocketActionExecutor";

/**
 * @description defines common logic for the websocket handlers
 */
export default interface WebsocketHandlerInterface
{
    /**
     * @description return the handler name for backend endpoint
     */
    getHandlerName(): string;

    /**
     * @description will return action executor for given handler
     */
    getActionExecutor(): null | AbstractWebsocketActionExecutor;

    /**
     * @description return backend endpoint corresponding to handler
     */
    getBackendEndpointName(): string;

    /**
     * @description handles the logic for message received event
     */
    onMessage(incomingMessage: IncomingWebsocketMessageDTO): void;
}
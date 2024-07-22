import LocalStorageService               from "@/scripts/Core/Services/Storage/LocalStorageService";
import OutgoingWebsocketMessageDTO       from "@/scripts/Dto/Websocket/OutgoingWebsocketMessageDTO";
import WebsocketConnectionHandler        from "@/scripts/Core/Services/Websocket/WebsocketConnectionHandler";
import AuthenticatedUserWebsocketHandler from "@/scripts/Core/Services/Websocket/Handler/AuthenticatedUserWebsocketHandler";
import WebsocketMessageBaseDTO           from "@/scripts/Dto/Websocket/WebsocketMessageBaseDTO";

/**
 * @description contains functions related directly to {@see AuthenticatedUserWebsocketHandler}
 *              These functions can be called in any place on front and will "call" the backend via {@see WebSocket}
 */
export default class AuthenticatedUserWebsocketCallable
{
    /**
     * @description will ask backend for refreshed jwt token
     * @warning     this name must be kept in sync with backend
     */
    private static readonly ACTION_REFRESH_JWT_TOKEN = "refreshJwtToken";

    /**
     * @description will ask backend for refreshed jwt token
     */
    static requestJwtToken(): void
    {
        let data = {
            [WebsocketMessageBaseDTO.KEY_JWT]: LocalStorageService.get(LocalStorageService.AUTHENTICATION_TOKEN),
        };

        let messageDto                = new OutgoingWebsocketMessageDTO();
        messageDto.socketEndpointName = AuthenticatedUserWebsocketHandler.ENDPOINT_NAME;
        messageDto.data               = data;
        messageDto.actionName         = AuthenticatedUserWebsocketCallable.ACTION_REFRESH_JWT_TOKEN;

        WebsocketConnectionHandler.sendMessage(messageDto.toJson());
    }

}
import AbstractWebsocketActionExecutor    from "@/scripts/Core/Services/Websocket/ActionExecutor/AbstractWebsocketActionExecutor";
import IncomingWebsocketMessageDTO        from "@/scripts/Dto/Websocket/IncomingWebsocketMessageDTO";
import StringTypeProcessor                from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";
import TypeChecker                        from "@/scripts/Core/Services/Types/TypeChecker";
import BaseError                          from "@/scripts/Core/Error/BaseError";
import LocalStorageService                from "@/scripts/Core/Services/Storage/LocalStorageService";
import WebsocketMessageBaseDTO            from "@/scripts/Dto/Websocket/WebsocketMessageBaseDTO";
import AuthenticatedUserWebsocketCallable from "@/scripts/Core/Services/Websocket/Callable/AuthenticatedUserWebsocketCallable";
import EventDispatcherService             from "@/scripts/Core/Services/Dispatcher/EventDispatcherService";
import VueRouter                          from "@/router/VueRouter";
import {ToastTypeEnum}                    from "@/scripts/Libs/ToastNotification";

/**
 * @description contains functions that are being called/executed via {@see WebSocket} (for example with backend call)
 *              These function should NEVER be called directly, as their only purpose is to handle certain front based logic
 *              based on the call/request coming from socket (via for example backend)
 *
 *              Logic in here is strictly related to the {@see AuthenticatedUserWebsocketHandler}
 */
export default class AuthenticatedUserWebsocketActionExecutor extends AbstractWebsocketActionExecutor
{

    /**
     * @description will set the jwt token sent from backend into the user local storage (replacing the old jwt token)
     *              thus extending the "being-logged-in" lifespan
     */
    public setFreshJwtToken(incomingMessageDto: IncomingWebsocketMessageDTO): void
    {
        let refreshedJwt = incomingMessageDto.getDataForKey(WebsocketMessageBaseDTO.KEY_JWT);
        if (!TypeChecker.isString(refreshedJwt)) {
            throw new BaseError("Expected refreshed jwt token (from backend - sent via socket) to be string, instead got: " + (typeof refreshedJwt), {
                "stringifiedTokenValue": JSON.stringify(refreshedJwt),
            })
        }

        if (StringTypeProcessor.isEmptyString(refreshedJwt as string)) {
            throw new BaseError("The refreshed jwt token (from backend - sent via socket) is empty!");
        }

        EventDispatcherService.emitRefreshUserStore();
        LocalStorageService.removeEmailTemplateDummyVars();
        LocalStorageService.set(LocalStorageService.AUTHENTICATION_TOKEN, refreshedJwt as string);
    }

    /**
     * @description handles the situation when backend updates the user points state (for example transaction have been approved)
     *              - updates the user state (his points),
     */
    public handlePointsUpdate(incomingMessageDto: IncomingWebsocketMessageDTO): void
    {
        EventDispatcherService.emitShowNotification(ToastTypeEnum.info, null, 'paymentProcess.message.foundsUpdated');

        /**
         * @description this will trigger
         * - {@see AuthenticatedUserWebsocketActionExecutor.setFreshJwtToken}, which then calls the
         *   - {@see EventDispatcherService.emitRefreshUserStore} under the hood, so it will refresh user data globally from jwt token
         */
        AuthenticatedUserWebsocketCallable.requestJwtToken();
    }

}
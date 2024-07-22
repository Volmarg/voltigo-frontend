import StringTypeProcessor         from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";
import IncomingWebsocketMessageDTO from "@/scripts/Dto/Websocket/IncomingWebsocketMessageDTO";

/**
 * @description Base / common logic for all the action executors,
 *              Provides logic for executing the `action` (method/function) in context of child class
 */
export default abstract class AbstractWebsocketActionExecutor {

    /**
     * @description will execute given action (method) in context of child class
     *              Don't forget about using the "see" tag to indicate that given executor method is being used
     *              - this is necessary because otherwise IDE won't know that certain method is being magically called
     *                which can lead to removal of such methods (since these seem not to be used at all)
     *
     * @see AuthenticatedUserWebsocketActionExecutor.setFreshJwtToken
     * @see AuthenticatedUserWebsocketActionExecutor.handlePointsUpdate
     * @see GlobalWebsocketActionExecutor.handleSystemDisabled
     * @see GlobalWebsocketActionExecutor.handleSystemSoonDisabled
     */
    public executeAction(incomingMessageDto: IncomingWebsocketMessageDTO): void
    {
        if (
                !StringTypeProcessor.isEmptyString(incomingMessageDto.actionName)
            &&  "function" === typeof this[incomingMessageDto.actionName]
        ) {
            this[incomingMessageDto.actionName](incomingMessageDto);
        }
    }
}
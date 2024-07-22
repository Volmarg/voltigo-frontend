/**
 * @description consist of common logic shared between:
 *              - {@see IncomingWebsocketMessageDTO}
 *              - {@see OutgoingWebsocketMessageDTO}
 */
export default class WebsocketMessageBaseDTO
{
    public static readonly KEY_JWT = "jwt";
    public static readonly KEY_CAN_RESPOND = "canRespond";
    public static readonly KEY_IS_SYSTEM_DISABLED = "isSystemDisabled";
    public static readonly KEY_IS_SYSTEM_SOON_DISABLED = "isSystemSoonDisabled";

    protected _message    : string;
    protected _actionName : string;

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        this._message = value;
    }

    get actionName(): string {
        return this._actionName;
    }

    set actionName(value: string) {
        this._actionName = value;
    }

}
/**
 * @description represents message incoming from websocket
 */
import WebsocketMessageBaseDTO from "@/scripts/Dto/Websocket/WebsocketMessageBaseDTO";

export default class IncomingWebsocketMessageDTO extends WebsocketMessageBaseDTO
{
    private _frontendHandlerName : string;
    private _data                : string;

    get data(): string {
        return this._data;
    }

    set data(value: string) {
        this._data = value;
    }

    get frontendHandlerName(): string {
        return this._frontendHandlerName;
    }

    set frontendHandlerName(value: string) {
        this._frontendHandlerName = value;
    }

    /**
     * @description will return value under given key in the data array, or null if no such key exists
     */
    public getDataForKey(keyName: string): unknown | null
    {
        return this?.data[keyName] ?? null;
    }

    /**
     * @description Build dto from json string
     */
    public static fromJson(json: string): IncomingWebsocketMessageDTO
    {
        let object = JSON.parse(json);
        let dto    = new IncomingWebsocketMessageDTO();

        dto.frontendHandlerName = object?.frontendHandlerName ?? "";
        dto.message             = object?.message             ?? "";
        dto.data                = object?.data                ?? [];
        dto.actionName          = object?.actionName          ?? "";

        return dto;
    }

    /**
     * @description will return string representation of current object
     */
    public toJson(): string
    {
        let object = {
            message             : this._message,
            data                : this._data,
            actionName          : this._actionName,
            frontendHandlerName : this._frontendHandlerName,
        }

        return JSON.stringify(object);
    }
}
import WebsocketConnectionHandler     from "@/scripts/Core/Services/Websocket/WebsocketConnectionHandler";
import LocalStorageService            from "@/scripts/Core/Services/Storage/LocalStorageService";
import UserController                 from "@/scripts/Core/Controller/UserController";
import GlobalWebsocketHandler         from "@/scripts/Core/Services/Websocket/Handler/GlobalWebsocketHandler";
import {
    OUTGOING_WEBSOCKET_MESSAGE_TYPE_FAILURE,
    OUTGOING_WEBSOCKET_MESSAGE_TYPE_SUCCESS
} from "@/scripts/Core/Services/Websocket/websocket";
import WebsocketMessageBaseDTO from "@/scripts/Dto/Websocket/WebsocketMessageBaseDTO";
import SessionStorageService   from "@/scripts/Core/Services/Storage/SessionStorageService";

/**
 * @description Dto representing the outgoing websocket message
 */
export default class OutgoingWebsocketMessageDTO extends WebsocketMessageBaseDTO
{
    static readonly OUTGOING_WEBSOCKET_MESSAGE_TYPE_SUCCESS = "success";
    static readonly OUTGOING_WEBSOCKET_MESSAGE_TYPE_FAILURE = "failure";

    private _source             : string = WebsocketConnectionHandler.SOURCE_FRONTEND;
    private _socketEndpointName : string = GlobalWebsocketHandler.ENDPOINT_NAME;
    private _connectionId       : string;
    private _userId             : string|number|null = null;
    private _data               : Record<string|number, string|number|Array<string|number|null>> = {};
    private _status             : OUTGOING_WEBSOCKET_MESSAGE_TYPE_FAILURE | OUTGOING_WEBSOCKET_MESSAGE_TYPE_SUCCESS;

    get source(): string {
        return this._source;
    }

    set source(value: string) {
        this._source = value;
    }

    get socketEndpointName(): string {
        return this._socketEndpointName;
    }

    set socketEndpointName(value: string) {
        this._socketEndpointName = value;
    }

    get connectionId(): string {
        return this._connectionId;
    }

    set connectionId(value: string) {
        this._connectionId = value;
    }

    get userId(): string | number | null {
        return this._userId;
    }

    set userId(value: string | number | null) {
        this._userId = value;
    }

    get data(): Record<string | number, string | number | Array<string | number | null>> {
        return this._data;
    }

    set data(value: Record<string | number, string | number | Array<string | number | null>>) {
        this._data = value;
    }

    get status(): OUTGOING_WEBSOCKET_MESSAGE_TYPE_FAILURE | OUTGOING_WEBSOCKET_MESSAGE_TYPE_SUCCESS {
        return this._status;
    }

    set status(value: OUTGOING_WEBSOCKET_MESSAGE_TYPE_FAILURE | OUTGOING_WEBSOCKET_MESSAGE_TYPE_SUCCESS) {
        this._status = value;
    }

    /**
     * @description Will add original message to the data bag
     */
    public addOriginalMessageToData(message: string): void
    {
        this._data.originalMessage = message;
    }

    public constructor() {
        super();
        this._connectionId = SessionStorageService.getActiveTabId();

        if( LocalStorageService.isSet(LocalStorageService.AUTHENTICATION_TOKEN) ){
            try{
                let userController = new UserController();
                let userData       = userController.getLoggedInUserData();
                this._userId       = userData.userId;
            }catch(Error){
                // nothing - not logged in while being on login page etc
            }
        }
    }

    /**
     * @description return string representation of object
     */
    public toJson(): string
    {
        let object = {
            source             : this._source,
            actionName         : this._actionName,
            socketEndpointName : this._socketEndpointName,
            connectionId       : this._connectionId,
            userId             : this._userId,
            message            : this._message,
            data               : this._data,
            status             : this._status
        }
        return JSON.stringify(object);
    }
}
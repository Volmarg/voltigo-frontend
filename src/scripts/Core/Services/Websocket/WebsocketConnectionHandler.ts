import BackendErrorStorageService    from "@/scripts/Core/Services/Storage/BackendErrorStorageService";
import EnvReader                     from "@/scripts/Core/System/EnvReader";
import Logger                        from "@/scripts/Core/Logger";
import WebsocketHandlerSelector      from "@/scripts/Core/Services/Websocket/WebsocketHandlerSelector";
import IncomingWebsocketMessageDTO   from "@/scripts/Dto/Websocket/IncomingWebsocketMessageDTO";
import TimerService                  from "@/scripts/Core/Services/TimerService";
import GlobalWebsocketActionExecutor from "@/scripts/Core/Services/Websocket/ActionExecutor/GlobalWebsocketActionExecutor";

import AppAxios                    from "@/scripts/Core/Services/Request/AppAxios";
import SymfonyRoutes               from "@/router/SymfonyRoutes";
import SymfonySystemRoutes         from "@/router/SymfonyRoutes/SymfonySystemRoutes";
import EventDispatcherService      from "@/scripts/Core/Services/Dispatcher/EventDispatcherService";
import SystemDisabledStateResponse from "@/scripts/Response/System/State/SystemDisabledStateResponse";

/**
 * @description Configures the entire base logic of the websocket
 *              - events depending on call state (success / fail / error),
 *              - re-connecting the socket after losing the connection
 *
 * @link https://tutorialedge.net/javascript/vuejs/vuejs-websocket-tutorial/
 */
export default class WebsocketConnectionHandler
{
    static readonly SOURCE_FRONTEND = "frontend";
    private static readonly DEFAULT_RECONNECT_DELAY = 10000; // milliseconds = 10s

    private static connection                               = EnvReader.isWebsocketDisabled() ? null : new WebSocket(EnvReader.getWebsocketUrl());
    private static reconnectInterval: NodeJS.Timeout | null = null;
    private static isReconnectHandshakeQueued               = false;

    /**
     * @description Will register the websocket logic handlers (error / success etc.)
     */
    public static register(): void
    {
        if (EnvReader.isWebsocketDisabled() || !WebsocketConnectionHandler.connection) {
            return;
        }

        /**
         * @description error handler
         */
        WebsocketConnectionHandler.connection.onerror = (event) => {
            Logger.error("Websocket connection error", {
                event: event,
            })

            BackendErrorStorageService.storeData({
                info : "Websocket error",
                type : event.type,
            })
        }

        /**
         * @description handles logic upon receiving message
         * @note this might lead to endless loop if backend will auto respond on front message
         */
        WebsocketConnectionHandler.connection.onmessage = (event) => {
            Logger.info("Websocket message received: " + event.data);

            let incomingMessageDto = IncomingWebsocketMessageDTO.fromJson(event.data);
            let endpointHandler    = new WebsocketHandlerSelector();
            let endpoint           = endpointHandler.getHandlerForName(incomingMessageDto.frontendHandlerName);
            let actionExecutor     = endpoint.getActionExecutor();

            endpoint.onMessage(incomingMessageDto);

            if (null !== actionExecutor) {
                actionExecutor.executeAction(incomingMessageDto)
            }
        }

        /**
         * @description connection open handler
         */
        WebsocketConnectionHandler.connection.onopen = (event) => {
            Logger.info("Websocket connection has been opened", {
                event: event,
            })

            /**
             * @description pinging was added due to using websocket to transfer information if the
             *              system has been disabled. This worked only on first handshake.
             *              And that's because the only place where the code could be implemented on
             *              backend is "onMessage" and so the "opOpen" won't trigger it.
             *              This ping is a message so websocket WILL react on it and will re-check disabled state
             */
            GlobalWebsocketActionExecutor.ping()

            if (null !== WebsocketConnectionHandler.reconnectInterval) {
                clearInterval(WebsocketConnectionHandler.reconnectInterval);
            }
        }

        /**
         * @description connection close handler
         */
        WebsocketConnectionHandler.connection.onclose = (event) => {
            Logger.error("Websocket connection has been closed", {
                event: event,
            });

            WebsocketConnectionHandler.handleDisabledState();
            WebsocketConnectionHandler.connection?.close();
            WebsocketConnectionHandler.reconnect();
        }
    }

    /**
     * @description will send message over socket
     *
     * @param internalIdentifier - this is never sent outside & is only used internally to apply some special logic
     *                             for certain identifiers
     * @param message
     */
    public static sendMessage(message: string, internalIdentifier: string|null = null): void
    {
        let promise = new Promise(async (resolve, reject) => {
            let attemptsLimit  = 20;
            let currentAttempt = 1;

            if( !WebsocketConnectionHandler.isConnectionOpen() ){

                if(
                        GlobalWebsocketActionExecutor.ACTION_HANDSHAKE === internalIdentifier
                    &&  this.isReconnectHandshakeQueued
                ){
                    resolve(true);
                }else if(GlobalWebsocketActionExecutor.ACTION_HANDSHAKE === internalIdentifier){
                    WebsocketConnectionHandler.isReconnectHandshakeQueued = true;
                }

                while( !WebsocketConnectionHandler.isConnectionOpen() ){

                    if(WebsocketConnectionHandler.isConnectionOpen()){
                        resolve(true);
                        break;
                    }

                    if(currentAttempt >= attemptsLimit){
                        BackendErrorStorageService.storeData({
                            "message"     : "Tried to send message over socket but socked connection remains closed",
                            "sentMessage" : message
                        }, false);
                        reject(false);
                        break;
                    }

                    currentAttempt++
                    await TimerService.asyncSleep(1000);
                }

                resolve(true);
            }else{
                resolve(true);
            }

        });

        promise.then( () => {
            if(GlobalWebsocketActionExecutor.ACTION_HANDSHAKE === internalIdentifier){
                this.isReconnectHandshakeQueued = false;
            }

            WebsocketConnectionHandler.connection?.send(message);
        }).catch((data) => {
            // not doing anything with this because so far this block was reached only when websocket server was down

            let stringData = JSON.stringify(data);
            Logger.error("Error occurred when trying to send message, possibly the websocket connection is down(?). Data: " + stringData);
        })

    }

    /**
     * @description check if connection is open
     * @note        this strange CLOSING/CLOSED checks are necessary
     *              as it seems that when connection is OPEN then it sets `OPEN > 0`
     *              but at same time as connection is CLOSING it sets `CLOSING > 0` while `OPEN > 0` anyway
     */
    public static isConnectionOpen(): boolean
    {
        return (
                (WebsocketConnectionHandler.connection instanceof WebSocket)
            &&  (WebsocketConnectionHandler.connection.readyState === WebsocketConnectionHandler.connection.OPEN)
        );
    }

    /**
     * @description will attempt to reconnect once disconnected
     */
    private static reconnect(): void
    {
        if (EnvReader.isWebsocketDisabled() || !WebsocketConnectionHandler.connection) {
            return;
        }

        /**
         * @description prevent stacking connections
         */
        if(null !== WebsocketConnectionHandler.reconnectInterval){
            clearInterval(WebsocketConnectionHandler.reconnectInterval);
        }

        WebsocketConnectionHandler.reconnectInterval = setInterval(() => {
            Logger.info("Attempting to reconnect to socket");

            try{
                WebsocketConnectionHandler.connection = new WebSocket(EnvReader.getWebsocketUrl());
                WebsocketConnectionHandler.register();

                if(!WebsocketConnectionHandler.isReconnectHandshakeQueued){
                    GlobalWebsocketActionExecutor.sendHandshakeData();
                }

            }catch{
                // silently keep reconnecting
            }
        }, WebsocketConnectionHandler.DEFAULT_RECONNECT_DELAY);
    }

    /**
     * @description if by any chance the websocket connection will fail then this will handle checking maintenance state
     *              by doing ajax call. That's needed because normally state check happens via websocket, but if
     *              websocket server is down then the only option to check the state is doing ajax call (which ofc.
     *              might also fail if the backend itself is dead).
     *
     *              This call should happen only once for broken websocket connection, because otherwise there will be
     *              spam of ajax call, as it would be needed to call backend each few seconds.
     *
     *              In this case the backend gets called only when the websocket connection ever breaks (again).
     */
    private static handleDisabledState(): void {
        if (!WebsocketConnectionHandler.isConnectionOpen()) {
            let appAxios = new AppAxios();

            let url = SymfonyRoutes.buildUrl(SymfonySystemRoutes.GET_SYSTEM_DISABLED_STATE);
            appAxios.getWithCsrf(url, SystemDisabledStateResponse).then((response) => {
                let castedResponse = response as SystemDisabledStateResponse;
                if (castedResponse.disabled) {
                    EventDispatcherService.emitSystemDisabled(response.message);
                }
            })
        }
    }

}
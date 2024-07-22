import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

/**
 * @description return response which contain base information about offer handler state
 */
export default class GetOffersHandlerState extends BaseApiResponse
{
    private _reachable: boolean;
    private _quotaReached: boolean;

    get reachable(): boolean {
        return this._reachable;
    }

    set reachable(value: boolean) {
        this._reachable = value;
    }

    get quotaReached(): boolean {
        return this._quotaReached;
    }

    set quotaReached(value: boolean) {
        this._quotaReached = value;
    }

    /**
     * @description Create GetOffersHandlerState from json
     */
    public static fromJson(json: string): GetOffersHandlerState
    {
        let apiResponse = new GetOffersHandlerState();
        apiResponse.prefillBaseFields(json);

        try{
            var object = JSON.parse(json);
        }catch(Exception){
            ErrorHandler.throwJsonParsingError('GetOffersHandlerState', Exception, json);
        }

        apiResponse.quotaReached = object.quotaReached;
        apiResponse.reachable    = object.reachable;

        return apiResponse;
    }

}


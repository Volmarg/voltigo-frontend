import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

/**
 * @description contain information if user reached max active job search calls
 */
export default class CheckActiveJobSearchResponse extends BaseApiResponse
{
    private _maxReached   : boolean;
    private _countOfActive: number;

    get maxReached(): boolean {
        return this._maxReached;
    }

    set maxReached(value: boolean) {
        this._maxReached = value;
    }

    get countOfActive(): number {
        return this._countOfActive;
    }

    set countOfActive(value: number) {
        this._countOfActive = value;
    }

    /**
     * @description Create CheckActiveJobSearchResponse from json
     */
    public static fromJson(json: string): CheckActiveJobSearchResponse
    {
        let apiResponse = new CheckActiveJobSearchResponse();
        apiResponse.prefillBaseFields(json);

        try{
            var object = JSON.parse(json);
        }catch(Exception){
            ErrorHandler.throwJsonParsingError('CheckActiveJobSearchResponse', Exception, json);
        }

        apiResponse._maxReached    = object.maxReached;
        apiResponse._countOfActive = object.countOfActive;

        return apiResponse;
    }

}
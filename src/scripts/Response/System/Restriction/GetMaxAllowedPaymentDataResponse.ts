import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

/**
 * @description contain information about payment limitations
 */
export default class GetMaxAllowedPaymentDataResponse extends BaseApiResponse
{
    private _currency: number;
    private _unit: number;

    get currency(): number {
        return this._currency;
    }

    set currency(value: number) {
        this._currency = value;
    }

    get unit(): number {
        return this._unit;
    }

    set unit(value: number) {
        this._unit = value;
    }

    /**
     * @description Create GetMaxAllowedPaymentDataResponse from json
     */
    public static fromJson(json: string): GetMaxAllowedPaymentDataResponse
    {
        let apiResponse = new GetMaxAllowedPaymentDataResponse();
        apiResponse.prefillBaseFields(json);

        try {
            var object = JSON.parse(json);
        } catch (Exception) {
            ErrorHandler.throwJsonParsingError('GetMaxAllowedPaymentDataResponse', Exception, json);
        }

        apiResponse._currency = object.currency;
        apiResponse._unit     = object.unit;

        return apiResponse;
    }

}
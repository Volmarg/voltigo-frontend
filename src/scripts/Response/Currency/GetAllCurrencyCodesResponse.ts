import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

/**
 * Response containing all the currency codes
 */
export default class GetAllCurrencyCodesResponse extends BaseApiResponse
{
    private _currencyCodes: string;

    get currencyCodes(): string {
        return this._currencyCodes;
    }

    set currencyCodes(value: string) {
        this._currencyCodes = value;
    }

    /**
     * @description Create GetExchangeRate from json
     */
    public static fromJson(json: string): GetAllCurrencyCodesResponse
    {
        let apiResponse = new GetAllCurrencyCodesResponse();
        apiResponse.prefillBaseFields(json);

        try {
            var object = JSON.parse(json);
        } catch (Exception) {
            ErrorHandler.throwJsonParsingError('GetAllCurrencyCodesResponse', Exception, json);
        }

        apiResponse.currencyCodes = object.currencyCodes;
        return apiResponse;
    }

}
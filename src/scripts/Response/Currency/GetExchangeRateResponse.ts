import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

/**
 * Response containing exchange rate between 2 currencies
 */
export default class GetExchangeRateResponse extends BaseApiResponse
{
    private _exchangeRate: string;

    get exchangeRate(): string {
        return this._exchangeRate;
    }

    set exchangeRate(value: string) {
        this._exchangeRate = value;
    }

    /**
     * @description Create GetExchangeRate from json
     */
    public static fromJson(json: string): GetExchangeRateResponse
    {
        let apiResponse = new GetExchangeRateResponse();
        apiResponse.prefillBaseFields(json);

        try {
            var object = JSON.parse(json);
        } catch (Exception) {
            ErrorHandler.throwJsonParsingError('GetExchangeRateResponse', Exception, json);
        }

        apiResponse.exchangeRate = object.exchangeRate;
        return apiResponse;
    }

}
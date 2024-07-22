import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

/**
 * Response containing the payment intent token for handling stripe payment
 */
export default class GetPaymentIntentResponse extends BaseApiResponse {
    private _intentToken: string;

    get intentToken(): string {
        return this._intentToken;
    }

    set intentToken(value: string) {
        this._intentToken = value;
    }

    /**
     * @description Create GetPaymentIntentResponse from json
     */
    public static fromJson(json: string): GetPaymentIntentResponse {
        let apiResponse = new GetPaymentIntentResponse();
        apiResponse.prefillBaseFields(json);

        try {
            var object = JSON.parse(json);
        } catch (Exception) {
            ErrorHandler.throwJsonParsingError('GetPaymentIntentResponse', Exception, json);
        }

        apiResponse.intentToken = object.intentToken;
        return apiResponse;
    }

}
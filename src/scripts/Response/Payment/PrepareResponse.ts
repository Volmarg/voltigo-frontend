import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

/**
 * Response containing full offer description
 */
export default class PrepareResponse extends BaseApiResponse {
    private _orderId: string;

    get orderId(): string {
        return this._orderId;
    }

    set orderId(value: string) {
        this._orderId = value;
    }

    /**
     * @description Create PrepareResponse from json
     */
    public static fromJson(json: string): PrepareResponse {
        let apiResponse = new PrepareResponse();
        apiResponse.prefillBaseFields(json);

        try {
            var object = JSON.parse(json);
        } catch (Exception) {
            ErrorHandler.throwJsonParsingError('PrepareResponse', Exception, json);
        }

        apiResponse.orderId = object.orderId;
        return apiResponse;
    }

}
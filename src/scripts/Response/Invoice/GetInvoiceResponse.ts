import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

/**
 * Response containing prices of the product
 */
export default class GetInvoiceResponse extends BaseApiResponse
{
    private _invoicePathInPublic: string;

    get invoicePathInPublic(): string {
        return this._invoicePathInPublic;
    }

    set invoicePathInPublic(value: string) {
        this._invoicePathInPublic = value;
    }

    /**
     * @description Create GetInvoiceResponse from json
     */
    public static fromJson(json: string): GetInvoiceResponse
    {
        let apiResponse = new GetInvoiceResponse();
        apiResponse.prefillBaseFields(json);

        try {
            var object = JSON.parse(json);
        } catch (Exception) {
            ErrorHandler.throwJsonParsingError('GetInvoiceResponse', Exception, json);
        }

        apiResponse.invoicePathInPublic = object.invoicePathInPublic;

        return apiResponse;
    }

}
import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

type PointProductData = {
    id: number;
    name: string;
    description: string;
    currencyCode: string;
    priceWithoutTax: number;
    priceWithTax: number;
    amount: number
}

/**
 * Response containing all available point products data
 */
export default class GetAllPointProductDataResponse extends BaseApiResponse
{
    private _productsData: Array<PointProductData>;
    private _blockedProductIds: Array<number>;

    get productsData(): Array<PointProductData> {
        return this._productsData;
    }

    set productsData(value: Array<PointProductData>) {
        this._productsData = value;
    }

    get blockedProductIds(): Array<number> {
        return this._blockedProductIds;
    }

    set blockedProductIds(value: Array<number>) {
        this._blockedProductIds = value;
    }

    /**
     * @description Create GetAllPointProductDataResponse from json
     */
    public static fromJson(json: string): GetAllPointProductDataResponse
    {
        let apiResponse = new GetAllPointProductDataResponse();
        apiResponse.prefillBaseFields(json);

        try {
            var object = JSON.parse(json);
        } catch (Exception) {
            ErrorHandler.throwJsonParsingError('GetAllPointProductDataResponse', Exception, json);
        }

        apiResponse._productsData      = object.productsData;
        apiResponse._blockedProductIds = object.blockedProductIds;

        return apiResponse;
    }

}

export {PointProductData};
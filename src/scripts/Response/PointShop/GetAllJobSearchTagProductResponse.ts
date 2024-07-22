import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

import PointShopProduct from "@/scripts/Entity/PointShop/PointShopProduct";

/**
 * Response containing all available point products used in search (limit)
 */
export default class GetAllJobSearchTagProductResponse extends BaseApiResponse
{
    private _pointShopProducts: Array<PointShopProduct>;

    get pointShopProducts(): Array<PointShopProduct> {
        return this._pointShopProducts;
    }

    set pointShopProducts(value: Array<PointShopProduct>) {
        this._pointShopProducts = value;
    }

    /**
     * @description Create GetAllJobSearchTagProductResponse from json
     */
    public static fromJson(json: string): GetAllJobSearchTagProductResponse
    {
        let apiResponse = new GetAllJobSearchTagProductResponse();
        apiResponse.prefillBaseFields(json);

        try {
            var object = JSON.parse(json);
        } catch (Exception) {
            ErrorHandler.throwJsonParsingError('GetAllJobSearchTagProductResponse', Exception, json);
        }

        apiResponse.pointShopProducts = object.pointShopProducts;

        return apiResponse;
    }

}

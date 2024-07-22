import PointShopProduct from "@/scripts/Entity/PointShop/PointShopProduct";

import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

/**
 * Response containing all available point products data
 */
export default class GetPointShopProductResponse extends BaseApiResponse
{
    private _pointShopProduct: PointShopProduct;

    get pointShopProduct(): PointShopProduct {
        return this._pointShopProduct;
    }

    set pointShopProduct(value: PointShopProduct) {
        this._pointShopProduct = value;
    }

    /**
     * @description Create GetPointShopProductResponse from json
     */
    public static fromJson(json: string): GetPointShopProductResponse
    {
        let apiResponse = new GetPointShopProductResponse();
        apiResponse.prefillBaseFields(json);

        try {
            var object = JSON.parse(json);
        } catch (Exception) {
            ErrorHandler.throwJsonParsingError('GetPointShopProductResponse', Exception, json);
        }

        apiResponse.pointShopProduct = object.pointShopProduct;

        return apiResponse;
    }

}

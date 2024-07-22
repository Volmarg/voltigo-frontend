import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

type OrderData = {
    id: number;
    status: string;
    created: string;
    totalWithTax: number;
    totalWithoutTax: number;
    productsData: Array<string>;
    targetCurrencyCode: string;
}

/**
 * Response containing all the orders data
 */
export default class GetOrdersDataResponse extends BaseApiResponse
{
    private _ordersData: Array<OrderData>

    get ordersData(): Array<OrderData> {
        return this._ordersData;
    }

    set ordersData(value: Array<OrderData>) {
        this._ordersData = value;
    }

    /**
     * @description Create GetOrdersDataResponse from json
     */
    public static fromJson(json: string): GetOrdersDataResponse
    {
        let apiResponse = new GetOrdersDataResponse();
        apiResponse.prefillBaseFields(json);

        try {
            var object = JSON.parse(json);
        } catch (Exception) {
            ErrorHandler.throwJsonParsingError('GetOrdersDataResponse', Exception, json);
        }

        apiResponse._ordersData = object.ordersData;

        return apiResponse;
    }

}

export {OrderData};
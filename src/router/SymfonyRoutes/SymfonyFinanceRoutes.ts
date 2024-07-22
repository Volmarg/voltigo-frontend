/**
 * @description Contains logic related to finances
 */
export default class SymfonyFinanceRoutes
{
    /**
     * @description handles getting the exchange rate between 2 currencies
     */
    static readonly GET_CURRENCY_EXCHANGE_RATE                       = "/currency/exchange-rate/get/:fromCurrency/:targetCurrency";
    static readonly GET_CURRENCY_EXCHANGE_RATE_PARAM_FROM_CURRENCY   = "fromCurrency";
    static readonly GET_CURRENCY_EXCHANGE_RATE_PARAM_TARGET_CURRENCY = "targetCurrency";

    /**
     * @description provides array consisting of all currency codes
     */
    static readonly GET_ALL_CURRENCY_CODES = "/currency/get-all-codes";

    /**
     * @description provides the prices of the product
     */
    static readonly GET_PRODUCT_PRICE_PARAM_TARGET_CURRENCY = "targetCurrency";

    /**
     * @description will insert the order with its respective data into DB without sending data to finances tool
     */
    static readonly PAYMENT_PREPARED_PREPARE = "/payment/prepared/prepare";

    /**
     * @description will finish the prepared order
     */
    static readonly PAYMENT_PREPARED_FINISH                = "/payment/prepared/finish/:orderId";
    static readonly PAYMENT_PREPARED_FINISH_PARAM_ORDER_ID = "orderId"

    /**
     * @description will update the payment tool data for prepared order
     */
    static readonly PAYMENT_PREPARED_UPDATE_PAYMENT_TOOL                = "/payment/prepared/update-payment-tool-data/:orderId";
    static readonly PAYMENT_PREPARED_UPDATE_PAYMENT_TOOL_PARAM_ORDER_ID = "orderId"

    /**
     * @description will cancel the prepared order
     */
    static readonly PAYMENT_PREPARED_CANCEL                = "/payment/prepared/cancel/:orderId";
    static readonly PAYMENT_PREPARED_CANCEL_PARAM_ORDER_ID = "orderId"

    /**
     * @description will handle the payment error. Sends the failure data to backend.
     */
    static readonly PAYMENT_PREPARED_HANDLE_ERROR                = "/payment/prepared/handle-error/:orderId";
    static readonly PAYMENT_PREPARED_HANDLE_ERROR_PARAM_ORDER_ID = "orderId"

    /**
     * Returns token that can be used on front with custom workflow as mentioned in:
     * - {@link https://stripe.com/docs/payments/quickstart}
     */
    static readonly PAYMENT_STRIPE_GET_PAYMENT_INTENT_TOKEN = "/payment/stripe/get-payment-intent-token";

}
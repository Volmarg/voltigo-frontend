/**
 * @description Contains logic related to Point shop routes
 */
export default class SymfonyPointShopRoutes
{
    /**
     * @description returns all existing job search based {@see PointShopProduct}
     */
    static readonly GET_JOB_SEARCH_PRODUCTS = "/point-shop/job-offer-search/all"

    /**
     * @description returns email sending based {@see PointShopProduct}
     */
    static readonly GET_EMAIL_SENDING_PRODUCT = "/point-shop/email-sending";

    /**
     * @description returns all the {@see UserPointHistory} for logged-in user
     */
    static readonly GET_ALL_POINT_SHOP_HISTORY_ENTRIES = "/point-shop/history/get-all";

}
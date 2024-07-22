/**
 * @description Contains logic related to any kind of direct manipulation of user points
 *              - no ordering process,
 *              - no transactions handling etc.
 */
export default class SymfonyPointsRoutes
{
    /**
     * @description grants user points based on provided product
     */
    static readonly GRANT_POINTS_BY_PRODUCT = "/user-point/grant/:id"
    static readonly GRANT_POINTS_BY_PRODUCT_PARAM_ID = "id"

}
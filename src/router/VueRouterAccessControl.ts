import {RouteRecordRaw} from "vue-router";
import {Component}      from "vue";

/**
 * @description logic related to the control of the access to the page or resources
 */
export default class VueRouterAccessControl {

    static readonly ROUTE_NAME_USER_SECURITY = "BannedAccess";
    static readonly ROUTE_PATH_BANNED_BASE   = "/banned/access-denied";
    static readonly ROUTE_PATH_BANNED_HASH   = "/:hash";
    static readonly ROUTE_PATH_BANNED_FULL   = VueRouterAccessControl.ROUTE_PATH_BANNED_BASE + VueRouterAccessControl.ROUTE_PATH_BANNED_HASH;

    public static readonly routesConfiguration: Array<RouteRecordRaw> = [
        {
            path: VueRouterAccessControl.ROUTE_PATH_BANNED_FULL,
            name: VueRouterAccessControl.ROUTE_NAME_USER_SECURITY,
            component: (): Promise<Component> => import("@/views/Ban/Ban.vue"),
        },
    ]
}
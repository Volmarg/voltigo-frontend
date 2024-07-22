import {createRouter, createWebHashHistory, Router, RouteRecordRaw} from 'vue-router'
import Dashboard                                                    from '@/views/Dashboard.vue';
import VueRouterGuards                                              from "@/router/VueRouterGuards";
import SymfonyRolesAndRights                                        from "@/scripts/Core/Security/SymfonyRolesAndRights";
import VueRouterUser                                                from "@/router/VueRouterUser";
import VueRouterAccessControl                                       from "@/router/VueRouterAccessControl";
import {Component}                                                  from "vue";

/**
 * @description provided the vue router based logic / data
 */
export default class VueRouter
{
    /**
     * @description definitions of routes names
     */
    static readonly ROUTE_NAME_INFO = "Info";
    static readonly ROUTE_NAME_HOME  = "Home";
    static readonly ROUTE_NAME_LOGIN = "Login";
    static readonly ROUTE_NAME_404   = "404";
    static readonly ROUTE_NAME_MAINTENANCE = "Maintenance";
    static readonly ROUTE_NAME_ROLE_PROTECTED_PATH  = "RoleProtectedPath";
    static readonly ROUTE_NAME_USER_SETTINGS        = "UserSettings";
    static readonly ROUTE_NAME_REGISTER             = "Register";
    static readonly ROUTE_NAME_USER_PROFILE_ACTIVATION_CONFIRMATION     = "UserProfileActivationConfirmation";
    static readonly ROUTE_NAME_USER_PROFILE_PASSWORD_RESET_CONFIRMATION = "UserProfilePasswordResetConfirmation";
    static readonly ROUTE_NAME_JOB_OFFER_SEARCH_RESULTS = "JobOfferSearchResults";
    static readonly ROUTE_NAME_JOB_OFFER_SEARCH_RESULT_DETAILS = "JobOfferSearchResultDetails"
    static readonly ROUTE_NAME_JOB_OFFER_APPLICATIONS = "JobOfferApplications";
    static readonly ROUTE_NAME_JOB_OFFER_SEARCH = "JobOfferSearch";
    static readonly ROUTE_NAME_EMAIL_TEMPLATE_BUILDER = "EmailTemplateBuilder";
    static readonly ROUTE_NAME_DEVELOPMENT_PLAYGROUND = "DevelopmentPlayground";
    static readonly ROUTE_NAME_PAYMENTS_OVERVIEW = "PaymentsOverview"
    static readonly ROUTE_NAME_PAYMENTS_POINT_SHOP_HISTORY = "PointShopHistory"
    static readonly ROUTE_NAME_USER_NOT_ACTIVATED = "UserNotActivated"

    /**
     * @description definitions of routes paths
     */
    static readonly ROUTE_PATH_INFO= "/";
    static readonly ROUTE_PATH_NONE     = "#"; // special path, which will cause user to stay on current page
    static readonly ROUTE_PATH_LOGIN    = "/login";
    static readonly ROUTE_PATH_LOGOUT   = "/logout";
    static readonly ROUTE_PATH_REGISTER = "/register";
    static readonly ROUTE_PATH_HOME         = "/panel/start";
    static readonly ROUTE_PATH_MAINTENANCE  = "/maintenance";
    static readonly ROUTE_PATH_ROLE_PROTECTED_PATH                      = "/panel/role-protected-example";
    static readonly ROUTE_PATH_USER_SETTINGS                            = "/panel/user/settings";
    static readonly ROUTE_PATH_USER_PROFILE_ACTIVATION_CONFIRMATION     = "/user/profile-activation-confirmation/:token"
    static readonly ROUTE_PATH_USER_PROFILE_PASSWORD_RESET_CONFIRMATION = "/user/profile-password-reset-confirmation/:token"
    static readonly ROUTE_PATH_DEVELOPMENT_PLAYGROUND                   = "/panel/development/playground"
    static readonly ROUTE_PATH_USER_NOT_ACTIVATED                       = "/user/not-activated/:token"

    static readonly ROUTE_PATH_JOB_OFFER_SEARCH_RESULTS = "/panel/job-offer/search-results"
    static readonly ROUTE_PATH_JOB_APPLICATION          = "/panel/job-offer/applications";
    static readonly ROUTE_PATH_JOB_SEARCH               = "/panel/job-offer/search";
    static readonly ROUTE_PATH_JOB_SEARCH_DETAILS       = "/panel/job-offer/search/details/:id"

    static readonly ROUTE_PATH_EMAIL_TEMPLATE_BUILDER = "/panel/email/template-builder";

    static readonly ROUTE_PATH_PAYMENTS_OVERVIEW           = "/panel/payments/overview"
    static readonly ROUTE_PATH_PAYMENTS_POINT_SHOP_HISTORY = "/panel/payments/point-shop-history"

    /**
     * @description configuration of routes in vue itself
     *              these routes are recognized by vue
     */
    static readonly routes: Array<RouteRecordRaw> = [
        {
            path: VueRouter.ROUTE_PATH_LOGIN,
            name: VueRouter.ROUTE_NAME_LOGIN,
            component: (): Promise<Component> => import("@/views/Security/Login.vue"),
        },
        {
            path: "/:pathMatch(.*)",
            name: VueRouter.ROUTE_NAME_404,
            component: (): Promise<Component> => import("@/views/ErrorCodes/404.vue"),
        },
        {
            path: VueRouter.ROUTE_PATH_MAINTENANCE,
            name: VueRouter.ROUTE_NAME_MAINTENANCE,
            component: (): Promise<Component> => import("@/views/SystemState/Maintenance.vue"),
        },
        {
            path: VueRouter.ROUTE_PATH_ROLE_PROTECTED_PATH,
            name: VueRouter.ROUTE_NAME_ROLE_PROTECTED_PATH,
            component: (): Promise<Component> => import("@/views/Examples/RoleProtectedRoute.vue"),
            meta: {
                requiredRole: SymfonyRolesAndRights.ROLE_DEVELOPER,
            }
        },
        {
            path: VueRouter.ROUTE_PATH_REGISTER,
            name: VueRouter.ROUTE_NAME_REGISTER,
            component: (): Promise<Component> => import("@/views/Security/Register.vue"),
        },
        {
            path: VueRouter.ROUTE_PATH_USER_PROFILE_ACTIVATION_CONFIRMATION,
            name: VueRouter.ROUTE_NAME_USER_PROFILE_ACTIVATION_CONFIRMATION,
            component: (): Promise<Component> => import("@/views/User/ProfileActivationConfirmation.vue"),
        },
        {
            path: VueRouter.ROUTE_PATH_USER_NOT_ACTIVATED,
            name: VueRouter.ROUTE_NAME_USER_NOT_ACTIVATED,
            component: (): Promise<Component> => import("@/views/User/NotActivatedView.vue"),
        },
        {
            path: VueRouter.ROUTE_PATH_USER_PROFILE_PASSWORD_RESET_CONFIRMATION,
            name: VueRouter.ROUTE_NAME_USER_PROFILE_PASSWORD_RESET_CONFIRMATION,
            component: (): Promise<Component> => import("@/views/User/PasswordResetConfirmation.vue")
        },
        {
            path: VueRouter.ROUTE_PATH_INFO,
            name: VueRouter.ROUTE_NAME_INFO,
            component: (): Promise<Component> => import("@/views/InfoLandingPage/Page.vue")
        },
        /**
         * @description Logged in user routes
         *              these routes are rendered into special view accessible only for user
         */
        {
            path: "/",
            component: (): Promise<Component> => import("@/views/RouterViews/LoggedInUser.vue"),
            children: [
                {
                    path: VueRouter.ROUTE_PATH_USER_SETTINGS,
                    name: VueRouter.ROUTE_NAME_USER_SETTINGS,
                    component: (): Promise<Component> => import("@/views/User/Settings/Settings.vue"),
                    children: VueRouterUser.userRoutesConfiguration,
                    meta: {
                        requiredRole: SymfonyRolesAndRights.ROLE_USER,
                    }
                },
                {
                    path: VueRouter.ROUTE_PATH_JOB_OFFER_SEARCH_RESULTS,
                    name: VueRouter.ROUTE_NAME_JOB_OFFER_SEARCH_RESULTS,
                    component: (): Promise<Component> => import("@/views/JobOffer/SearchResult/Overview.vue"),
                    meta: {
                        requiredRole: SymfonyRolesAndRights.ROLE_USER,
                    }
                },
                {
                    path: VueRouter.ROUTE_PATH_JOB_SEARCH_DETAILS,
                    name: VueRouter.ROUTE_NAME_JOB_OFFER_SEARCH_RESULT_DETAILS,
                    component: (): Promise<Component> => import("@/views/JobOffer/SearchResult/Details.vue"),
                    meta: {
                        requiredRole: SymfonyRolesAndRights.ROLE_USER,
                    }
                },
                {
                    path: VueRouter.ROUTE_PATH_JOB_APPLICATION,
                    name: VueRouter.ROUTE_NAME_JOB_OFFER_APPLICATIONS,
                    component: (): Promise<Component> => import("@/views/JobOffer/Applications.vue"),
                    meta: {
                        requiredRole: SymfonyRolesAndRights.ROLE_USER,
                    }
                },
                {
                    path: VueRouter.ROUTE_PATH_JOB_SEARCH,
                    name: VueRouter.ROUTE_NAME_JOB_OFFER_SEARCH,
                    component: (): Promise<Component> => import("@/views/JobOffer/Search.vue"),
                    meta: {
                        requiredRole: SymfonyRolesAndRights.ROLE_USER,
                    }
                },
                {
                    path: VueRouter.ROUTE_PATH_EMAIL_TEMPLATE_BUILDER,
                    name: VueRouter.ROUTE_NAME_EMAIL_TEMPLATE_BUILDER,
                    component: (): Promise<Component> => import('@/views/Email/Template/Builder.vue'),
                    meta: {
                        requiredRole: SymfonyRolesAndRights.ROLE_USER,
                    }
                },
                {
                  path: VueRouter.ROUTE_PATH_DEVELOPMENT_PLAYGROUND,
                  name: VueRouter.ROUTE_NAME_DEVELOPMENT_PLAYGROUND,
                  component: (): Promise<Component> => import("@/views/Development/Playground.vue"),
                  meta: {
                      requiredRole: SymfonyRolesAndRights.ROLE_DEVELOPER,
                  }
                },
                {
                  path: VueRouter.ROUTE_PATH_PAYMENTS_OVERVIEW,
                  name: VueRouter.ROUTE_NAME_PAYMENTS_OVERVIEW,
                  component: (): Promise<Component> => import("@/views/Payments/Overview.vue"),
                },
                {
                    path: VueRouter.ROUTE_PATH_PAYMENTS_POINT_SHOP_HISTORY,
                    name: VueRouter.ROUTE_NAME_PAYMENTS_POINT_SHOP_HISTORY,
                    component: (): Promise<Component> => import("@/views/Payments/PointShopHistory.vue"),
                },
                {
                    path: VueRouter.ROUTE_PATH_HOME,
                    name: VueRouter.ROUTE_NAME_HOME,
                    component: Dashboard
                },
            ],
        },
        ...VueRouterAccessControl.routesConfiguration,
        ...VueRouterUser.userSettingLandingPageRoutesConfiguration
    ]

    /**
     * @description will return router with added routes and guards
     */
    public getPreconfiguredRouter(ignoreGuard: boolean = false): Router
    {
        let router = createRouter({
            history : createWebHashHistory(),
            routes  : VueRouter.routes
        });

        // this causes some loop issue
        if(!ignoreGuard){
            let vueRouterGuards = new VueRouterGuards();
            router              = vueRouterGuards.setHelpers(router); // must be set first otherwise guards might redirect user before helper is set
            router              = vueRouterGuards.setGuards(router);
        }

        return router;
    }
}
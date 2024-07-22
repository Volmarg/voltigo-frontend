export enum MAP_TYPE {
    IFRAME,
    NORMAL
}

/**
 * @description this class handles logic related to google maps
 */
export default class GoogleMapsService
{
    private static readonly GOOGLE_MAPS_LOCATION_BASE_URL        = "https://maps.google.com/maps?t=&z=13&ie=UTF8&iwloc=";
    private static readonly GOOGLE_MAPS_LOCATION_IFRAME_BASE_URL = GoogleMapsService.GOOGLE_MAPS_LOCATION_BASE_URL + "&output=embed&q=";
    private static readonly GOOGLE_MAPS_LOCATION_NORMAL_BASE_URL = GoogleMapsService.GOOGLE_MAPS_LOCATION_BASE_URL + "&q=";

    /**
     * @description will build google maps url for given location string
     *              this does not guarantee 100% accurate location,
     *              should be around 90-95% accurate
     */
    public static buildGoogleMapsUrlForLocationString(location: string, type: MAP_TYPE = MAP_TYPE.IFRAME): string
    {
        if (type === MAP_TYPE.IFRAME) {
            return GoogleMapsService.GOOGLE_MAPS_LOCATION_IFRAME_BASE_URL + location;
        }

        return GoogleMapsService.GOOGLE_MAPS_LOCATION_NORMAL_BASE_URL + location;
    }

}
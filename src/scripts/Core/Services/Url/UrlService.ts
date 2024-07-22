/**
 * @description provides logic for handling urls
 */
export default class UrlService
{
    /**
     * @description returns host for url
     */
    public static getHost(url: string, stripWww = false): string | null
    {
        let host = (new URL(url)).host as string | null;
        if(stripWww){
            host = UrlService.removeWwwPrefix(host);
        }

        return host;
    }

    /**
     * @description will remove www prefix from url
     */
    public static removeWwwPrefix(url: string | null): string | null
    {
        if (null === url) {
            return null;
        }

        return url.replace("www.", "");
    }

    /**
     * @description removes the http(s) from url
     */
    public static removeProtocol(url: string | null): string | null
    {
        if (null === url) {
            return null;
        }

        let regexp          = new RegExp(/http[s]?:\/\//);
        let protocolLessUrl = url.replace(regexp, "");

        return protocolLessUrl;
    }

    /**
     * {@see UrlService.removeWwwPrefix}
     * {@see UrlService.removeProtocol}
     */
    public static removeWwwAndProtocol(url: string | null): string | null
    {
        if (null === url) {
            return null;
        }

        let wwwLessUrl    = UrlService.removeWwwPrefix(url);
        let procolLessUrl = UrlService.removeProtocol(wwwLessUrl);

        return procolLessUrl;
    }
}
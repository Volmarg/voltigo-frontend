/**
 * @description handles google search based logic
 */
export default class GoogleSearchService {

    private static readonly COM_BASE    = 'https://www.google.com/';
    private static readonly SEARCH_URI  = "search"
    private static readonly QUERY_PARAM = "q";

    /**
     * @description will build to the Google search page with given query
     */
    public static buildSearchLink(query: string): string {
        let encodedQuery = encodeURIComponent(query);
        let url          = GoogleSearchService.COM_BASE
                         + GoogleSearchService.SEARCH_URI
                         + "?"
                         + GoogleSearchService.QUERY_PARAM
                         + `=${encodedQuery}`
        return url;
    }

}
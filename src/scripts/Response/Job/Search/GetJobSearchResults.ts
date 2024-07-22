import {JobSearchResult} from "@/scripts/Entity/Job/JobSearchResult";
import BaseApiResponse   from "@/scripts/Response/BaseApiResponse";
import ErrorHandler      from "@/scripts/Response/ErrorHandler";

/**
 * Response containing job search results (only the searches themselves - does not contain found offers)
 */
export default class GetJobSearchResults extends BaseApiResponse
{
    private _searchResults: Array<JobSearchResult>;

    get searchResults(): Array<JobSearchResult> {
        return this._searchResults;
    }

    set searchResults(value: Array<JobSearchResult>) {
        this._searchResults = value;
    }

    /**
     * @description Create GetJobSearchResults from json
     */
    public static fromJson(json: string): GetJobSearchResults
    {
        let apiResponse = new GetJobSearchResults();
        apiResponse.prefillBaseFields(json);

        try{
            var object = JSON.parse(json);
        }catch(Exception){
            ErrorHandler.throwJsonParsingError('GetJobSearchResults', Exception, json);
        }

        apiResponse.searchResults = object.searchResults;
        return apiResponse;
    }

}
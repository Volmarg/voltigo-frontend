import {JobOfferSearchResultDetailFilter} from "@/scripts/Entity/Job/Filter/JobOfferSearchResultDetailFilter";
import BaseApiResponse                    from "@/scripts/Response/BaseApiResponse";
import ErrorHandler                       from "@/scripts/Response/ErrorHandler";

/**
 * Response containing information about the structure of configuration of the job offers search result filter
 */
export default class GetDefaultFilter extends BaseApiResponse

{
    private _filterData: JobOfferSearchResultDetailFilter

    get filterData(): JobOfferSearchResultDetailFilter {
        return this._filterData;
    }

    set filterData(value: JobOfferSearchResultDetailFilter) {
        this._filterData = value;
    }

    /**
     * @description Create GetDefaultFilter from json
     */
    public static fromJson(json: string): GetDefaultFilter
    {
        let apiResponse = new GetDefaultFilter();
        apiResponse.prefillBaseFields(json);

        try{
            var object = JSON.parse(json);
        }catch(Exception){
            ErrorHandler.throwJsonParsingError('GetDefaultFilter', Exception, json);
        }

        apiResponse.filterData = object.filterData;
        return apiResponse;
    }

}
import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

/**
 * Response containing information about countries for which job offers can be searched for
 */
export default class GetSupportedCountries extends BaseApiResponse

{
    private _countryNames: Record<string, string>;

    get countryNames(): Record<string, string> {
        return this._countryNames;
    }

    set countryNames(value: Record<string, string>) {
        this._countryNames = value;
    }

    /**
     * @description Create GetSupportedCountries from json
     */
    public static fromJson(json: string): GetSupportedCountries
    {
        let apiResponse = new GetSupportedCountries();
        apiResponse.prefillBaseFields(json);

        try{
            var object = JSON.parse(json);
        }catch(Exception){
            ErrorHandler.throwJsonParsingError('GetSupportedCountries', Exception, json);
        }

        apiResponse.countryNames = object.countryNames;
        return apiResponse;
    }

}
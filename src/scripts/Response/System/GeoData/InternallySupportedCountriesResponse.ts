import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

type CountryData = {
    twoDigitCode: string
}

/**
 * @description return response which contain information which countries are getting used internally (in project)
 */
export default class InternallySupportedCountriesResponse extends BaseApiResponse
{
    private _countriesData: Array<CountryData>;

    get countriesData(): Array<CountryData> {
        return this._countriesData;
    }

    set countriesData(value: Array<CountryData>) {
        this._countriesData = value;
    }

    /**
     * @description Create InternallySupportedCountriesResponse from json
     */
    public static fromJson(json: string): InternallySupportedCountriesResponse
    {
        let apiResponse = new InternallySupportedCountriesResponse();
        apiResponse.prefillBaseFields(json);

        try{
            var object = JSON.parse(json);
        }catch(Exception){
            ErrorHandler.throwJsonParsingError('InternallySupportedCountriesResponse', Exception, json);
        }

        apiResponse.countriesData = object.countriesData;

        return apiResponse;
    }

}

export {CountryData}
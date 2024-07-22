import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";
import BaseApiResponse    from "@/scripts/Response/BaseApiResponse";
import ErrorHandler       from "@/scripts/Response/ErrorHandler";

type FilterValues = {
    cityFilterValues    : Array<CityFilterValue>,
    countryFilterValues : Array<CountryFilterValue>,
    minSalary        : number,
    maxSalary        : number,
};

type CityFilterValue = {
    offersCount : number,
    cityName    : string
};

type CountryFilterValue = {
    offersCount : number,
    countryName : string
};


/**
 * Response containing job offers on which user can apply to
 */
export default class GetJobOffers extends BaseApiResponse
{
    private _filterValues: FilterValues;
    private _jobOffers: Array<JobOfferAnalyzed>;
    private _allFoundOffersCount: number;
    private _returnedOffersCount: number;
    private _appliedOffersCount: number;

    get filterValues(): FilterValues {
        return this._filterValues;
    }

    set filterValues(value: FilterValues) {
        this._filterValues = value;
    }

    get jobOffers(): Array<JobOfferAnalyzed> {
        return this._jobOffers;
    }

    set jobOffers(value: Array<JobOfferAnalyzed>) {
        this._jobOffers = value;
    }

    get allFoundOffersCount(): number {
        return this._allFoundOffersCount;
    }

    set allFoundOffersCount(value: number) {
        this._allFoundOffersCount = value;
    }

    get returnedOffersCount(): number {
        return this._returnedOffersCount;
    }

    set returnedOffersCount(value: number) {
        this._returnedOffersCount = value;
    }

    get appliedOffersCount(): number {
        return this._appliedOffersCount;
    }

    set appliedOffersCount(value: number) {
        this._appliedOffersCount = value;
    }

    /**
     * @description Create GetJobOffers from json
     */
    public static fromJson(json: string): GetJobOffers
    {
        let apiResponse = new GetJobOffers();
        apiResponse.prefillBaseFields(json);

        try{
            var object = JSON.parse(json);
        }catch(Exception){
            ErrorHandler.throwJsonParsingError('GetJobOffers', Exception, json);
        }

        apiResponse.jobOffers           = object.jobOffersDataArray;
        apiResponse.allFoundOffersCount = object.allFoundOffersCount;
        apiResponse.returnedOffersCount = object.returnedOffersCount;
        apiResponse.filterValues        = object.filterValuesDataArray;
        apiResponse.appliedOffersCount  = object.appliedOffersCount;

        return apiResponse;
    }

}

export {FilterValues, CityFilterValue, CountryFilterValue}
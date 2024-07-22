import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

/**
 * @description check if user reached max email templates
 */
export default class CheckEmailTemplateRestrictions extends BaseApiResponse
{
    private _maxReached : boolean;
    private _count      : number;
    private _maxAllowed  : number;

    get maxReached(): boolean {
        return this._maxReached;
    }

    set maxReached(value: boolean) {
        this._maxReached = value;
    }

    get count(): number {
        return this._count;
    }

    set count(value: number) {
        this._count = value;
    }

    get maxAllowed(): number {
        return this._maxAllowed;
    }

    set maxAllowed(value: number) {
        this._maxAllowed = value;
    }

    /**
     * @description Create CheckEmailTemplateRestrictions from json
     */
    public static fromJson(json: string): CheckEmailTemplateRestrictions
    {
        let apiResponse = new CheckEmailTemplateRestrictions();
        apiResponse.prefillBaseFields(json);

        try{
            var object = JSON.parse(json);
        }catch(Exception){
            ErrorHandler.throwJsonParsingError('CheckEmailTemplateRestrictions', Exception, json);
        }

        apiResponse._maxReached = object.maxReached;
        apiResponse._maxAllowed = object.maxAllowed;
        apiResponse._count      = object.count;

        return apiResponse;
    }

}
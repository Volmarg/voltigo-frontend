import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

/**
 * Response containing full offer description
 */
export default class GetFullDescription extends BaseApiResponse
{
    private _description: string;

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    /**
     * @description Create GetFullDescription from json
     */
    public static fromJson(json: string): GetFullDescription
    {
        let apiResponse = new GetFullDescription();
        apiResponse.prefillBaseFields(json);

        try{
            var object = JSON.parse(json);
        }catch(Exception){
            ErrorHandler.throwJsonParsingError('GetFullDescription', Exception, json);
        }

        apiResponse.description = object.description;
        return apiResponse;
    }

}
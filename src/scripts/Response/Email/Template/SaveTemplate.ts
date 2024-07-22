import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

/**
 * @description consist of the data returned after saving template
 */
export default class SaveTemplate extends BaseApiResponse
{
    private _templateId: number | null;

    get templateId(): number | null {
        return this._templateId;
    }

    set templateId(value: number | null) {
        this._templateId = value;
    }

    /**
     * @description Create SaveTemplate from json
     */
    public static fromJson(json: string): SaveTemplate
    {
        let apiResponse = new SaveTemplate();
        apiResponse.prefillBaseFields(json);

        try{
            var object = JSON.parse(json);
        }catch(Exception){
            ErrorHandler.throwJsonParsingError('SaveTemplate', Exception, json);
        }

        apiResponse._templateId = object.templateId;
        return apiResponse;
    }

}
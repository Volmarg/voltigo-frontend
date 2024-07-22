import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

/**
 * @description contains template editor variables data
 */
export default class GetEditorVariables extends BaseApiResponse
{
    private _variablesData: Array<number | string | boolean>;

    get variablesData(): Array<number | string | boolean> {
        return this._variablesData;
    }

    set variablesData(value: Array<number | string | boolean>) {
        this._variablesData = value;
    }

    /**
     * @description Create GetEditorVariables from json
     */
    public static fromJson(json: string): GetEditorVariables
    {
        let apiResponse = new GetEditorVariables();
        apiResponse.prefillBaseFields(json);

        try{
            var object = JSON.parse(json);
        }catch(Exception){
            ErrorHandler.throwJsonParsingError('GetEditorVariables', Exception, json);
        }

        apiResponse.variablesData = object.variablesData;
        return apiResponse;
    }

}
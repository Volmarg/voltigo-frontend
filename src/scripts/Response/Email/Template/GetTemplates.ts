import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import EmailTemplate   from "@/scripts/Entity/Email/EmailTemplate";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

/**
 * @description consist of the email templates from the backend
 */
export default class GetTemplates extends BaseApiResponse
{
    private _templatesDataArray: Array<EmailTemplate>;

    get templatesDataArray(): Array<EmailTemplate> {
        return this._templatesDataArray;
    }

    set templatesDataArray(value: Array<EmailTemplate>) {
        this._templatesDataArray = value;
    }

    /**
     * @description Create GetTemplatesForUser from json
     */
    public static fromJson(json: string): GetTemplates
    {
        let apiResponse = new GetTemplates();
        apiResponse.prefillBaseFields(json);

        try{
            var object = JSON.parse(json);
        }catch(Exception){
            ErrorHandler.throwJsonParsingError('GetTemplatesForUser', Exception, json);
        }

        apiResponse._templatesDataArray = object.templatesDataArray;
        return apiResponse;
    }

}
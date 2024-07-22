import EmailTemplate   from "@/scripts/Entity/Email/EmailTemplate";
import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

/**
 * @description consist of the email template from backend, or returns null if there was no necessity of re-fetching template
 */
export default class ReFetchTemplate extends BaseApiResponse
{
    private _emailTemplate: EmailTemplate | null;

    get emailTemplate(): EmailTemplate | null {
        return this._emailTemplate;
    }

    set emailTemplate(value: EmailTemplate | null) {
        this._emailTemplate = value;
    }

    /**
     * @description check if email template is returned or not
     */
    public isTemplateSet(): boolean {
        return null !== this.emailTemplate;
    }

    /**
     * @description Create ReFetchTemplate from json
     */
    public static fromJson(json: string): ReFetchTemplate
    {
        let apiResponse = new ReFetchTemplate();
        apiResponse.prefillBaseFields(json);

        try{
            var object = JSON.parse(json);
        }catch(Exception){
            ErrorHandler.throwJsonParsingError('ReFetchTemplate', Exception, json);
        }

        apiResponse._emailTemplate = object.emailTemplate;
        if (null !== object.emailTemplate) {
            apiResponse._emailTemplate = JSON.parse(object.emailTemplate);
        }

        return apiResponse;
    }

}
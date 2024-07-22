import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

/**
 * @description contain information about restriction related to sending test E-Mail for E-Mail Template
 */
export default class MaxTemplateTestEmailResponse extends BaseApiResponse
{
    private _sentToday: number;
    private _maxPerDay: number;

    get sentToday(): number {
        return this._sentToday;
    }

    set sentToday(value: number) {
        this._sentToday = value;
    }

    get maxPerDay(): number {
        return this._maxPerDay;
    }

    set maxPerDay(value: number) {
        this._maxPerDay = value;
    }

    /**
     * @description Create MaxTemplateTestEmailResponse from json
     */
    public static fromJson(json: string): MaxTemplateTestEmailResponse
    {
        let apiResponse = new MaxTemplateTestEmailResponse();
        apiResponse.prefillBaseFields(json);

        try {
            var object = JSON.parse(json);
        } catch (Exception) {
            ErrorHandler.throwJsonParsingError('MaxTemplateTestEmailResponse', Exception, json);
        }

        apiResponse._sentToday = object.sentToday;
        apiResponse._maxPerDay = object.maxPerDay;

        return apiResponse;
    }

}
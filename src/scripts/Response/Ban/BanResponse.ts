import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

export enum BanType {
     "USER",
    "IP"
}

/**
 * Contains about bestowed ban
 */
export default class BanResponse extends BaseApiResponse
{
    private _activeBanTypes: Array<string>
    private _redirectUrl: string | null;
    private _validTill: string | null;

    get validTill(): string | null {
        return this._validTill;
    }

    set validTill(value: string | null) {
        this._validTill = value;
    }

    get activeBanTypes(): Array<string> {
        return this._activeBanTypes;
    }

    set activeBanTypes(value: Array<string>) {
        this._activeBanTypes = value;
    }

    get redirectUrl(): string | null {
        return this._redirectUrl;
    }

    set redirectUrl(value: string | null) {
        this._redirectUrl = value;
    }

    /**
     * @description Create BanResponse from json
     */
    public static fromJson(json: string): BanResponse
    {
        let apiResponse = new BanResponse();
        apiResponse.prefillBaseFields(json);

        try{
            var object = JSON.parse(json);
        } catch (Exception) {
            ErrorHandler.throwJsonParsingError('BanResponse', Exception, json);
        }

        apiResponse._activeBanTypes = object.activeBanTypes ?? [];
        apiResponse._redirectUrl    = object.redirectUrl ?? null;
        apiResponse._validTill      = object.validTill ?? null;

        return apiResponse;
    }

}

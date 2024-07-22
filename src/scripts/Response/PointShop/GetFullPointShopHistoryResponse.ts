import BaseApiResponse from "@/scripts/Response/BaseApiResponse";
import ErrorHandler    from "@/scripts/Response/ErrorHandler";

import {PointShopProductEnum} from "@/scripts/Enum/PointShopProductEnum";

type UserPointHistory = {
    id: number,
    created: string,
    amountBefore: number,
    amountNow: number,
    type: TypeEnum,
    extraData: Array<string>,
    information: string,
    isUsed: () => boolean,
    isJobSearchProduct: () => boolean,
    isEmailSendingProduct: () => boolean,
    hasRelatedProduct: () => boolean,
    productSnapshotIdentifier: null | PointShopProductEnum,
    getJobSearchProductData: () => JobSearchProductData,
    getEmailSendingProductData: () => EmailSendingProductData,
}

type ApplicationData = {
    offerUrl: string,
    offerTitle: string,
    offerCompanyName: string,
}

type JobSearchProductData = {
    jobSearchKeywords: Array<string>,
    targetArea: string,
    locationName: string | null,
    maxDistance: number | null
}

type EmailSendingProductData = {
    applicationsData: Array<ApplicationData>,
}

enum TypeEnum {
    "used"     = "USED",
    "received" = "RECEIVED",
}

/**
 * Response containing all point shop history entries
 */
export default class GetFullPointShopHistoryResponse extends BaseApiResponse
{
    private _historyEntries: Array<UserPointHistory>;

    get historyEntries(): Array<UserPointHistory> {
        return this._historyEntries;
    }

    set historyEntries(value: Array<UserPointHistory>) {
        this._historyEntries = value;
    }

    /**
     * @description Create GetFullPointShopHistoryResponse from json
     */
    public static fromJson(json: string): GetFullPointShopHistoryResponse
    {
        let apiResponse = new GetFullPointShopHistoryResponse();
        apiResponse.prefillBaseFields(json);

        try {
            var object = JSON.parse(json);
        } catch (Exception) {
            ErrorHandler.throwJsonParsingError('GetFullPointShopHistoryResponse', Exception, json);
        }

        let returnedEntries = [] as Array<UserPointHistory>;

        let isJobSearchProduct = (entry: UserPointHistory): boolean => {
            return (entry.productSnapshotIdentifier.includes("JOB_SEARCH_TAG"));
        }

        for (let entry of object.historyEntries) {
            entry.isUsed = () => (entry.type === TypeEnum.used);
            entry.isJobSearchProduct = () => isJobSearchProduct(entry);
            entry.isEmailSendingProduct = () : boolean => (entry.productSnapshotIdentifier === PointShopProductEnum.emailSending);
            entry.hasRelatedProduct = (): boolean => (null !== entry.productSnapshotIdentifier);
            entry.getJobSearchProductData = (): Array<string> => (entry.extraData);
            entry.getEmailSendingProductData = (): Array<string> => (entry.extraData);

            returnedEntries.push(entry);
        }

        apiResponse._historyEntries = returnedEntries;

        return apiResponse;
    }

}

export {UserPointHistory};
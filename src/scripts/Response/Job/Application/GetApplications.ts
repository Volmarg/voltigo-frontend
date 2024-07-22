import {JobApplication} from "@/scripts/Entity/Job/JobApplications";
import BaseApiResponse  from "@/scripts/Response/BaseApiResponse";
import ErrorHandler     from "@/scripts/Response/ErrorHandler";

/**
 * Response containing job applications on user had applied
 */
export default class GetApplications extends BaseApiResponse
{
    private _jobApplications: Array<JobApplication>;

    get jobApplications(): Array<JobApplication> {
        return this._jobApplications;
    }

    set jobApplications(value: Array<JobApplication>) {
        this._jobApplications = value;
    }

    /**
     * @description Create GetApplications from json
     */
    public static fromJson(json: string): GetApplications
    {
        let apiResponse = new GetApplications();
        apiResponse.prefillBaseFields(json);

        try{
            var object = JSON.parse(json);
        }catch(Exception){
            ErrorHandler.throwJsonParsingError('GetApplications', Exception, json);
        }

        apiResponse.jobApplications = object.jobApplications;
        return apiResponse;
    }

}
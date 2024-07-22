/**
 * @description Contains logic related to File routes
 */
export default class SymfonyFileRoutes
{
    /**
     * @description Handles file upload
     */
    static readonly UPLOAD_FILES = "/upload/";

    /**
     * @description returns the upload configuration rules
     */
    static readonly GET_UPLOAD_CONFIGURATION          = "/upload/get-configuration/:id"
    static readonly GET_UPLOAD_CONFIGURATION_PARAM_ID = "id";

    /**
     * @description returns the user CV files list
     */
    static readonly GET_USER_CV_LIST = "/get-user-cv-list";

    /**
     * @description handles the file removal
     */
    static readonly DELETE_FILE          = "/upload/delete/:uploadedFile";
    static readonly DELETE_FILE_PARAM_ID = "uploadedFile"; // correct, since this is auto resolved on backend

    /**
     * @description handles the file data update
     */
    static readonly UPDATE_FILE          = "/upload/update/:uploadedFile";
    static readonly UPDATE_FILE_PARAM_ID = "uploadedFile"; // correct, since this is auto resolved on backend
}
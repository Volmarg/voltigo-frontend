/**
 * @description contains only the events that COME from EasyEmail
 */
export default class Incoming {
    /**
     * @description notification that email template has been rendered and things con be done with it, it's basically
     *              ready to be used
     */
    public static readonly TEMPLATE_RENDERED = 'templateRendered';

    /**
     * @description triggers saving the updated email template content in CURRENT project
     */
    public static readonly SAVE_TEMPLATE = 'saveTemplate';

    /**
     * @description indicator that user clicked inside the EasyEmail window, can for example be used for
     *              either tracking user or refreshing the token in CURRENT project
     */
    public static readonly WINDOW_CLICK = 'clickedInsideEmailEditor';

    /**
     * @description EasyEmail asks for security token (to validate if user can open page etc.)
     */
    public static readonly GET_SECRET = 'getSecret';

    /**
     * @description EasyEmail has some upload logic, but it should not communicate with backend for that
     *              that's why this project will do that on it's behalf
     */
    public static readonly UPLOAD_FILE = 'uploadFile';
}
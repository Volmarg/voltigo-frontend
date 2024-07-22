/**
 * @description contains only the events that ARE SENT to EasyEmail
 */
export default class Outgoing {

    /**
     * @description handles storing special secret generated in CURRENT project.
     *              EasyEmail should not be accessible anywhere else other than within the iframe of THIS
     *              project, so if the secret is missing or is invalid on EasyEmail, then
     *              nothing will render
     */
    public static readonly SET_SECRET = 'storeSecret';

    /**
     * @description request to render the email template as raw html (used for example for building emails that will be then
     *              sent as applications to offers)
     */
    public static readonly RENDER_HTML_FOR_TEMPLATE = 'renderHtmlForTemplate';

    /**
     * @description send the template data to the EasyEmail, that will be then stored in the localStorage on EasyEmail side
     *              once the request with query params comes to EasyEmail, the data will be loaded on its side
     */
    public static readonly STORE_TEMPLATE_DATA = "storeTemplateData";

    /**
     * @description send the dummy variables used in the template rendering process - used mostly for generating email
     *              template miniature image
     */
    public static readonly STORE_DUMMY_TEMPLATE_VARIABLES = "storeDummyTemplateVariables";

    /**
     * @description sends the uploaded file data, for more information {@see Incoming.UPLOAD_FILE}
     */
    public static readonly FILE_UPLOADED = "fileUploaded"
}
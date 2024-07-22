/**
 * @description represents entity data from backend
 */
export default interface EmailTemplate
{
    body: string;
    exampleHtml: string;
    subject: string;
    deleted?: boolean;
    emailTemplateName: string;
    id: number | null;
    created?: string;
    modified?: string;
}
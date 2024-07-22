import Salary         from "@/scripts/Entity/Job/Salary";
import ContactDetail  from "@/scripts/Entity/Job/ContactDetail";
import CompanyDetail  from "@/scripts/Entity/Job/CompanyDetail";

/**
 * @description represents set of data regarding the job offer and analyse result
 */
interface JobOfferAnalyzed {
    identifier: number,
    jobDescription: string,
    jobTitle: string,
    jobOfferUrl: string,
    jobOfferHost: string,
    jobOfferLanguage: null | string,
    jobPostedDateTime: null | string,
    humanLanguages: Array<string>,
    hasMail: boolean,
    hasPhone: boolean,
    hasSalary: boolean,
    hasLocation: boolean,
    remoteJobMentioned: boolean,
    hasHumanLanguages: boolean,
    hasJobDateTimePostedInformation: boolean,
    salary: Salary,
    contactDetail: ContactDetail,
    companyDetail: CompanyDetail,
    appliedAt: null | string,
    isSelected: false,
}

export {
    JobOfferAnalyzed
}
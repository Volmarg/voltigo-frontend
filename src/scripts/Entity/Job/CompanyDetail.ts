/**
 * @description Represents the company detail
 */
export default interface CompanyDetail {
    companyName: string,
    companyLocations: Array<string>,
    ageOld: number | null,
    employeesRange: string | null,
    websiteUrl: string | null,
    linkedinProfileUrl: string | null,
    industries: Array<string>
}
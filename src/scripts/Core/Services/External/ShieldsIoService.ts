/**
 * @description builds links to badges from:
 *              - {@link https://shields.io/}
 *              Guides / Information:
 *              - {@link https://javascript.plainenglish.io/how-to-make-custom-language-badges-for-your-profile-using-shields-io-d2aeaf016b6b}
 */
export default class ShieldsIoService {

    private static readonly BASE_URL = "https://img.shields.io/badge/";

    /**
     *  @description returns the badge url
     */
    public static getBadgeUrl(
        text: string,
        backgroundColor: string,
        logoColor: string, // only if using shields.io based logo (it provides variety of logos but ofc not for all pages / brands)
        logoBase64: string,
        style = 'for-the-badge'
    ): string {
        return `${ShieldsIoService.BASE_URL}-${text}-${backgroundColor}?style=${style}&logoColor=${logoColor}&logo=${logoBase64}`;
    }

}
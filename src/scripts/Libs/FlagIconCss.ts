import IsoCountries from "@/scripts/Libs/IsoCountries";

/**
 * @description handles providing class names which result of showing country flag by taking the speaking human
 *              language as argument
 *
 * @link https://www.npmjs.com/package/flag-icon-css
 * @link https://www.npmjs.com/package/flag-icons
 */
export default class FlagIconCss
{
    private static readonly FLAG_ICON_CSS_CLASS_BASE = "flag-icon flag-icon-";

    /**
     * @description will return flag css for spoken language (in english)
     */
    public static getFlagCssForLanguage(spokenLanguage: string): string | null
    {
        let countryCode2Digit = IsoCountries.getCountry3166IsoCodeForSpokenLanguage(spokenLanguage);
        if (null === countryCode2Digit) {
            return null;
        }

        return FlagIconCss.FLAG_ICON_CSS_CLASS_BASE + countryCode2Digit;
    }

}
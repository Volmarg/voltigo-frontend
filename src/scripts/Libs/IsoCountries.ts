import {countries, languages} from 'countries-list'
import TypeChecker            from "@/scripts/Core/Services/Types/TypeChecker";
import StringTypeProcessor    from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";
import {Country}              from "@/scripts/Entity/Geolocation/Country";

/**
 * @description handles ISO language / locale based logic,
 * @link https://annexare.github.io/Countries/
 */
export default class IsoCountries {

    /**
     * @description will return human friendly country name created from the ISO 31661 (3 DIGIT)
     *              od null if no country was found for provided code
     */
    public static getHumanCountryNameForIso31661ThreeDigitCode(code: string): string | null
    {
        if (StringTypeProcessor.isEmptyString(code)) {
            return null;
        }

        let mapped2digitCode = IsoCountries.language31661ThreeDigitToCountryIso31661TwoDigit(code);
        if (null === mapped2digitCode) {
            return null;
        }

        let languageData = countries[mapped2digitCode.toUpperCase()] ?? null
        if(null === languageData){
            return null;
        }

        return languageData.name;
    }

    /**
     * @description will return the 2 digit country iso code (639-1) for provided spoken language (language name must be provided in english)
     *              returns null if no matches were found
     */
    public static getCountry639IsoCodeForSpokenLanguage(spokenLanguageName: string | null): string | null
    {
        if (null === spokenLanguageName) {
            return null;
        }

        let foundLanguage2DigitIsoCode: null | string = null;
        for (let isoCode2Digit in languages) {

            let singleLanguageData = languages[isoCode2Digit];
            if (singleLanguageData.name.toLowerCase() === spokenLanguageName.toLowerCase()) {
                foundLanguage2DigitIsoCode = isoCode2Digit;
                break
            }
        }

        return foundLanguage2DigitIsoCode;
    }

    /**
     * @description returns all countries base data
     */
    public static getAllCountriesData(): Array<Country>
    {
        let countriesData = [] as Array<Country>;
        for (let isoCode2Digit in countries) {

            let singleCountryData = countries[isoCode2Digit.toUpperCase()] ?? null;
            if (!singleCountryData) {
                continue;
            }

            let countryData: Country = {
                countryName     : singleCountryData.name,
                countryIsoCode  : isoCode2Digit,
                countryLanguage : null,
            };

            countriesData.push(countryData);
        }

        return countriesData;
    }

    /**
     * @description will return the country iso code (3166-1 alpha-2) for spoken language (in english)
     *             null is returned if no match is found
     */
    public static getCountry3166IsoCodeForSpokenLanguage(spokenLanguage: string): string | null
    {
        let languageIsoCode = IsoCountries.getCountry639IsoCodeForSpokenLanguage(spokenLanguage);
        if (TypeChecker.isNull(languageIsoCode)) {
            return null;
        }

        let countryIsoCode = IsoCountries.languageIso639toCountryIso31661TwoDigit(languageIsoCode as string);
        return countryIsoCode;
    }

    /**
     * @description will return the ISO 31661-1 (2 digit) country code for ISO 639-1 (2 digit)
     *              or null if nothing is found
     */
    private static languageIso639toCountryIso31661TwoDigit(languageIsoCode: string): string | null
    {
        /**
         * Mapping created from {@link https://github.com/lipis/flag-icons/issues/510}
         */
        let mapping = {
            "aa": "dj",
            "af": "za",
            "ak": "gh",
            "sq": "al",
            "am": "et",
            "ar": null,
            "hy": "am",
            "ay": null,
            "az": "az",
            "bm": "ml",
            "be": "by",
            "bn": "bd",
            "bi": "vu",
            "bs": "ba",
            "bg": "bg",
            "my": "mm",
            "ca": "ad",
            "zh": "cn",
            "hr": "hr",
            "cs": "cz",
            "da": "dk",
            "dv": "mv",
            "nl": "nl",
            "dz": "bt",
            "en": "gb",
            "et": "ee",
            "ee": null,
            "fj": "fj",
            "fil": "ph",
            "fi": "fi",
            "fr": "fr",
            "ff": null,
            "gaa": "gh",
            "ka": "ge",
            "de": "de",
            "el": "gr",
            "gn": null,
            "gu": "in",
            "ht": "ht",
            "ha": null,
            "he": "il",
            "hi": "in",
            "ho": "pg",
            "hu": "hu",
            "is": "is",
            "ig": "ng",
            "id": "id",
            "ga": "ie",
            "it": "it",
            "ja": "jp",
            "kr": "ne",
            "kk": "kz",
            "km": "kh",
            "kmb": "ao",
            "rw": "rw",
            "kg": "cg",
            "ko": "kr",
            "kj": "ao",
            "ku": "iq",
            "ky": "kg",
            "lo": "la",
            "la": "va",
            "lv": "lv",
            "ln": "cg",
            "lt": "lt",
            "lu": "cd",
            "lb": "lu",
            "mk": "mk",
            "mg": "mg",
            "ms": "my",
            "mt": "mt",
            "mi": "nz",
            "mh": "mh",
            "mn": "mn",
            "mos": "bf",
            "ne": "np",
            "nd": "zw",
            "nso": "za",
            "no": "no",
            "nb": "no",
            "nn": "no",
            "ny": "mw",
            "pap": "aw",
            "ps": "af",
            "fa": "ir",
            "pl": "pl",
            "pt": "pt",
            "pa": "in",
            "qu": "wh",
            "ro": "ro",
            "rm": "ch",
            "rn": "bi",
            "ru": "ru",
            "sg": "cf",
            "sr": "rs",
            "srr": "sn",
            "sn": "zw",
            "si": "lk",
            "sk": "sk",
            "sl": "si",
            "so": "so",
            "snk": "sn",
            "nr": "za",
            "st": "ls",
            "es": "es",
            "sw": null,
            "ss": "sz",
            "sv": "se",
            "tl": "ph",
            "tg": "tj",
            "ta": "lk",
            "te": "in",
            "tet": "tl",
            "th": "th",
            "ti": "er",
            "tpi": "pg",
            "ts": "za",
            "tn": "bw",
            "tr": "tr",
            "tk": "tm",
            "uk": "ua",
            "umb": "ao",
            "ur": "pk",
            "uz": "uz",
            "ve": "za",
            "vi": "vn",
            "cy": "gb",
            "wo": "sn",
            "xh": "za",
            "yo": null,
            "zu": "za"
        };

        return mapping[languageIsoCode.toLowerCase()] ?? null;
    }

    /**
     * @description will return the ISO 31661-1 (2 digit) country code for 31661-1 (2 digit)
     *              or null if nothing is found
     */
    private static language31661ThreeDigitToCountryIso31661TwoDigit(languageIsoCode: string): string | null
    {
        /**
         * Mapping created from {@link https://www.iban.com/country-codes}
         */
        let mapping = {
            "AFG": "AF",
            "ALB": "AL",
            "DZA": "DZ",
            "ASM": "AS",
            "AND": "AD",
            "AGO": "AO",
            "AIA": "AI",
            "ATA": "AQ",
            "ATG": "AG",
            "ARG": "AR",
            "ARM": "AM",
            "ABW": "AW",
            "AUS": "AU",
            "AUT": "AT",
            "AZE": "AZ",
            "BHS": "BS",
            "BHR": "BH",
            "BGD": "BD",
            "BRB": "BB",
            "BLR": "BY",
            "BEL": "BE",
            "BLZ": "BZ",
            "BEN": "BJ",
            "BMU": "BM",
            "BTN": "BT",
            "BOL": "BO",
            "BES": "BQ",
            "BIH": "BA",
            "BWA": "BW",
            "BVT": "BV",
            "BRA": "BR",
            "IOT": "IO",
            "BRN": "BN",
            "BGR": "BG",
            "BFA": "BF",
            "BDI": "BI",
            "CPV": "CV",
            "KHM": "KH",
            "CMR": "CM",
            "CAN": "CA",
            "CYM": "KY",
            "CAF": "CF",
            "TCD": "TD",
            "CHL": "CL",
            "CHN": "CN",
            "CXR": "CX",
            "CCK": "CC",
            "COL": "CO",
            "COM": "KM",
            "COD": "CD",
            "COG": "CG",
            "COK": "CK",
            "CRI": "CR",
            "HRV": "HR",
            "CUB": "CU",
            "CUW": "CW",
            "CYP": "CY",
            "CZE": "CZ",
            "CIV": "CI",
            "DNK": "DK",
            "DJI": "DJ",
            "DMA": "DM",
            "DOM": "DO",
            "ECU": "EC",
            "EGY": "EG",
            "SLV": "SV",
            "GNQ": "GQ",
            "ERI": "ER",
            "EST": "EE",
            "SWZ": "SZ",
            "ETH": "ET",
            "FLK": "FK",
            "FRO": "FO",
            "FJI": "FJ",
            "FIN": "FI",
            "FRA": "FR",
            "GUF": "GF",
            "PYF": "PF",
            "ATF": "TF",
            "GAB": "GA",
            "GMB": "GM",
            "GEO": "GE",
            "DEU": "DE",
            "GHA": "GH",
            "GIB": "GI",
            "GRC": "GR",
            "GRL": "GL",
            "GRD": "GD",
            "GLP": "GP",
            "GUM": "GU",
            "GTM": "GT",
            "GGY": "GG",
            "GIN": "GN",
            "GNB": "GW",
            "GUY": "GY",
            "HTI": "HT",
            "HMD": "HM",
            "VAT": "VA",
            "HND": "HN",
            "HKG": "HK",
            "HUN": "HU",
            "ISL": "IS",
            "IND": "IN",
            "IDN": "ID",
            "IRN": "IR",
            "IRQ": "IQ",
            "IRL": "IE",
            "IMN": "IM",
            "ISR": "IL",
            "ITA": "IT",
            "JAM": "JM",
            "JPN": "JP",
            "JEY": "JE",
            "JOR": "JO",
            "KAZ": "KZ",
            "KEN": "KE",
            "KIR": "KI",
            "PRK": "KP",
            "KOR": "KR",
            "KWT": "KW",
            "KGZ": "KG",
            "LAO": "LA",
            "LVA": "LV",
            "LBN": "LB",
            "LSO": "LS",
            "LBR": "LR",
            "LBY": "LY",
            "LIE": "LI",
            "LTU": "LT",
            "LUX": "LU",
            "MAC": "MO",
            "MDG": "MG",
            "MWI": "MW",
            "MYS": "MY",
            "MDV": "MV",
            "MLI": "ML",
            "MLT": "MT",
            "MHL": "MH",
            "MTQ": "MQ",
            "MRT": "MR",
            "MUS": "MU",
            "MYT": "YT",
            "MEX": "MX",
            "FSM": "FM",
            "MDA": "MD",
            "MCO": "MC",
            "MNG": "MN",
            "MNE": "ME",
            "MSR": "MS",
            "MAR": "MA",
            "MOZ": "MZ",
            "MMR": "MM",
            "NAM": "NA",
            "NRU": "NR",
            "NPL": "NP",
            "NLD": "NL",
            "NCL": "NC",
            "NZL": "NZ",
            "NIC": "NI",
            "NER": "NE",
            "NGA": "NG",
            "NIU": "NU",
            "NFK": "NF",
            "MNP": "MP",
            "NOR": "NO",
            "OMN": "OM",
            "PAK": "PK",
            "PLW": "PW",
            "PSE": "PS",
            "PAN": "PA",
            "PNG": "PG",
            "PRY": "PY",
            "PER": "PE",
            "PHL": "PH",
            "PCN": "PN",
            "POL": "PL",
            "PRT": "PT",
            "PRI": "PR",
            "QAT": "QA",
            "MKD": "MK",
            "ROU": "RO",
            "RUS": "RU",
            "RWA": "RW",
            "REU": "RE",
            "BLM": "BL",
            "SHN": "SH",
            "KNA": "KN",
            "LCA": "LC",
            "MAF": "MF",
            "SPM": "PM",
            "VCT": "VC",
            "WSM": "WS",
            "SMR": "SM",
            "STP": "ST",
            "SAU": "SA",
            "SEN": "SN",
            "SRB": "RS",
            "SYC": "SC",
            "SLE": "SL",
            "SGP": "SG",
            "SXM": "SX",
            "SVK": "SK",
            "SVN": "SI",
            "SLB": "SB",
            "SOM": "SO",
            "ZAF": "ZA",
            "SGS": "GS",
            "SSD": "SS",
            "ESP": "ES",
            "LKA": "LK",
            "SDN": "SD",
            "SUR": "SR",
            "SJM": "SJ",
            "SWE": "SE",
            "CHE": "CH",
            "SYR": "SY",
            "TWN": "TW",
            "TJK": "TJ",
            "TZA": "TZ",
            "THA": "TH",
            "TLS": "TL",
            "TGO": "TG",
            "TKL": "TK",
            "TON": "TO",
            "TTO": "TT",
            "TUN": "TN",
            "TUR": "TR",
            "TKM": "TM",
            "TCA": "TC",
            "TUV": "TV",
            "UGA": "UG",
            "UKR": "UA",
            "ARE": "AE",
            "GBR": "GB",
            "UMI": "UM",
            "USA": "US",
            "URY": "UY",
            "UZB": "UZ",
            "VUT": "VU",
            "VEN": "VE",
            "VNM": "VN",
            "VGB": "VG",
            "VIR": "VI",
            "WLF": "WF",
            "ESH": "EH",
            "YEM": "YE",
            "ZMB": "ZM",
            "ZWE": "ZW",
            "ALA": "AX",
        }

        return mapping[languageIsoCode.toUpperCase()] ?? null;
    }
}
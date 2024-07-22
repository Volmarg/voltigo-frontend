import {FontAwesomeIcon, FontAwesomeIconProps} from '@fortawesome/vue-fontawesome';
import { library }                             from '@fortawesome/fontawesome-svg-core';

import {
    faBriefcase,
    faGlobeAmericas,
    faGlobe,
    faTimes,
    faDollarSign,
    faEnvelopeOpenText,
    faPhone,
    faHome,
    faSuitcase,
    faCloudUploadAlt,
    faCloudDownloadAlt,
    faFile,
    faQuestionCircle,
    faTrash,
    faSync,
    faPaperPlane,
    faMinus,
    faShareSquare,
    faFilter,
    faWrench,
    faUser,
    faKey,
    faWallet,
    faFilePdf,
    faPlus,
    faLongArrowAltRight,
    faChevronUp,
    faChevronDown,
    faQuestion,
    faCheck,
    faMicrophone,
} from '@fortawesome/free-solid-svg-icons';

import {
    faEye,
    faCalendarAlt
} from '@fortawesome/free-regular-svg-icons';


/**
 * @description this class handles loading of fontawesome icons
 *              it was created to remove possibly growing code, as each icon has
 *              to be imported separately and added to the fontawesome loader
 *
 * @link https://github.com/FortAwesome/vue-fontawesome
 */
export default class Fontawesome
{
    /**
     * @description will return configured and ready to use fontawesome component
     */
    public static getConfiguredComponent(): FontAwesomeIconProps
    {
        library.add(faBriefcase);
        library.add(faGlobeAmericas);
        library.add(faEye);
        library.add(faTimes);
        library.add(faDollarSign);
        library.add(faEnvelopeOpenText);
        library.add(faPhone);
        library.add(faHome);
        library.add(faCalendarAlt);
        library.add(faSuitcase);
        library.add(faCloudUploadAlt);
        library.add(faCloudDownloadAlt);
        library.add(faFile);
        library.add(faQuestionCircle);
        library.add(faTrash);
        library.add(faSync);
        library.add(faPaperPlane);
        library.add(faMinus);
        library.add(faShareSquare);
        library.add(faFilter);
        library.add(faWrench);
        library.add(faUser);
        library.add(faKey);
        library.add(faWallet);
        library.add(faFilePdf);
        library.add(faPlus);
        library.add(faLongArrowAltRight);
        library.add(faChevronUp);
        library.add(faChevronDown);
        library.add(faQuestion);
        library.add(faCheck);
        library.add(faMicrophone);
        library.add(faGlobe);

        return FontAwesomeIcon;
    }
}
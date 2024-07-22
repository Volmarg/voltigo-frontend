import UrlService          from "@/scripts/Core/Services/Url/UrlService";
import StringTypeProcessor from "@/scripts/Core/Services/TypesProcessors/StringTypeProcessor";

import BaseError from "@/scripts/Core/Error/BaseError";

type ServiceData = {
    name: string,
    homePageUrl: string,
    logoFileName: string,
    description?: null | string,
    target?: null | string,
}

/**
 * @description provides variety of information about the job offer services, such as its name, logo, description etc.
 */
export default class JobServiceDataProvider {

    public static readonly LOGO_RELATIVE_PATH = "/image/job-service/logo/";

    private static readonly DATA_MAPPING: Record<string, ServiceData> = {
        "xing.com": {
            name: "Xing",
            homePageUrl: "xing.com",
            logoFileName: "xing.com.png",
            description: "jobService.xing_com.description"
        },
        "monster.de": {
            name: "Monster",
            homePageUrl: "monster.de",
            logoFileName: "monster.png",
            description: "jobService.monster.description"
        },
        "monster.fr": {
            name: "Monster",
            homePageUrl: "monster.fr",
            logoFileName: "monster.png",
            description: "jobService.monster.description"
        },
        "kimeta.de": {
            name: "Kimeta",
            homePageUrl: "kimeta.de",
            logoFileName: "kimeta.de.png",
            description: "jobService.kimeta_de.description"
        },
        "tideri.de": {
            name: "Tideri",
            homePageUrl: "tideri.de",
            logoFileName: "tideri.de.png",
            description: "jobService.tideri_de.description"
        },
        "jobs.de": {
            name: "Jobs",
            homePageUrl: "jobs.de",
            logoFileName: "jobs.de.png",
            description: "jobService.kariera_group.description"
        },
        "jobware.de": {
            name: "Jobware",
            homePageUrl: "jobware.de",
            logoFileName: "jobware.de.png",
            description: "jobService.jobware_de.description"
        },
        "de.indeed.com": {
            name: "Indeed",
            homePageUrl: "de.indeed.com",
            logoFileName: "indeed.com.png",
            description: "jobService.indeed.description"
        },
        "pl.indeed.com": {
            name: "Indeed",
            homePageUrl: "pl.indeed.com",
            logoFileName: "indeed.com.png",
            description: "jobService.indeed.description"
        },
        "fr.indeed.com": {
            name: "Indeed",
            homePageUrl: "fr.indeed.com",
            logoFileName: "indeed.com.png",
            description: "jobService.indeed.description"
        },
        "es.indeed.com": {
            name: "Indeed",
            homePageUrl: "es.indeed.com",
            logoFileName: "indeed.com.png",
            description: "jobService.indeed.description"
        },
        "no.indeed.com": {
            name: "Indeed",
            homePageUrl: "no.indeed.com",
            logoFileName: "indeed.com.png",
            description: "jobService.indeed.description"
        },
        "aplikuj.pl": {
            name: "aplikuj.pl",
            homePageUrl: "aplikuj.pl",
            logoFileName: "aplikuj.pl.png",
            description: "jobService.aplikuj_pl.description"
        },
        "fachpraca.pl": {
            name: "Fachpraca",
            homePageUrl: "fachpraca.pl",
            logoFileName: "fachpraca.pl.png",
            description: "jobService.fachpraca_pl.description"
        },
        "goldenline.pl": {
            name: "Goldenline",
            homePageUrl: "goldenline.pl",
            logoFileName: "goldenline.pl.png",
            description: "jobService.goldenline_pl.description"
        },
        "infopraca.pl": {
            name: "infopraca.pl",
            homePageUrl: "infopraca.pl",
            logoFileName: "infopraca.pl.png",
            description: "jobService.infopraca_pl.description"
        },
        "jobs.pl": {
            name: "jobs.pl",
            homePageUrl: "jobs.pl",
            logoFileName: "jobs.pl.png",
            description: "jobService.jobs_pl.description"
        },
        "praca.pl": {
            name: "praca.pl",
            homePageUrl: "praca.pl",
            logoFileName: "praca.pl.png",
            description: "jobService.praca_pl.description"
        },
        "pracuj.pl": {
            name: "Pracuj.pl",
            homePageUrl: "pracuj.pl",
            logoFileName: "pracuj.pl.png",
            description: "jobService.pracuj_pl.description"
        },
        "theprotocol.it": {
            name: "Theprotocol",
            homePageUrl: "theprotocol.it",
            logoFileName: "theprotocol.it.png",
            description: "jobService.theprotocol_it.description"
        },
        "gowork.pl": {
            name: "Gowork",
            homePageUrl: "gowork.pl",
            logoFileName: "gowork.pl.png",
            description: "jobService.gowork_pl.description"
        },
        "interviewme.pl": {
            name: "Interviewme",
            homePageUrl: "interviewme.pl",
            logoFileName: "interviewme.pl.png",
            description: "jobService.interviewme_pl.description"
        },
        "adzuna.pl": {
            name: "Adzuna",
            homePageUrl: "adzuna.pl",
            logoFileName: "adzuna.pl.png",
            description: "jobService.adzuna_pl.description"
        },
        "bankjob.de": {
            name: "Bankjob",
            homePageUrl: "bankjob.de",
            logoFileName: "bankjob.de.png",
            description: "jobService.bankjob_de.description"
        },
        "stepstone.de": {
            name: "Stepstone",
            homePageUrl: "stepstone.de",
            logoFileName: "stepstone.de.png",
            description: "jobService.stepstone_de.description"
        },
        "cadremploi.fr": {
            name: "Cadremploi",
            homePageUrl: "cadremploi.fr",
            logoFileName: "cadremploi.fr.png",
            description: "jobService.cadremploi_fr.description"
        },
        "jobs.meinestadt.de": {
            name: "Meinestadt",
            homePageUrl: "jobs.meinestadt.de",
            logoFileName: "jobs.meinestadt.de.png",
            description: "jobService.meinstadt_de.description"
        },
        "anzeigen.jobsintown.de": {
            name: "Jobsintown",
            homePageUrl: "anzeigen.jobsintown.de",
            logoFileName: "anzeigen.jobsintown.de.png",
            description: "jobService.jobsintown_de.description"
        },
        "stellenanzeigen.de": {
            name: "Stellenanzeigen",
            homePageUrl: "stellenanzeigen.de",
            logoFileName: "stellenanzeigen.de.png",
            description: "jobService.stellenazeigen_de.description"
        },
        "absolventa.de": {
            name: "Absolventa",
            homePageUrl: "absolventa.de",
            logoFileName: "absolventa.de.png",
            description: "jobService.absolventa_de.description"
        },
        "stellenonline.de": {
            name: "Stellenonline",
            homePageUrl: "stellenonline.de",
            logoFileName: "stellenonline.de.png",
            description: "jobService.stelleonline_de.description"
        },
        "hellowork.com": {
            name: "Hellowork",
            homePageUrl: "hellowork.com",
            logoFileName: "hellowork.com.png",
            description: "jobService.hellowork_com.description"
        },
        "candidat.pole-emploi.fr": {
            name: "PoleEmploi",
            homePageUrl: "candidat.pole-emploi.fr",
            logoFileName: "1jeune1solution.gouv.fr.png",
            description: "jobService.pole-emploi_fr.description"
        },
        "apec.fr": {
            name: "Apec",
            homePageUrl: "apec.fr",
            logoFileName: "apec.fr.png",
            description: "jobService.apec_fr.description"
        },
        "es.talent.com": {
            name: "Talent",
            homePageUrl: "es.talent.com",
            logoFileName: "talent.com.png",
            description: "jobService.talent_com.description"
        },
        "se.talent.com": {
            name: "Talent",
            homePageUrl: "se.talent.com",
            logoFileName: "talent.com.png",
            description: "jobService.talent_com.description"
        },
        "elempleo.com": {
            name: "Elempleo",
            homePageUrl: "elempleo.com",
            logoFileName: "elempleo.com.png",
            description: "jobService.elempleo_com.description"
        },
        "infoempleo.com": {
            name: "Infoempleo",
            homePageUrl: "infoempleo.com",
            logoFileName: "infoempleo.com.png",
            description: "jobService.infoempleo_com.description"
        },
        "infojobs.net": {
            name: "Infojobs",
            homePageUrl: "infojobs.net",
            logoFileName: "infojobs.net.png",
            description: "jobService.infojobs_net.description"
        },
        "jobbland.se": {
            name: "Jobbland",
            homePageUrl: "jobbland.se",
            logoFileName: "jobbland.se.png",
            description: "jobService.jobbland.se.description"
        },
        "jobbguru.se": {
            name: "Jobbguru",
            homePageUrl: "jobbguru.se",
            logoFileName: "jobbguru.se.png",
            description: "jobService.kariera_group.description"
        },
        "jobbsafari.se": {
            name: "Jobbsafari",
            homePageUrl: "jobbsafari.se",
            logoFileName: "jobbsafari.png",
            description: "jobService.jobbsafari_se.description"
        },
        "jobbsafari.no": {
            name: "Jobbsafari",
            homePageUrl: "jobbsafari.no",
            logoFileName: "jobbsafari.png",
            description: "jobService.jobbsafari_no.description"
        },
        "jobb.blocket.se": {
            name: "JobbBlocket",
            homePageUrl: "jobb.blocket.se",
            logoFileName: "jobb.blocket.se.png",
            description: "jobService.blocket_se.description"
        },
        "click.appcast.io": {
            name: "Appcast",
            homePageUrl: "appcast.io",
            logoFileName: "appcast.io.png",
            description: "jobService.appcast_io.description"
        },
        "appcast.io": {
            name: "Appcast",
            homePageUrl: "appcast.io",
            logoFileName: "appcast.io.png",
            description: "jobService.appcast_io.description"
        },
        "karrierestart.no": {
            name: "KarriereStart",
            homePageUrl: "karrierestart.no",
            logoFileName: "karrierestart.no.png",
            description: "jobService.karrierestart_no.description"
        },
        "thehub.io": {
            name: "TheHub",
            homePageUrl: "thehub.io",
            logoFileName: "thehub.io.png",
            description: "jobService.thehub_io.description"
        },
    };

    /**
     * @description provides the job service data based on the given offer
     */
    public static getData(offerUrl: string): ServiceData
    {
        let host = UrlService.getHost(offerUrl, true);
        if (!host) {
            throw new BaseError(`Could not extract host from url: ${offerUrl}`);
        }

        let data = JobServiceDataProvider.DATA_MAPPING[host];
        if (!data) {
            return JobServiceDataProvider.getDefault(offerUrl);
        }

        return data;
    }

    /**
     * @description this returns a fallback data in case of not having any information about given job service yet.
     *              Such case is possible if:
     *              - service was forgotten about,
     *              - the service provides offers from other services as well,
     *                and these services then have not yet been described
     */
    private static getDefault(offerUrl: string): ServiceData
    {
        let host = UrlService.getHost(offerUrl, true);
        if (!host) {
            throw new BaseError(`Could not extract host from url: ${offerUrl}`);
        }

        let partials = host.split('.').reverse();

        return {
            name: StringTypeProcessor.ucFirst(partials.pop() ?? ''),
            homePageUrl: host,
            description: "jobService.default.description",
            logoFileName: "not-found.png"
        }
    }
}

export {ServiceData};
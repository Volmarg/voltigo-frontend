import {JobShortInformation} from "@/scripts/Entity/Job/JobShortInformation";

interface JobApplication extends ObjectConstructor {
    status: jobApplicationStatus,
    jobOffer: JobShortInformation,
    created: string,
    email: string,
}

enum jobApplicationStatus {
    SENT,
    PENDING,
}

export {JobApplication, jobApplicationStatus};
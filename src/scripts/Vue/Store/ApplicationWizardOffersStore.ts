/**
 * @description defines the store for offers used in application process. This allows the user to "select-back" the
 *              de-selected offers. The de-selected offers will be present as long as the wizard remains open.
 *              Once the wizard is closed (aka it's session is terminated), the store gets cleared.
 */
import {defineStore} from 'pinia'

import {JobOfferAnalyzed} from "@/scripts/Entity/Job/JobOfferAnalyzed";

const applicationWizardOffersStore = defineStore('applicationWizardOffersStore', {
    state: () => ({
        offersList: [] as Array<JobOfferAnalyzed>,
    }),
    actions: {
        /**
         * @description sets the offers list
         */
        setOffers(offersList: Array<JobOfferAnalyzed>): void {
            this.offersList = offersList;
        },
        /**
         * @description will update the selected offers list (subset of all offers list)
         */
        updateOffersSelection(offerId: number, isSelected: boolean): void {
            for (let offer of this.offersList) {
                if (offer.identifier != offerId) {
                    continue;
                }

                offer.isSelected = isSelected;
                break;
            }
        },
        /**
         * @description return count of selected offers (the ones for which checkbox is checked)
         */
        getSelectedOffersCount(): number {
            let count = 0;
            for (let offer of this.offersList) {
                count += Number(offer.isSelected);
            }

            return count;
        },
        /**
         * @description get the offers used in application process
         */
        getOffers(): Array<JobOfferAnalyzed> {
            return this.offersList;
        },
        /**
         * @description clears the wizard offers selection
         */
        clearOffersSelection(): void {
            this.offersList = [];
        },
    }
});

type ApplicationWizardOffersStore = {
    offersList: Array<JobOfferAnalyzed>,
    setOffers: (offersList: Array<JobOfferAnalyzed>) => void,
    getOffers: () => Array<JobOfferAnalyzed>,
    getSelectedOffersCount: () => number,
    clearOffersSelection: () => void,
    updateOffersSelection: (offerId: number, isSelected: boolean) => void,
}

export {applicationWizardOffersStore, ApplicationWizardOffersStore};
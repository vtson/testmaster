import { getSets, setIdToLabel } from ".";
import { Subtitles } from "../../utils";
import { CardDetailsType, CardType } from "../cardSearchTypes";
import { toMastermindCardDetails } from "./mastermindProcessor";
export const toSchemeCardDetails = (card, detailsType) => {
    return {
        detailsType: detailsType,
        transformed: card.transformed,
        veiled: card.veiled,
        unveiled: card.unveiled,
        description: card.abilities,
    };
};
export const processScheme = (addCard, scheme, set) => {
    scheme.cards?.forEach(card => {
        let details;
        const oopMM = card;
        const schemeCard = card;
        if (oopMM && oopMM.overrideType === 2) {
            details = toMastermindCardDetails(oopMM, CardDetailsType.OopMastermindDetails);
        }
        else {
            details = toSchemeCardDetails(schemeCard, CardDetailsType.SchemeCardDetail);
        }
        getSets(set.id, scheme.set).forEach(setId => {
            addCard({
                name: card.name || scheme.name,
                subtitle: Subtitles.schemeSubtitle(card, setId),
                imageUrl: card.imageUrl || scheme.imageUrl || '',
                set: setIdToLabel(setId),
                type: CardType.Scheme,
                group: scheme.name,
                details,
            });
        });
    });
};
//# sourceMappingURL=schemeProcessor.js.map
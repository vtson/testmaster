import { getSets, setIdToLabel } from ".";
import { Subtitles } from "../../utils";
import { CardDetailsType, CardType } from "../cardSearchTypes";
export const processWound = (addCard, wound, set) => {
    wound.cards?.forEach(card => {
        const woundCard = card;
        const details = {
            detailsType: CardDetailsType.WoundCardDetail,
            qtd: woundCard.qtd,
            description: woundCard.abilities,
        };
        if (card.cost !== undefined)
            details.cost = card.cost.toString();
        if (card.attack !== undefined)
            details.attack = card.attack;
        if (card.recruit !== undefined)
            details.recruit = card.recruit;
        getSets(set.id, wound.set).forEach(setId => {
            addCard({
                name: wound.name,
                subtitle: Subtitles.woundSubtitle(card),
                imageUrl: card.imageUrl || wound.imageUrl || '',
                set: setIdToLabel(setId),
                type: CardType.Wound,
                group: 'Wounds',
                details,
            });
        });
    });
};
//# sourceMappingURL=woundProcessor.js.map